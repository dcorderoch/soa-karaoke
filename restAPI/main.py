from google.cloud import storage
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask import Flask, request
from flask import session, g
from flask import current_app
from keycloak_utils import * 
import logging
import datetime
import  base64
import time
import os
import json

app = Flask(__name__)
cors = CORS(app)
app.config['MONGO_DBNAME'] = 'SOA'
app.config['MONGO_URI'] = 'mongodb+srv://soa:SOA123@soa.5dx1v.mongodb.net/SOA'
logging.basicConfig(level=logging.DEBUG)

app.config.from_object('local_settings')
app.config.from_envvar('KEYCLOAK_FLASK_SETTINGS')

mongo = PyMongo(app)

def upload_blob(bucket_name, file,lyric, file_name,lyric_name):
    storage_client = storage.Client.from_service_account_json("Key/calcium-branch-324922-75e2e2b8d30e.json")
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    image_64_decode = base64.b64decode(file)
    image_result = open('Temp/temp.mp3', 'wb')
    image_result.write(image_64_decode)
    image_result.close()
    blob.upload_from_filename('Temp/temp.mp3')

    blob = bucket.blob(lyric_name)
    image_64_decode = base64.b64decode(lyric)
    image_result = open('Temp/temp.lrc', 'wb')
    image_result.write(image_64_decode)
    image_result.close()
    blob.upload_from_filename('Temp/temp.lrc')
    os.remove('Temp/temp.lrc')
    os.remove('Temp/temp.mp3')


def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client.from_service_account_json("Key/calcium-branch-324922-75e2e2b8d30e.json")
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(days=7),
        method="GET",
    )
    return url
@app.route('/songs', methods=['GET'])
def get_all_songs():
    try:
      songs = mongo.db.songs
      output = []
      for s in songs.find():
        id=str(s['_id'])
        output.append({'id' :id ,'name' : s['name'], 'artist' : s['artist'], 'album' : s['album']})
      return jsonify({'songs' : output})
    except Exception as e:
        print(e)

@app.route('/songs/filter/<by>/<value>', methods=['GET'])
def get_filtered_songs(by,value):
  songs = mongo.db.songs
  output = []
  if by=="lyric":
      for s in songs:
          if value in s['lyricDetail']:
              id = str(s['_id'])
              output.append({'id': id, 'name': s['name'], 'artist': s['artist'],'album': s['album'],'lyricDetail': s['lyricDetail']})
  else:
      for s in songs.find({by:value}):
        id=str(s['_id'])
        output.append({'id' :id ,'name' : s['name'], 'artist' : s['artist'], 'album' : s['album'],'lyricDetail': s['lyricDetail']})
  return jsonify({'songs' : output})
@app.route('/songs', methods=['POST'])
def add_song():
  try:
      songs = mongo.db.songs
      name = request.json['name']
      file = request.json['file']
      lyric = request.json['lyric']
      artist = request.json['artist']
      album= request.json['album']
      songs.insert_one({'name': name, 'file': file, 'lyric':lyric,'artist':artist,'album':album})
      upload_blob("soa_proyecto1",request.json['file'],request.json['lyric'],request.json['name'],request.json['name']+"_Lyric")
      return jsonify({'error': False,'message':'Successful insert'})
  except Exception as e:
      print(e)
      return jsonify({'error': True, 'message': 'Error saving song'})

@app.route('/register', methods=['POST'])
def register():
  try:
      users = mongo.db.users
      userName = request.json['userName']
      user = users.find_one({'userName': userName})
      if user:
          return jsonify({'error': True, 'message': 'UserName already exists'})
      password = request.json['password']
      users.insert_one({'userName': userName, 'password': password, 'isPremium':False})
      return jsonify({'error': False,'message':'Successful insert'})
  except:
      return jsonify({'error': True, 'message': 'Error user register'})

@app.route('/updatePremium', methods=['PUT'])
def upgradePremium():
  try:
      users = mongo.db.users
      userName = request.json['userName']
      filter = {'userName': userName}
      newvalues = {"$set": {'isPremium': True}}

      users.update_one(filter, newvalues)
      return jsonify({'error': False,'message':'Successful upgrade to premium'})
  except:
      return jsonify({'error': True, 'message': 'Error user upgrade'})


@app.route('/songs', methods=['PUT'])
def updateSong():
  try:
      songs = mongo.db.songs
      name = request.json['name']
      file = request.json['file']
      lyric = request.json['lyric']
      artist = request.json['artist']
      album = request.json['album']
      id = request.json['id']
      lyrics = base64.b64decode(lyric).decode()
      filter = {'_id': ObjectId(id)}
      newvalues = {"$set": {'name': name, 'file': file, 'lyric':lyric,'artist':artist,'album':album,'lyricDetail':lyrics}}
      songs.update_one(filter, newvalues)
      if(lyric!="" or file!=""):
          upload_blob("soa_proyecto1",request.json['file'],request.json['lyric'],request.json['name'],request.json['name']+"_Lyric")

      return jsonify({'error': False,'message':'Successful update'})
  except:
      return jsonify({'error': True, 'message': 'Error updating song'})\

@app.route('/songs', methods=['DELETE'])
def deleteSong():
  try:
      songs = mongo.db.songs
      id = request.json['id']
      filter = {'_id': ObjectId(id)}
      songs.delete_one(filter)
      return jsonify({'error': False,'message':'Successful delete'})
  except:
      return jsonify({'error': True, 'message': 'Error deleting song'})
@app.route('/songs/<name>', methods=['GET'])
def get_one_song(name):
  songs = mongo.db.songs
  song = songs.find_one({'name' : name})
  id = str(song['_id'])
  artist = str(song['artist'])
  album = str(song['album'])
  if song:
      song=download_blob("soa_proyecto1",name,"Songs/"+name+".mp3")
      lyric=download_blob("soa_proyecto1",name+"_Lyric","Lyrics/"+name+"_Lyric.lrc")
      output={'file':song,'lyric': lyric,'name' : name,'id' : id,'artist':artist,'album':album}

  else:
    output = "No such name"
  return jsonify({'result' : output})

@app.route('/setCORS', methods=['GET'])
def cors_configuration():
    storage_client = storage.Client.from_service_account_json("Key/calcium-branch-324922-75e2e2b8d30e.json")
    bucket = storage_client.bucket("soa_proyecto1")
    bucket.cors = [
        {
            "origin": ["*"],
            "responseHeader": [
                "Content-Type",
                "x-goog-resumable"],
            "method": ['PUT', 'POST','GET','DELETE'],
            "maxAgeSeconds": 3600000
        }
    ]
    bucket.patch()
    return jsonify({'result': "CORS active"})


###################################################
# KeyCloakFeature
###################################################

@app.before_request
def load_user():
    g.username = session.get('username')
    g.access_token = session.get('access_token')
    g.refresh_token = session.get('refresh_token')

@app.route('/createAUser', methods=['POST'])
def createAUser():
    req_data = request.get_json()
    userName = req_data['username']
    userEmail = req_data['email']
    userPass = req_data['password']
    userType = req_data['type']
    admin = get_admin()
    create_user(admin, userName, userEmail, userPass)
    clientName = current_app.config.get('CLIENT_ID')
    user_id= admin.get_user_id(userName)
    client_id= admin.get_client_id(clientName)
    roleRep = getRoleByName(userType)
    admin.assign_client_role(user_id,client_id,roleRep)
    return "Added Successfully"

@app.route('/updateRole', methods=['POST'])
def updateAUser():
    req_data = request.get_json()
    userName = req_data['username']
    userType = req_data['type']
    admin = get_admin()
    clientName = current_app.config.get('CLIENT_ID')
    user_id= admin.get_user_id(userName)
    client_id= admin.get_client_id(clientName)
    roleRep = getRoleByName(userType)
    admin.assign_client_role(user_id,client_id,roleRep)
    roleRep = getRoleByName('standardUser')
    admin.delete_client_roles_of_user(user_id,client_id,roleRep)
    return "Role updated"

@app.route('/getRoleByUser/<username>', methods=['GET'])
def getRoleByUser(username):
    admin = get_admin()
    clientName = current_app.config.get('CLIENT_ID')
    user_id= admin.get_user_id(username)
    client_id= admin.get_client_id(clientName)
    return json.dumps(admin.get_client_roles_of_user(user_id,client_id))


@app.route('/getRealmRoles', methods=['GET'])
def getRealmRoles():
    admin = get_admin()
    return json.dumps(admin.get_realm_roles())

@app.route('/getAvailableRolesOf/<username>', methods=['GET'])
def getAvailableRolesOf(username):
    admin = get_admin()
    user_id= admin.get_user_id(username)
    if user_id!=None:
        clientName = current_app.config.get('CLIENT_ID')
        client_id= admin.get_client_id(clientName)
        return json.dumps(admin.get_available_client_roles_of_user(user_id,client_id))
    else:
        return "User Not Found"

@app.route('/getRoleOf/<username>', methods=['GET'])
def getRoleOf(username):
    admin = get_admin()
    user_id= admin.get_user_id(username)
    if user_id!=None:
        clientName = current_app.config.get('CLIENT_ID')
        client_id= admin.get_client_id(clientName)
        return json.dumps(admin.get_client_roles_of_user(user_id,client_id))
    else:
        return "User Not Found"
        
@app.route('/getRoleID/<rolename>', methods=['GET'])
def getRoleID(rolename):
    admin = get_admin()
    return get_RoleID(admin,g.username,rolename)
    
    

@app.route('/getClients', methods=['GET'])
def getClients():
    admin = get_admin()
    return json.dumps(admin.get_clients())



@app.route('/getUserLoggedInfo', methods=['GET'])
def getUserLoggedInfo():
    return {
        "username":g.username,
        "access-token":g.access_token
    }
@app.route('/getUserInfo', methods=['GET'])
def getUserInfo():
    access_token = g.access_token
    return get_userinfo(access_token)

@app.route('/login', methods=['POST'])
def login():
    req_data = request.get_json()
    userName = req_data['username']
    userPass = req_data['password']

    oidc_obj = get_oidc()
    token = get_token(oidc_obj, userName, userPass)
    print("\nTOKEN: %s\n" % token)
    if token:
        
        session['access_token'] = token['access_token']
        session['username'] = userName
        session['refresh_token']= token['refresh_token']
        return "Successfully Logged In"
    else:
        return "Log In Error. Check your credentials"

@app.route('/logout', methods=['GET'])
def logout():
    oidc_obj = get_oidc()
    refresh_token=g.refresh_token
    oidc_obj.logout(refresh_token)
    session.pop('username', None)
    session.pop('access_token', None)
    session.pop('refresh_token',None)
    return "Logged OUT"

@app.route('/getUsers', methods= ['GET'])
def getUsers():
    admin = get_admin()
    return json.dumps(admin.get_users({}))

if __name__ == "__main__":
    app.run()

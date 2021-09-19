from google.cloud import storage
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import datetime
app = Flask(__name__)
cors = CORS(app)
app.config['MONGO_DBNAME'] = 'SOA'
app.config['MONGO_URI'] = 'mongodb+srv://soa:SOA123@soa.5dx1v.mongodb.net/SOA'

mongo = PyMongo(app)

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client.from_service_account_json("Key/calcium-branch-324922-75e2e2b8d30e.json")
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
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
  songs = mongo.db.songs
  output = []
  for s in songs.find():
    id=str(s['_id'])
    output.append({'id' :id ,'name' : s['name'], 'lyric' : s['lyric'], 'file' : s['file'], 'artist' : s['artist'], 'album' : s['album']})
  return jsonify({'songs' : output})

@app.route('/songs/filter', methods=['GET'])
def get_filtered_songs():
  songs = mongo.db.songs
  output = []
  by =request.json['by']
  value = request.json['value']
  for s in songs.find({by:value}):
    id=str(s['_id'])
    output.append({'id' :id ,'name' : s['name'], 'lyric' : s['lyric'], 'file' : s['file'], 'artist' : s['artist'], 'album' : s['album']})
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
      upload_blob("soa_proyecto1",request.json['file'],request.json['name'])
      upload_blob("soa_proyecto1",request.json['lyric'],request.json['name']+"_Lyric")
      return jsonify({'error': False,'message':'Successful insert'})
  except:
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
      filter = {'_id': ObjectId(id)}
      newvalues = {"$set": {'name': name, 'file': file, 'lyric':lyric,'artist':artist,'album':album}}

      songs.update_one(filter, newvalues)
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
  if song:
      song=download_blob("soa_proyecto1",name,"Songs/"+name+".mp3")
      lyric=download_blob("soa_proyecto1",name+"_Lyric","Lyrics/"+name+"_Lyric.lrc")
      output={'song':song,'lyric': lyric}

  else:
    output = "No such name"
  return jsonify({'result' : output})

if __name__ == "__main__":
    app.run()


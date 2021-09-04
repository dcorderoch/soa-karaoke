from google.cloud import storage
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_pymongo import PyMongo

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

@app.route('/songs', methods=['GET'])
def get_all_songs():
  songs = mongo.db.songs
  output = []
  for s in songs.find():
    output.append({'name' : s['name'], 'lyric' : s['lyric'], 'file' : s['file'], 'artist' : s['artist'], 'album' : s['album']})
  return jsonify({'songs' : output})

@app.route('/songs', methods=['POST'])
def add_star():
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


if __name__ == "__main__":
    app.run()


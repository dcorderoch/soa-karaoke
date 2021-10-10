import base64
import datetime
import json
import os

from bson.objectid import ObjectId
from flask import Flask, jsonify, request, session, g
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from google.cloud import storage

from local_settings import get_config
import keycloak_utils as kc_utils

app = Flask(__name__)
CORS(app)
app.config["MONGO_DBNAME"] = "SOA"
app.config["MONGO_URI"] = "mongodb+srv://soa:SOA123@soa.5dx1v.mongodb.net/SOA"
app.secret_key = b'SMZ19'

mongo = PyMongo(app)


def __upload_blob(bucket, tmp_filename, blob_name, file_):
    blob = bucket.blob(blob_name)
    image_64_decode = base64.b64decode(file_)
    with open(tmp_filename, "wb") as image_result:
        image_result.write(image_64_decode)
    blob.upload_from_filename(tmp_filename)
    os.remove(tmp_filename)


def upload_song(bucket_name, file_, lyric, file_name, lyric_name):
    storage_client = storage.Client.from_service_account_json(
        "Key/calcium-branch-324922-75e2e2b8d30e.json"
    )
    bucket = storage_client.bucket(bucket_name)

    __upload_blob(bucket, "temp.mp3", file_name, file_)

    __upload_blob(bucket, "temp.lrc", lyric_name, lyric)


def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client.from_service_account_json(
        "Key/calcium-branch-324922-75e2e2b8d30e.json"
    )
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(days=7),
        method="GET",
    )
    return url


@app.route("/songs", methods=["GET"])
@cross_origin(origin='*')
def get_all_songs():
    try:
        songs = mongo.db.songs
        output = []
        for song in songs.find():
            id_ = str(song["_id"])
            output.append(
                {
                    "id": id_,
                    "name": song["name"],
                    "artist": song["artist"],
                    "album": song["album"],
                }
            )
        return jsonify({"songs": output})
    except Exception as exc:
        return jsonify({"songs": []})


@app.route("/songs/filter/<by>/<value>", methods=["GET"])
@cross_origin(origin='*')
def get_filtered_songs(by, value):
    songs = mongo.db.songs
    output = []
    if by == "lyric":
        for song in songs.find():
            if value in str(song["lyricDetail"]):
                id_ = str(song["_id"])
                output.append(
                    {
                        "id": id_,
                        "name": song["name"],
                        "artist": song["artist"],
                        "album": song["album"],
                    }
                )
    else:
        for song in songs.find({by: value}):
            id_ = str(song["_id"])
            output.append(
                {
                    "id": id_,
                    "name": song["name"],
                    "artist": song["artist"],
                    "album": song["album"],
                }
            )
    return jsonify({"songs": output})


@app.route("/songs", methods=["POST"])
@cross_origin(origin='*')
def add_song():
    try:
        songs = mongo.db.songs
        name = request.json["name"]
        file_ = request.json["file"]
        lyric = request.json["lyric"]
        artist = request.json["artist"]
        album = request.json["album"]
        lyrics = base64.b64decode(lyric).decode()
        songs.insert_one(
            {
                "name": name,
                "file": file_,
                "lyric": lyric,
                "artist": artist,
                "album": album,
                "lyricDetail": lyrics,
            }
        )
        upload_song(
            "soa_proyecto1",
            request.json["file"],
            request.json["lyric"],
            request.json["name"],
            request.json["name"] + "_Lyric",
        )
        return jsonify({"error": False, "message": "Successful insert"})
    except Exception as exc:
        return jsonify({"error": True, "message": "Error saving song"})


@app.route("/register", methods=["POST"])
@cross_origin(origin='*')
def register():
    try:
        users = mongo.db.users
        user_name = request.json["userName"]
        user = users.find_one({"userName": user_name})
        if user:
            return jsonify(
                {"error": True, "message": "UserName already exists"}
            )
        password = request.json["password"]
        users.insert_one(
            {"userName": user_name, "password": password, "isPremium": False}
        )
        return jsonify({"error": False, "message": "Successful insert"})
    except Exception:
        return jsonify({"error": True, "message": "Error user register"})


@app.route("/updatePremium", methods=["PUT"])
@cross_origin(origin='*')
def upgrade_premium():
    try:
        users = mongo.db.users
        user_name = request.json["userName"]
        filter_ = {"userName": user_name}
        newvalues = {"$set": {"isPremium": True}}

        users.update_one(filter_, newvalues)
        return jsonify(
            {"error": False, "message": "Successful upgrade to premium"}
        )
    except Exception:
        return jsonify({"error": True, "message": "Error user upgrade"})


@app.route("/songs", methods=["PUT"])
@cross_origin(origin='*')
def update_song():
    try:
        songs = mongo.db.songs
        name = request.json["name"]
        file_ = request.json["file"]
        lyric_ = request.json["lyric"]
        artist = request.json["artist"]
        album = request.json["album"]
        id_ = request.json["id"]
        filter_ = {"_id": ObjectId(id_)}
        newvalues = {
            "$set": {
                "name": name,
                "artist": artist,
                "album": album,
            }
        }
        if file_ == "":
            song = songs.find_one({"name": name})
            newvalues["$set"].update({"file": song["file"]})
        else:
            newvalues["$set"].update({
                "file": file_,
                }
            )
        if lyric_ == "":
            lyric = songs.find_one({"name": name})
            newvalues["$set"].update({
                "lyric": lyric["lyric"],
                }
            )
        else:
            lyrics = base64.b64decode(lyric_).decode()
            newvalues["$set"].update({
                "lyric": lyric_,
                "lyricDetail": lyrics
                }
            )
        songs.update_one(filter_, newvalues)
        bucket = "soa_proyecto1"
        file_ = song["file"] if file_ == "" else file_
        lyric_ = lyric["lyric"] if lyric_ == "" else lyric_
        file_name = request.json["name"]
        lyric_name = request.json["name"] + "_Lyric"
        upload_song(bucket, file_, lyric_, file_name, lyric_name)

        return jsonify({"error": False, "message": "Successful update"})
    except Exception as exc:
        return jsonify({"error": True, "message": "Error updating song"})


@app.route("/songs", methods=["DELETE"])
@cross_origin(origin='*')
def delete_song():
    try:
        songs = mongo.db.songs
        id_ = request.json["id"]
        filter_ = {"_id": ObjectId(id_)}
        songs.delete_one(filter_)
        return jsonify({"error": False, "message": "Successful delete"})
    except Exception:
        return jsonify({"error": True, "message": "Error deleting song"})


@app.route("/songs/<name>", methods=["GET"])
@cross_origin(origin='*')
def get_one_song(name):
    songs = mongo.db.songs
    song = songs.find_one({"name": name})
    id_ = str(song["_id"])
    artist = str(song["artist"])
    album = str(song["album"])
    if not song:
        return jsonify({"result": "No such name"})
    bucket_name = "soa_proyecto1"
    song_name = name
    song_destination = "Songs/" + name + ".mp3"
    song = download_blob(bucket_name, song_name, song_destination)
    lyric_name = name + "_Lyric"
    lyric_destination = "Lyrics/" + name + "_Lyric.lrc"
    lyric = download_blob(bucket_name, lyric_name, lyric_destination)
    output = {
        "file": song,
        "lyric": lyric,
        "name": name,
        "id": id_,
        "artist": artist,
        "album": album,
    }
    return jsonify({"result": output})


@app.route("/setCORS", methods=["GET"])
@cross_origin(origin='*')
def cors_configuration():
    storage_client = storage.Client.from_service_account_json(
        "Key/calcium-branch-324922-75e2e2b8d30e.json"
    )
    bucket = storage_client.bucket("soa_proyecto1")
    bucket.cors = [
        {
            "origin": ["*"],
            "responseHeader": ["Content-Type", "x-goog-resumable"],
            "method": ["PUT", "POST", "GET", "DELETE"],
            "maxAgeSeconds": 3600000,
        }
    ]
    bucket.patch()
    return jsonify({"result": "CORS active"})


###################################################
# KeyCloakFeature
###################################################


@app.before_request
def load_user():
    g.username = session.get("username")
    g.access_token = session.get("access_token")
    g.refresh_token = session.get("refresh_token")


@app.route("/createAUser", methods=["POST"])
@cross_origin(origin='*')
def create_user():
    __config = get_config()
    user_name = request.json["username"]
    user_email = request.json["email"]
    user_pass = request.json["password"]
    user_type = request.json["type"]
    admin = kc_utils.get_admin()
    kc_utils.create_user(admin, user_name, user_email, user_pass)
    client_name = __config["CLIENT_ID"]
    user_id = admin.get_user_id(user_name)
    client_id = admin.get_client_id(client_name)
    role_rep = kc_utils.get_role_by_name(user_type)
    admin.assign_client_role(user_id, client_id, role_rep)
    return "Added Successfully"


@app.route("/updateRole", methods=["POST"])
@cross_origin(origin='*')
def update_a_user():
    __config = get_config()
    user_name = request.json["username"]
    user_type = request.json["type"]
    admin = kc_utils.get_admin()
    client_name = __config["CLIENT_ID"]
    user_id = admin.get_user_id(user_name)
    client_id = admin.get_client_id(client_name)
    role_rep = kc_utils.get_role_by_name(user_type)
    admin.assign_client_role(user_id, client_id, role_rep)
    role_rep = kc_utils.get_role_by_name("standardUser")
    admin.delete_client_roles_of_user(user_id, client_id, role_rep)
    return "Role updated"


@app.route("/getRoleByUser/<username>", methods=["GET"])
@cross_origin(origin='*')
def get_role_by_user(username):
    __config = get_config()
    admin = kc_utils.get_admin()
    client_name = __config["CLIENT_ID"]
    user_id = admin.get_user_id(username)
    client_id = admin.get_client_id(client_name)
    return json.dumps(admin.get_client_roles_of_user(user_id, client_id))


@app.route("/getRealmRoles", methods=["GET"])
@cross_origin(origin='*')
def get_realm_roles():
    admin = kc_utils.get_admin()
    return json.dumps(admin.get_realm_roles())


@app.route("/getAvailableRolesOf/<username>", methods=["GET"])
@cross_origin(origin='*')
def get_available_roles_of(username):
    admin = kc_utils.get_admin()
    user_id = admin.get_user_id(username)
    if not user_id:
        return "User Not Found"
    __config = get_config()
    client_name = __config["CLIENT_ID"]
    client_id = admin.get_client_id(client_name)
    return json.dumps(
        admin.get_available_client_roles_of_user(user_id, client_id)
    )


@app.route("/getRoleOf/<username>", methods=["GET"])
@cross_origin(origin='*')
def get_role_of(username):
    admin = kc_utils.get_admin()
    user_id = admin.get_user_id(username)
    if user_id is None:
        return "User Not Found"
    __config = get_config()
    client_name = __config["CLIENT_ID"]
    client_id = admin.get_client_id(client_name)
    return json.dumps(admin.get_client_roles_of_user(user_id, client_id))


@app.route("/getRoleID/<rolename>", methods=["GET"])
@cross_origin(origin='*')
def get_role_id(rolename):
    admin = kc_utils.get_admin()
    return kc_utils.get_role_id(admin, g.username, rolename)


@app.route("/getClients", methods=["GET"])
@cross_origin(origin='*')
def get_clients():
    admin = kc_utils.get_admin()
    return json.dumps(admin.get_clients())


@app.route("/getUserLoggedInfo", methods=["GET"])
@cross_origin(origin='*')
def get_user_logged_info():
    return {"username": g.username, "access-token": g.access_token}


@app.route("/getUserInfo", methods=["GET"])
@cross_origin(origin='*')
def get_user_info():
    access_token = g.access_token
    return kc_utils.get_userinfo(access_token)


@app.route("/login", methods=["POST"])
@cross_origin(origin='*')
def login():
    user_name = request.json["username"]
    user_pass = request.json["password"]

    oidc_obj = kc_utils.get_oidc()
    token = kc_utils.get_token(oidc_obj, user_name, user_pass)
    if token is None:
        return "Log In Error. Check your credentials"
    session["access_token"] = token["access_token"]
    session["username"] = user_name
    session["refresh_token"] = token["refresh_token"]
    return "Successfully Logged In"


@app.route("/logout", methods=["GET"])
@cross_origin(origin='*')
def logout():
    oidc_obj = kc_utils.get_oidc()
    refresh_token = g.refresh_token
    oidc_obj.logout(refresh_token)
    session.pop("username", None)
    session.pop("access_token", None)
    session.pop("refresh_token", None)
    return "Logged OUT"


@app.route("/getUsers", methods=["GET"])
@cross_origin(origin='*')
def get_users():
    admin = kc_utils.get_admin()
    return json.dumps(admin.get_users({}))


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8888)

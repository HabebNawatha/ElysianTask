from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import certifi
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
USERS_COLLECTION = os.getenv("USERS_COLLECTION")

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



client = MongoClient(MONGO_URI,tlsCAFile=certifi.where())
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.get_database(DB_NAME)

@app.route('/')
def home():
    return jsonify({"message" : "Welcome to the python Backend API!"})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status":"Health"},200)

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        db_list = client.list_database_names()
        print(db_list) 
        return jsonify({"message":"Connected to MongoDB!","database":db_list})
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message':'Email and password are required!'}),400
    
    users_collection = db[USERS_COLLECTION]

    user = users_collection.find_one({"email":email})

    if user:
        if user['password'] == password:
            return jsonify({'message':'User logged in successfuly'}),200
        else:
            return jsonify({'message':'User not found'}), 401
    else:
        return jsonify({'message':'User not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
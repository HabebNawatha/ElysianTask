from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin
from flask_mail import Mail, Message
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import google.auth.transport.requests
import google.oauth2.id_token
import certifi
import os
from datetime import datetime
import requests
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
DB_NAME = os.getenv("DB_NAME")
USERS_COLLECTION = os.getenv("USERS_COLLECTION")

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:8081"]}})
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
mail = Mail(app)


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
    
@app.route('/auth/facebook' , methods=['POST'])
def facebook_auth():
    try:
        access_token = request.json.get('token')
        if not access_token:
            return jsonify({"error": "Access token is required"}), 400
        
        graph_url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={access_token}"
        response = requests.get(graph_url)

        if response.status_code != 200:
            return jsonify({"error": "Invalid Facebook token"}), 400
        
        user_data = response.json()

        facebook_id = user_data.get("id")
        name = user_data.get("name")
        email = user_data.get("email")
        picture = user_data.get("picture", {}).get("data", {}).get("url")

        return jsonify({
            "facebook_id": facebook_id,
            "name": name,
            "email": email,
            "picture": picture,
        }), 200
    except Exception as e:
        print(f"Error during Facebook login: {e}")
        return jsonify({"error": "An error occurred during Facebook login"}), 500

@app.route('/auth/google' , methods=['POST'])
def google_auth():
    token = request.json.get('token')
    if not token:
        return jsonify({"message": "Token is missing!"}), 400

    try:
        google_response = requests.get(f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={token}')
        if google_response.status_code != 200:
            return jsonify({"message": "Invalid token"}), 400

        user_info = google_response.json()
        google_email = user_info.get("email")
        google_name = user_info.get("name")

        if not google_email or not google_name:
            return jsonify({"message": "Failed to retrieve user info"}), 400

        return jsonify({"message": "User authenticated", "user": user_info}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"message": str(e)}), 500

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
        if check_password_hash(user['password'], password):
            return jsonify({'message':'User logged in successfuly'}),200
        else:
            return jsonify({'message':'User not found'}), 401
    else:
        return jsonify({'message':'User not found'}), 404

@app.route('/register' , methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': ' Email and password are required!'}),400
    
    users_collection = db[USERS_COLLECTION]
    exisiting_user = users_collection.find_one({'email': email})

    if exisiting_user:
        return jsonify({'message':'User already exists with this email!'}),400
    
    hashed_password = generate_password_hash(password)

    new_user = {
        'email': email,
        'password': hashed_password,
        'created_at': datetime.now()
    }

    users_collection.insert_one(new_user)

    return jsonify({'message':'User registered successfuly!'}),201

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        recipient_email = data.get('email')
        if not recipient_email:
            return jsonify({'message': 'Email is required!'}), 400
        
        frontend_host = request.headers.get('Origin', 'http://localhost:3000')
        reset_link = f"{frontend_host}/forgot-password"
        print(reset_link)
        
        msg = Message(
            subject="Password Reset Request",
            recipients=[recipient_email],
            body=f"Click the link to reset your password: {reset_link}"
        )

        mail.send(msg)
        return jsonify({'message': 'Password reset email sent successfully.'}), 200
    except Exception as e:
        return {"message": str(e)}, 500
    
@app.route('/change-password' , methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        user_data = data.get('userData')
        email = user_data.get('email')
        new_password = user_data.get('password')

        if not email or not new_password:
            return jsonify({'message': 'Email, and new password are required!'}), 400
        
        users_collection = db[USERS_COLLECTION]
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({'message': 'User not found!'}), 404
        
        hashed_new_password = generate_password_hash(new_password)
        users_collection.update_one(
            {"email": email},
            {"$set": {"password": hashed_new_password}}
        )

        return jsonify({'message': 'Password changed successfully!'}), 200
    
    except Exception as e:
        print(f"Error during password change: {e}")
        return jsonify({'message': 'An error occurred while changing the password.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
from flask import session
# for real-time database
import pyrebase

config={
  'apiKey': "AIzaSyCErrNeI7GYkbJXxSHUoQZJ-0UFXzwtxuY",
  'authDomain': "smart-parking-system-181d0.firebaseapp.com",
  'databaseURL': "https://smart-parking-system-181d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  'projectId': "smart-parking-system-181d0",
  'storageBucket': "smart-parking-system-181d0.appspot.com",
  'messagingSenderId': "116238149294",
  'appId': "1:116238149294:web:760a046bf879e12328af3f",
  'measurementId': "G-EZL7WX322P"
}

firebase=pyrebase.initialize_app(config)
authenticator=firebase.auth()

# for firestore
import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("admin\smart-parking-system-181d0-firebase-adminsdk-iunkh-d62d0a1306.json")
firebase_admin.initialize_app(cred)
db=firestore.client()
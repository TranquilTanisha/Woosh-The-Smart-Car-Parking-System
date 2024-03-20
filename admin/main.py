from app import app
from flask import render_template, request, redirect, url_for
from authenticate import authenticate_user
from config import authenticator, db, session, auth

import pyqrcode
from fpdf import FPDF
# pip install pyqrcode fpdf

@app.route('/admin')
@authenticate_user
def home():
    return render_template('home.html')

@app.route('/qr-code')
@authenticate_user
def generate_qr_code():
    link=request.root_url+'parking-layout/'+session['localId']
    qr = pyqrcode.create(link)
    qr.png(session['org_name']+'.png', scale=10)
    return redirect(request.url_root+'admin-profile')

@app.route('/add-employees')
@authenticate_user
def add_employees():
    ref=db.collection('organization').document(user['localId'])
    ref.set({'id':user['localId'], 'location':session['location'],'email':email, 'org_name':session['org_name']})
    return render_template('add-employees.html')

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
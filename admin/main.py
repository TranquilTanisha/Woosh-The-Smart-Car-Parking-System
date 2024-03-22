from app import app
from flask import render_template, request, redirect, url_for, send_file
from authenticate import authenticate_user
from config import authenticator, db, session, auth

import pyqrcode
from fpdf import FPDF
# pip install pyqrcode fpdf
import openpyxl
#pip install openpyxl

import pandas
import os
from io import BytesIO

@app.route('/admin')
@authenticate_user
def home():
    return render_template('home.html')

#root_url/parking-layout/org-id
@app.route('/qr-code')
def generate_qr_code():
    link=request.root_url+'parking-layout/'+session['localId']
    file_name=session['org_name']+'.png'
    qr = pyqrcode.create(link)
    qr_png = BytesIO()
    qr.png(qr_png, scale=10)
    qr_png.seek(0)
    
    return send_file(
        qr_png,
        as_attachment=True,
        download_name=file_name,
    )

@app.route('/add-employees', methods=['GET','POST'])
@authenticate_user
def add_employees():
    if request.method == 'POST':
        col1=request.form['col1']
        col2=request.form['col2']
        if 'excel_file' not in request.files:
            return 'No file part'
        
        excel_file = request.files['excel_file']
        if excel_file.filename == '':
            return 'No selected file'
        excel_file.save(excel_file.filename)
        print(excel_file.filename)
        df=pandas.read_excel(excel_file.filename)
        d={}
        for i in range(len(df)):
            d[str(df.iloc[i][col1])]=str(df.iloc[i][col2])
            
        ref=db.collection('employees').document(session['localId'])
        ref.set(d)
        os.remove(excel_file.filename)
        return redirect(url_for('view_employees'))
    
    return render_template('add-employees.html')

@app.route('/view-employees')
@authenticate_user
def view_employees():
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        return render_template('view-employees.html', data=data)
    return 'No data available'

@app.route('/view-employee/<str:k>')
@authenticate_user
def view_employees():
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        print(data)
        return render_template('view-employees.html', data=data)
    return 'No data available'

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
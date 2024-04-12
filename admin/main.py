from app import app
from flask import render_template, request, redirect, url_for, send_file, flash
from authenticate import authenticate_user
from config import authenticator, db, session, auth
from google.cloud import firestore

import pyqrcode
import openpyxl
#pip install openpyxl

import pandas
import os
from io import BytesIO
from datetime import datetime
import pdfkit
from xhtml2pdf import pisa

months={
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

@app.route('/admin')
@authenticate_user
def home():
    return render_template('home.html')

#root_url/parking-layout/org-id
@app.route('/qr-code')
def generate_qr_code():
    link=request.root_url+'parking-layout?org_id='+session['localId']
    file_name=session['org_name']+'.png'
    qr = pyqrcode.create(link)
    qr_png = BytesIO()
    qr.png(qr_png, scale=10)
    qr_png.seek(0)
    
    flash("QR code downloaded successfully")
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
        flash("Employees added successfully")
        return redirect(url_for('view_employees'))
    
    return render_template('add-employees.html', org_name=session['org_name'])

@app.route('/add-employee', methods=['GET','POST'])
@authenticate_user
def add_employee():
    if request.method == 'POST':
        ref=db.collection('employees').document(session['localId'])
        doc=ref.get()
        data[request.form['name']]=request.form['email']
        if doc.exists:
            data=doc.to_dict()
            ref.set(data)
        else:
            ref.set(data)
        return redirect(url_for('view_employees'))
    return render_template('add-employees.html', msg='Add Employee', org_name=session['org_name'])

@app.route('/view-employees', methods=['GET','POST'])
@authenticate_user
def view_employees():
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        return render_template('view-employees.html', data=data, l=len(data))
    return 'No data available'

#k==emp id
@app.route('/view-employee/<k>', methods=['GET','POST'])
@authenticate_user
def view_employee(k):
    ref=db.collection('notification').document(session['localId'])
    doc=ref.get()   
    if doc.exists:
        data=doc.to_dict()
        print(data)
        user_id=data[k]
        print(user_id)
        ref=db.collection('users').document(user_id)
        doc=ref.get()
        if doc.exists:
            data=doc.to_dict()
            return render_template('view-employee.html', data=data, id=user_id, oeg_name=session['org_name'])
    return 'No data available'

#k==user id
@app.route('/view-user/<k>', methods=['GET','POST'])
@authenticate_user
def view_user(k):
    ref=db.collection('users').document(k)
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        print(data)
        return render_template('view-employee.html', data=data, id=k, org_name=session['org_name'])
    return 'No data available'

@app.route('/delete-employees', methods=['GET','POST'])
@authenticate_user
def delete_employees():
    ref=db.collection('employees').document(session['localId'])
    ref.delete()
    flash('All employees deleted successfully')
    return redirect(url_for('add_employees'))

@app.route('/view-logs', methods=['GET','POST'])
@authenticate_user
def view_logs():
    ref=db.collection('organization').document(session['localId'])
    dates=ref.collections()
    month={}
    data={}
    length={}
    emp={}

    for date in dates:
        key=date.id[:date.id.rfind('-')] #2024-04 yr and month
        if key not in month:
            month[key]=[date.id.split('-')[2]]
        else:
            month[key]+=[date.id.split('-')[2]] #get the date of the month
        
        #store data for each and every date in a weird format
        r=ref.collection(date.id)
        docs=r.stream()
        data[date.id]=[]
        length[date.id]=len(r.get())
        emp[date.id]=len(r.where("type", "==", 'employee').get())
        for doc in docs:
            if len(list(doc.to_dict().keys())) !=0:
                data[date.id].append(doc.to_dict())

    # for k,v in data.items():
    #     print(k)
    #     print(v)
    #     sorted_dict = dict(sorted(my_dict.items(), key=lambda item: item[1][0]))
    # print(data)
    # print(length)
    month = dict(sorted(month.items(), key=lambda item: item[0], reverse=True)) #sorting month and yr in descending order
    for k,v in month.items():
        month[k]=sorted(v, reverse=True)
    return render_template('view_logs.html', month=month, months=months, data=data, org_name=session['org_name'], total=length, emp=emp)

@app.route('/download-logs', methods=['GET','POST'])
@authenticate_user
def download_logs():
    file_name=session['org_name']+'-logs'
    ref=db.collection('organization').document(session['localId'])
    dates=ref.collections()
    data={}
    for date in dates:
        r=ref.collection(date.id)
        docs=r.stream()
        data[date.id]=[]
        for doc in docs:
            if len(list(doc.to_dict().keys())) !=0:
                data[date.id].append(doc.to_dict())
    print(data)
    df=pandas.DataFrame(data)
    df.to_excel('logs.xlsx')
    
    return send_file('logs.xlsx', as_attachment=True)

@app.route('/view-status', methods=['GET','POST'])
@authenticate_user
def view_status():
    date=datetime.now().strftime('%Y-%m-%d')
    ref=db.collection('organization').document(session['localId']).collection(date)
    if ref.get() is None:
        return 'No data available'
    docs=ref.where("exit","==","").stream()
    total=len(ref.where("exit","==","").get())
    emp=len(ref.where("type","==","employee").where("exit","==","").get())
    data=[]
    for doc in docs:
        data.append(doc.to_dict())
    print(total)
    print(emp)
    return render_template('view_status.html', data=data, total=total, emp=emp, org_name=session['org_name'])

@app.route('/alerts', methods=['GET','POST'])
@authenticate_user
def alerts():
    ref=db.collection('alerts').document(session['localId'])
    doc=ref.get()
    data=doc.to_dict()
    print(data)
    if len(data)!=0:
        data = sorted(data.items(), key=lambda x: x[1], reverse=True)
        data = {k: v for k, v in data}
        
        temp=[]
        for k,v in data.items():
            today=datetime.today().strftime('%Y-%m-%d')
            if today not in v:
                temp.append(k)
        for t in temp:
            del data[t]
        ref.set(data)   
        if len(data)>10:
            data=list(data.items())
            data=data[:10]
            data=dict(data)
            ref.set(data)
        print(data)
        return render_template('alerts.html', data=data, org_name=session['org_name'])
    return 'No alerts'

if __name__ == '__main__':
    app.run(debug=True)
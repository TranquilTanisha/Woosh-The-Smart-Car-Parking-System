from app import app
from flask import render_template, request, redirect, url_for, send_file, flash, jsonify
from authenticate import authenticate_user
from config import authenticator, db, session, auth
from google.cloud import firestore
from google.cloud.firestore_v1 import FieldFilter

import pyqrcode
import openpyxl
#pip install openpyxl

import pandas
import os
from io import BytesIO
from datetime import datetime
import pdfkit
from xhtml2pdf import pisa
import plotly.graph_objects as go

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

def fetch_logs(ref):
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

    month = dict(sorted(month.items(), key=lambda item: item[0], reverse=True)) #sorting month and yr in descending order
    for k,v in month.items():
        month[k]=sorted(v, reverse=True)
    print(month)
    print(data)
    print(length)
    print(emp)
    return month, data, length, emp

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

@app.route('/download-employees', methods=['GET','POST'])
@authenticate_user
def download_employees():
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        print(data)
        d={'Employee ID': list(data.keys()), 'Email': list(data.values())}
        df=pandas.DataFrame(d)
        csv_data = BytesIO()
        df.to_csv(csv_data, index=False)
        csv_data.seek(0)
        return send_file(
            csv_data,
            mimetype='text/csv',
            as_attachment=True,
            download_name='employees.csv'
        )
        
    return 'No data available'

@app.route('/view-employees', methods=['GET','POST'])
@authenticate_user
def view_employees():
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    if doc.exists:
        data=doc.to_dict()
        return render_template('view-employees.html', data=data, l=len(data), org_name=session['org_name'])
    return 'No data available'

#k==emp id
@app.route('/view-employee/<k>', methods=['GET','POST'])
@authenticate_user
def view_employee(k):
    ref=db.collection('users')
    data=ref.where('email', '==', k).get()
    if len(data)!=0:
        data=data[0].to_dict()
        print(data)
        return render_template('view-employee.html', data=data, id=data['email'], org_name=session['org_name'], orgID=session['localId'])
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
        return render_template('view-employee.html', data=data, id=k, org_name=session['org_name'], orgID=session['localId'])
    return 'No data available'

@app.route('/delete-employees', methods=['GET','POST'])
@authenticate_user
def delete_employees():
    ref=db.collection('employees').document(session['localId'])
    ref.delete()
    flash('All employees deleted successfully')
    return redirect(url_for('add_employees'))

@app.route('/delete-employee/<k>', methods=['GET','POST'])
@authenticate_user
def delete_employee(k):
    ref=db.collection('employees').document(session['localId'])
    doc=ref.get()
    data=doc.to_dict()
    del data[k]
    ref.set(data)
    ref=db.collection('users')
    data=ref.where('email', '==', k).get()
    if len(data)!=0:
        data=data.to_dict()
        print(data)
        del data['employeeID']
        print(data)
        ref.set(data)
    flash('Employee deleted successfully')
    return redirect(url_for('view_employees'))

@app.route('/view-logs', methods=['GET','POST'])
@authenticate_user
def view_logs():
    s=request.args.get('search')
    t=request.args.get('type')
    ref=db.collection('organization').document(session['localId'])
    month, data, length, emp=fetch_logs(ref)
    name=None
    if (s is None or len(s)==0) and t is None:
        return render_template('view_logs.html', month=month, months=months, data=data, org_name=session['org_name'], total=length, emp=emp, search=None, name=name, type=None)
    if s is not None and len(s)!=0:
        l={}
        if s in data: #search by date
            l[s]=data[s]
        elif s in month: # search by yyyy-mm
            if '-' in s:
                for d in month[s]:
                    l[s+'-'+d]=data[s+'-'+d]
        elif len(s)==4 and s.isdigit(): #search by year
            for m in month:
                if s in m:
                    for d in month[m]:
                        l[m+'-'+d]=data[m+'-'+d]
        else: #search by name
            c=0
            for k,values in data.items():
                l[k]=[]
                for v in values:
                    if s.lower() == v['name'].lower():
                        l[k].append(v)
                        c+=1
                
                if len(l[k])==0:
                    del l[k]
            if c==0:
                flash('No data available')
                return redirect(url_for('view_logs'))
            else:
                name=True
                
        data = {k: l[k] for k in sorted(l.keys(), reverse=True)}
        print(data)
        print()
    if t is not None:
        l={}
        if t=='employee':
            for k,v in month.items():
                for d in v:
                    l[k+'-'+d]=[]
                    if k+'-'+d in data:
                        for i in data[k+'-'+d]:
                            if i['type']=='employee':
                                l[k+'-'+d].append(i)

                    if len(l[k+'-'+d])==0:
                        del l[k+'-'+d]
                    
        elif t=='non-employee':
            for k,v in month.items():
                for d in v:
                    l[k+'-'+d]=[]
                    if k+'-'+d in data:
                        for i in data[k+'-'+d]:
                            if i['type']=='non-employee':
                                l[k+'-'+d].append(i)

                    if len(l[k+'-'+d])==0:
                        del l[k+'-'+d]
        data=l
        month={}
        for d in data:
            a=d[:d.rfind('-')]
            if d[:d.rfind('-')] not in month:
                month[d[:d.rfind('-')]]=[d[d.rfind('-')+1:]]
            else:
                month[d[:d.rfind('-')]].append(d[d.rfind('-')+1:])
    temp={}
    total={}
    for k,v in data.items():
        total[k]=len(v)
        obj = datetime.strptime(k, "%Y-%m-%d")
        y = str(obj.strftime("%Y-%m"))
        d=str(obj.strftime("%d"))
        if y not in temp:
            temp[y]=[d]
        else:
            temp[y].append(d)
    month=temp
    length=total
    print(month)
    print(total)
    return render_template('view_logs.html', month=month, months=months, data=data, org_name=session['org_name'], total=length, emp=emp, search=s, type=t, name=name)
    
@app.route('/download-search/<data>', methods=['GET','POST'])
@authenticate_user
def download_search(data):
    # s=request.args.get('search')
    # t=request.args.get('type')
    # print
    return data

@app.route('/download-logs', methods=['GET','POST'])
@authenticate_user
def download_logs():
    ref=db.collection('organization').document(session['localId'])
    month, data, length, emp=fetch_logs(ref)
    filename=session['org_name']+'-logs'
    r=db.collection('users')
    info={'Date':[], 'Name':[], 'Type':[], 'Employee ID':[], 'Email ID': [], 'Entry Time':[], 'Exit Time':[]} #store data in a dictionary
    for m in month:
        for d in month[m]:
            curr=m+'-'+d
            print(curr)
            for i in data[curr]:
                print(i)
                q=r.document(i['id']).get().to_dict()
                print(q)
                info['Date'].append(curr)
                info['Name'].append(q['name'])
                info['Type'].append(i['type'])
                if i['type']!='employee': info['Employee ID'].append(' ')
                else: info['Employee ID'].append(q['employeeID'])
                info['Email ID'].append(q['email'])
                info['Entry Time'].append(i['entry'])
                info['Exit Time'].append(i['exit'])
        
    e=sum(emp.values())
    v=sum(length.values())
    info['Date'].extend(['Total employees', 'Total visitors', 'Total entries'])
    info['Name'].extend([e, v-e, v])
    info['Type'].extend([' ', ' ', ' '])
    info['Employee ID'].extend([' ', ' ', ' '])
    info['Email ID'].extend([' ', ' ', ' '])
    info['Entry Time'].extend([' ', ' ', ' '])
    info['Exit Time'].extend([' ', ' ', ' '])
        
    df=pandas.DataFrame(info)
    csv_data = BytesIO()
    df.to_csv(csv_data, index=False)
    csv_data.seek(0)
    return send_file(
        csv_data,
        mimetype='text/csv',
        as_attachment=True,
        download_name=filename+'.csv'
    )

@app.route('/view-status', methods=['GET','POST'])
@authenticate_user
def view_status():
    date=datetime.now().strftime('%Y-%m-%d')
    ref=db.collection('organization').document(session['localId']).collection(date)
    if ref.get() is None:
        return 'No data available'
    
    docs=ref.where(filter=FieldFilter("exit","==","")).stream()
    total=len(ref.where(filter=FieldFilter("exit","==","")).get())
    emp=len(ref.where("type","==","employee").where("exit","==","").get())
    data=[]
    for doc in docs:
        print(doc.to_dict())
        data.append(doc.to_dict())
    print(total)
    print(emp)
    print(data)
    return render_template('view_status.html', data=data, total=total, emp=emp, org_name=session['org_name'])

@app.route('/alerts', methods=['GET','POST'])
@authenticate_user
def alerts():
    date=datetime.now().strftime('%Y-%m-%d')
    ref=db.collection('organization').document(session['localId']).collection(date)
    if ref.get() is None:
        return 'No data available'
    docs=ref.where("type","==","non-employee").where("exit","==","").get()
    data={}
    for doc in docs:
        d=doc.to_dict()
        data[d['id']]=d['entry']
    
    print(data)    
    if len(data)!=0:
        ref=db.collection('users')
        users={}
        for k in data.keys():
            doc=ref.document(k).get()
            if doc.exists:
                doc=doc.to_dict()
                users[k]=doc['name']
        print(users)
        data = sorted(data.items(), key=lambda x: x[1], reverse=True)
        data = {k: v for k, v in data}
        print(data)    
        if len(data)>10:
            temp={}
            data={key: data[key] for key in list(data)[:10]}
            print(data)
        return render_template('alerts.html', data=data, users=users, org_name=session['org_name'])
    return render_template('alerts.html', msg='You have no alerts')

@app.route('/analyze/<k>', methods=['GET','POST'])
@authenticate_user
def analyze(k):
    ref=db.collection('organization').document(session['localId'])
    month, data, length, emp=fetch_logs(ref)
    values=[emp[k], length[k]-emp[k]]
    labels=['Employees', 'Non-employees']
    # return jsonify({'values': values, 'labels': labels})
    # datat={'Employees': emp[k], 'Non-Employees': length[k]-emp[k]}
    return render_template('piechart.html', values= values, labels= labels, k=k, org_name=session['org_name'])

if __name__ == '__main__':
    app.run(debug=True)
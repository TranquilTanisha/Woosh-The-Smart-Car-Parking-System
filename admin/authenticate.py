from flask import render_template, request, redirect, url_for, jsonify
from functools import wraps
from config import authenticator, db, session, auth
from app import app

def authenticate_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # try:
        #     a=auth.get_account_info(session['idToken'])
        #     return f(*args, **kwargs)
        # except:
        #     if 'user' in session:
        #         print('Deleting user')
        #         ref=db.collection('users').document(session['localId']).delete()
        #         session.clear()
        
        if 'user' in session:
            return f(*args, **kwargs)

        n=request.url
        n=n.split('/')
        return render_template('home.html', next=n[-1])
    return decorated_function

@app.route('/admin-login', methods=['GET','POST'])
def login():
    n=request.args.get('next')

    if 'user' in session:
        if type(n)==str:
            return redirect(request.url_root+n)
        return redirect(url_for('profile'))
    
    if request.method=='POST':
        email=request.form['email']
        password=request.form['password']
        try:
            user=authenticator.sign_in_with_email_and_password(email,password)
            a=authenticator.get_account_info(user['idToken'])
            if a['users'][0]['emailVerified']==False:
                if type(n)==str:
                    return "Email not verified. Please verify your email to <a href='/admin-login?next="+n+"'>login</a>."
                else:
                    return "Email not verified. Please verify your email to <a href='/admin-login'>login</a>."
            else:
                ref=db.collection('organization').document(user['localId'])
                doc=ref.get()
                if (doc.exists):
                    pass
                else:
                    ref.set({'id':user['localId'], 'location':session['location'],'email':email, 'org_name':session['org_name'], 
                                'fee': session['fee'], 'basis': session['basis'], 'charges': session['charges'], 
                                'floors': session['floors']})
                        
                # ref=db.collection('employees').document(user['localId'])
                # ref.set({'None':'None'})
                # ref=db.collection('parking_layout').document(user['localId'])
                # ref.set({'None':'None'})
                session['user']=email
                session['localId']=user['localId']
                session['idToken']=user['idToken']
                session['email']=email
                if type(n)==str:
                    return redirect(request.url_root+n)
                else:
                    return redirect(request.url_root+'admin-profile')
        except:
            return "Couldn't login please check your credentials or signup"
    return render_template('admin-login.html', next=n)

@app.route('/admin-register', methods=['GET','POST'])
def signup():
    n=request.args.get('next')
    if request.method=='POST':
        org_name=request.form['org_name']
        location=request.form['location']
        fee=request.form['fee']
        basis=request.form['basis']
        charges=float(request.form['charges'])
        floors=request.form['floors']
        email=request.form['email']
        password=request.form['password']
        try:
            user=authenticator.create_user_with_email_and_password(email,password)
            authenticator.send_email_verification(user['idToken'])
            session['org_name']=org_name
            session['location']=location
            session['fee']=fee
            session['basis']=basis
            session['charges']=charges
            session['floors']=floors
            if type(n)==str:
                return "Email not verified. Please verify your email to <a href='/admin-login?next="+n+"'>login</a>."
            else:
                # return redirect(url_for('profile'))
                return "Email not verified. Please verify your email to <a href='/admin-login'>login</a>."
        except:
            return 'The email already exists'
    return render_template('admin-register.html', next=n)

@app.route('/forgot', methods=['GET','POST'])
def forgot_password():
    email=request.args.get('email')
    if 'user' not in session:
        authenticator.send_password_reset_email(email)
        return 'Password reset email sent'
    else:
        return 'You are already logged in'
    
@app.route('/admin-logout')
@authenticate_user
def logout():
    session.pop('user')
    session.pop('localId')
    session.pop('idToken')
    return redirect('/admin')

@app.route('/admin-profile')
@authenticate_user
def profile():
    ref=db.collection('organization').document(session['localId'])
    data=ref.get().to_dict()
    return render_template('admin-profile.html', id=session['localId'], org_name=data['org_name'], email=data['email'], location=data['location'], 
                           fee= data['fee'], basis= data['basis'], 
                    charges= data['charges'], floors= data['floors'])

@app.route('/admin-update', methods=['GET','POST'])
@authenticate_user
def update():
    if request.method=='POST':
        org_name=request.form['org_name']
        location=request.form['location']
        fee=request.form['fee']
        basis=request.form['basis']
        charges=float(request.form['charges'])
        floors=request.form['floors']
        
        session['org_name']=org_name
        session['location']=location
        session['fee']=fee
        session['basis']=basis
        session['charges']=charges
        session['floors']=floors
        
        ref=db.collection('organization').document(session['localId'])
        ref.set({'id':session['localId'], 'location':session['location'],'email':session['email'], 'org_name':session['org_name'], 
                                'fee': session['fee'], 'basis': session['basis'], 'charges': session['charges'], 
                                'floors': session['floors']})
        # ref.update({'id':session['localId'], 'org_name':org_name, 'location':location, 'fee': fee, 'basis': basis, 
        #             'charges': charges, 'No. of floors': floors})
        return redirect(url_for('profile'))
    return render_template('admin-update.html', id=session['localId'], org_name=session['org_name'], location=session['location'], 
                           fee=session['fee'], basis= session['basis'], charges= session['charges'], floors= session['floors'])

@app.route('/admin-delete')
@authenticate_user
def delete():
    a=authenticator.get_account_info(session['idToken'])
    try:
        ref=db.collection('organization').document(session['localId']).delete()
        ref=db.collection('employees').document(session['localId']).delete()
        ref=db.collection('parking_layout').document(session['localId']).delete()
        ref=db.collection('visitors').document(session['localId']).delete()
        session.clear()
        auth.delete_user(session['localId'])
    except:
        return redirect(url_for('profile'))
    return redirect('/admin-login')
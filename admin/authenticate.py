from flask import render_template, request, redirect, url_for, jsonify, flash
from functools import wraps
from config import authenticator, db, session, auth
from app import app
from datetime import datetime

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
                    flash("Please verify your email to login.")
                    return redirect(request.url_root+'admin-login?next='+n)
                    # return "Email not verified. Please verify your email to <a href='/admin-login?next="+n+"'>login</a>."
                else:
                    flash("Please verify your email to login.")
                    return redirect(request.url_root+'admin-login?')
                    # return "Email not verified. Please verify your email to <a href='/admin-login'>login</a>."
            else:
                ref=db.collection('organization').document(user['localId'])
                doc=ref.get()
                if (doc.exists):
                    session['org_name']=doc.to_dict()['org_name']
                    session['location']=doc.to_dict()['location']
                    session['fee']=doc.to_dict()['fee']
                    session['basis']=doc.to_dict()['basis']
                    session['charges']=doc.to_dict()['charges']
                    session['floors']=doc.to_dict()['floors']
                    
                    pass
                else:
                    ref.set({'id':user['localId'], 'location':session['location'],'email':email, 'org_name':session['org_name'], 
                                'fee': session['fee'], 'basis': session['basis'], 'charges': session['charges'], 
                                'floors': session['floors']})
                    # ref.collection(str(datetime.now())).set({'date': '0'})
                        
                session['user']=email
                session['localId']=user['localId']
                session['idToken']=user['idToken']
                session['email']=email
                print(user['localId'])
                if type(n)==str:
                    return redirect(request.url_root+n)
                else:
                    return redirect(request.url_root+'admin-profile')
        except:
            flash("Couldn't login please check your credentials or signup. Check you Email for verification link.")
            # return "Couldn't login please check your credentials or signup"
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
            session['floors']=int(floors)
            if type(n)==str:
                flash("Please verify your email to login.")
                return redirect(request.url_root+'admin-login?next='+n)
                # return "Email not verified. Please verify your email to <a href='/admin-login?next="+n+"'>login</a>."
            else:
                # return redirect(url_for('profile'))
                flash("Please verify your email to login.")
                return redirect(request.url_root+'admin-login')
                # return "Email not verified. Please verify your email to <a href='/admin-login'>login</a>."
        except:
            # return 'The email already exists'
            flash("The email already exists.")
            # return redirect(request.url_root+'admin-login?next='+n)
    return render_template('admin-register.html', next=n)

@app.route('/forgot', methods=['GET','POST'])
def forgot_password():
    email=request.args.get('email')
    if email==None:
        flash("Please enter your email")
    elif 'user' not in session:
        auth.generate_password_reset_link(email)
        flash("Password reset email sent")
    else:
        flash("You are already logged in")
    return render_template('forgot_password.html')
    
@app.route('/admin-logout')
@authenticate_user
def logout():
    session.pop('user')
    session.pop('localId')
    session.pop('idToken')
    flash("You have been logged out")
    return redirect('/admin')

@app.route('/admin-profile')
@authenticate_user
def profile():
    ref=db.collection('organization').document(session['localId'])
    data=ref.get().to_dict()
    return render_template('admin-profile.html', session=session, org_name=session['org_name'])

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
        # ref.set({'id':session['localId'], 'location':session['location'],'email':session['email'], 'org_name':session['org_name'], 
        #                         'fee': session['fee'], 'basis': session['basis'], 'charges': session['charges'], 
        #                         'floors': session['floors']})
        ref.update({'org_name': org_name, 'location': location, 'fee': fee, 'basis': basis, 'charges': charges, 'floors': floors})
        flash("Details updated successfully")
        return redirect(url_for('profile'))
    # return render_template('admin-update.html', id=session['localId'], org_name=session['org_name'], location=session['location'], 
    #                        fee=session['fee'], basis= session['basis'], charges= session['charges'], floors= session['floors'], org_name=session['org_name'])
    return render_template('admin-update.html', session=session, org_name=session['org_name'])

@app.route('/admin-delete')
@authenticate_user
def delete():
    try:
        auth.delete_user(session['localId'])
        ref=db.collection('organization').document(session['localId']).delete()
        session.clear()
        flash("Account deleted successfully")
    except:
        return redirect(url_for('profile'))
    return redirect('/admin-login')

@app.route('/change-email', methods=['GET','POST'])
@authenticate_user
def change_email():
    if request.method=='POST':
        email=request.form['email']
        try:
            auth.update_user(session['localId'], email=email)
            session['email']=email
            flash("Email updated successfully")
        except:
            flash('Email already exists. Please try with another email.')
    return render_template('change_email.html', org_name=session['org_name'])

@app.route('/change-password', methods=['GET','POST'])
@authenticate_user
def change_password():
    authenticator.send_password_reset_email(session['email'])
    flash("Password reset link sent to your email")
    return redirect(url_for('profile'))
from flask import Flask
from flask_cors import CORS

def create_app() -> Flask:
    app = Flask(__name__)
    cors = CORS(app, origins=['http://localhost:3000'])
    app.config['CORS_HEADERS'] = 'Content-Type'
    # app.register_blueprint(home_blueprint)
    # app.register_blueprint(auth_blueprint)
    return app


app = create_app()

# from flask import Flask

# app=Flask(__name__)
app.secret_key='secret'

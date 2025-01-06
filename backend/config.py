from flask import Flask
from flask_sqlalchemy import SQLAlchemy  # use SQL in Python
from flask_cors import CORS  # cross-origin request


app = Flask(__name__)  # initialize Flask app
CORS(app)  # disable the error

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # don't track db modifications

db = SQLAlchemy(app)  # create a db instance

from app import db
from datetime import datetime

class Inbox(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=False, nullable=False)
    message = db.Column(db.String(10000), nullable=False)
    dateTime = db.Column(db.DateTime, default=datetime.utcnow)
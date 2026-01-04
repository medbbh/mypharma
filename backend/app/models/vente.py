from datetime import datetime
from app.extensions import db

class Vente(db.Model):
    __tablename__ = "ventes"

    id = db.Column(db.Integer, primary_key=True)
    date_vente = db.Column(db.DateTime, default=datetime.utcnow)
    total = db.Column(db.Float, default=0)
    benefice = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

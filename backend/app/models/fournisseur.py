from datetime import datetime
from app.extensions import db

class Fournisseur(db.Model):
    __tablename__ = "fournisseurs"

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(120), nullable=False, unique=True)
    telephone = db.Column(db.String(50))
    adresse = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

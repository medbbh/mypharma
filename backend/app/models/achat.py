from datetime import datetime
from app.extensions import db

class Achat(db.Model):
    __tablename__ = "achats"

    id = db.Column(db.Integer, primary_key=True)
    fournisseur_id = db.Column(db.Integer, db.ForeignKey("fournisseurs.id"), nullable=False)
    date_achat = db.Column(db.Date, nullable=False)
    numero_facture = db.Column(db.String(100))
    total = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

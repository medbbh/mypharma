from app.extensions import db

class AchatItem(db.Model):
    __tablename__ = "achat_items"

    id = db.Column(db.Integer, primary_key=True)
    achat_id = db.Column(db.Integer, db.ForeignKey("achats.id"), nullable=False)
    medicament_id = db.Column(db.Integer, db.ForeignKey("medicaments.id"), nullable=False)
    lot = db.Column(db.String(100), nullable=False)
    date_expiration = db.Column(db.Date, nullable=False)
    quantite = db.Column(db.Integer, nullable=False)
    prix_unitaire = db.Column(db.Float, nullable=False)

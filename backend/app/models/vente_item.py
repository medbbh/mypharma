from app.extensions import db

class VenteItem(db.Model):
    __tablename__ = "vente_items"

    id = db.Column(db.Integer, primary_key=True)
    vente_id = db.Column(db.Integer, db.ForeignKey("ventes.id"), nullable=False)
    medicament_id = db.Column(db.Integer, db.ForeignKey("medicaments.id"), nullable=False)

    quantite = db.Column(db.Integer, nullable=False)
    prix_achat_moyen = db.Column(db.Float, nullable=False)
    marge_pourcentage = db.Column(db.Float, nullable=False)
    prix_vente_unitaire = db.Column(db.Float, nullable=False)
    total_ligne = db.Column(db.Float, nullable=False)

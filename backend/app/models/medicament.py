from datetime import datetime
from app.extensions import db

class Medicament(db.Model):
    __tablename__ = "medicaments"

    id = db.Column(db.Integer, primary_key=True)
    nom_commercial = db.Column(db.String(120), nullable=False)
    nom_scientifique = db.Column(db.String(120), nullable=False)
    molecule = db.Column(db.String(120), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    forme = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        db.UniqueConstraint(
            "nom_scientifique", "dosage", "forme",
            name="uq_medicament_identity"
        ),
    )

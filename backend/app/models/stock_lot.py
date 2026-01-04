from datetime import datetime
from app.extensions import db

class StockLot(db.Model):
    __tablename__ = "stock_lots"

    id = db.Column(db.Integer, primary_key=True)
    medicament_id = db.Column(db.Integer, db.ForeignKey("medicaments.id"), nullable=False)
    lot = db.Column(db.String(100), nullable=False)
    quantite_restante = db.Column(db.Integer, nullable=False)
    date_expiration = db.Column(db.Date, nullable=False)
    prix_achat = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("medicament_id", "lot", name="uq_medicament_lot"),
    )

from flask import Blueprint, jsonify
from datetime import date, timedelta
from app.models.stock_lot import StockLot
from sqlalchemy import func
from app.models.medicament import Medicament
from app.extensions import db

alerts_bp = Blueprint("alerts", __name__, url_prefix="/alerts")

EXPIRATION_ALERT_DAYS = 90


@alerts_bp.route("/expiration", methods=["GET"])
def expiration_alerts():
    today = date.today()
    limit = today + timedelta(days=EXPIRATION_ALERT_DAYS)

    lots = (
        db.session.query(
            StockLot,
            Medicament.nom_commercial
        )
        .join(Medicament, Medicament.id == StockLot.medicament_id)
        .filter(
            StockLot.quantite_restante > 0,
            StockLot.date_expiration <= limit
        )
        .all()
    )

    return jsonify([
        {
            "medicament_id": l.medicament_id,
            "medicament": nom_commercial,
            "lot": l.lot,
            "quantite": l.quantite_restante,
            "date_expiration": l.date_expiration.isoformat(),
            "status": "expired" if l.date_expiration < today else "expiring_soon"
        }
        for l, nom_commercial in lots
    ])


STOCK_ALERT_THRESHOLD = 50

@alerts_bp.route("/low-stock", methods=["GET"])
def low_stock_alerts():
    today = date.today()

    rows = (
        db.session.query(
            Medicament.id,
            Medicament.nom_commercial,
            func.sum(StockLot.quantite_restante).label("total_stock")
        )
        .join(
            StockLot,
            (StockLot.medicament_id == Medicament.id) &
            (StockLot.date_expiration > today)
        )
        .group_by(Medicament.id)
        .having(func.sum(StockLot.quantite_restante) < STOCK_ALERT_THRESHOLD)
        .all()
    )

    return jsonify([
        {
            "medicament_id": r.id,
            "nom_commercial": r.nom_commercial,
            "total_stock": r.total_stock
        }
        for r in rows
    ])


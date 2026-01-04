from flask import Blueprint, jsonify
from datetime import date
from sqlalchemy import func
from app.extensions import db
from app.models.stock_lot import StockLot
from app.models.medicament import Medicament

stock_bp = Blueprint("stock", __name__, url_prefix="/stock")


@stock_bp.route("", methods=["GET"])
def stock_overview():
    today = date.today()

    rows = (
        db.session.query(
            Medicament.id,
            Medicament.nom_commercial,
            func.sum(StockLot.quantite_restante).label("total_stock")
        )
        .join(StockLot, StockLot.medicament_id == Medicament.id)
        .filter(StockLot.date_expiration > today)
        .group_by(Medicament.id)
        .all()
    )

    return jsonify([
        {
            "medicament_id": r.id,
            "nom_commercial": r.nom_commercial,
            "total_stock": r.total_stock or 0,
        }
        for r in rows
    ])

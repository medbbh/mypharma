from flask import Blueprint, jsonify, request
from datetime import date
from sqlalchemy import func, extract
from app.extensions import db
from app.models.vente import Vente
from app.models.vente_item import VenteItem
from app.models.medicament import Medicament
from datetime import timedelta


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@dashboard_bp.route("/today", methods=["GET"])
def today_stats():
    today = date.today()

    revenue = (
        db.session.query(func.coalesce(func.sum(Vente.total), 0))
        .filter(func.date(Vente.date_vente) == today)
        .scalar()
    )

    return jsonify({
        "date": today.isoformat(),
        "revenue": revenue
    })


@dashboard_bp.route("/top-products", methods=["GET"])
def top_products():
    range_param = request.args.get("range", "today")
    today = date.today()

    if range_param == "today":
        start_date = today
    else:
        days = int(range_param)
        start_date = today - timedelta(days=days)

    rows = (
        db.session.query(
            Medicament.nom_commercial,
            func.sum(VenteItem.quantite).label("total_sold")
        )
        .join(VenteItem, VenteItem.medicament_id == Medicament.id)
        .join(Vente, Vente.id == VenteItem.vente_id)
        .filter(func.date(Vente.date_vente) >= start_date)
        .group_by(Medicament.nom_commercial)
        .order_by(func.sum(VenteItem.quantite).desc())
        .limit(5)
        .all()
    )

    return jsonify([
        {
            "medicament": r.nom_commercial,
            "total_sold": r.total_sold
        }
        for r in rows
    ])


@dashboard_bp.route("/sales-by-hour", methods=["GET"])
def sales_by_hour():
    rows = (
        db.session.query(
            extract("hour", Vente.date_vente).label("hour"),
            func.count(Vente.id).label("count")
        )
        .group_by("hour")
        .order_by("hour")
        .all()
    )

    return jsonify([
        {
            "hour": int(r.hour),
            "sales": r.count
        }
        for r in rows
    ])


@dashboard_bp.route("/sales-by-day", methods=["GET"])
def sales_by_day():
    start = request.args.get("start")
    end = request.args.get("end")

    query = db.session.query(
        func.date(Vente.date_vente).label("day"),
        func.sum(Vente.total).label("revenue")
    )

    if start:
        query = query.filter(func.date(Vente.date_vente) >= start)
    if end:
        query = query.filter(func.date(Vente.date_vente) <= end)

    rows = (
        query
        .group_by("day")
        .order_by("day")
        .all()
    )

    return jsonify([
        {
            "day": str(r.day),
            "revenue": r.revenue
        }
        for r in rows
    ])

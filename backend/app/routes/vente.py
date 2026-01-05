from flask import Blueprint, request, jsonify
from datetime import date
from sqlalchemy import func
from app.extensions import db
from app.models.vente import Vente
from app.models.vente_item import VenteItem
from app.models.stock_lot import StockLot
from app.services.pricing import get_margin

vente_bp = Blueprint("ventes", __name__, url_prefix="/ventes")


@vente_bp.route("", methods=["POST"])
def create_vente():
    data = request.json
    items = data.get("items", [])

    if not items:
        return jsonify({"error": "Aucun article"}), 400

    today = date.today()
    vente = Vente()
    db.session.add(vente)
    db.session.flush()

    total_vente = 0
    total_benefice = 0

    for item in items:
        medicament_id = item["medicament_id"]
        quantite = item["quantite"]

        # --- SAME LOGIC AS BEFORE (reused) ---
        lots = StockLot.query.filter(
            StockLot.medicament_id == medicament_id,
            StockLot.date_expiration > today,
            StockLot.quantite_restante > 0
        ).all()

        total_stock = sum(l.quantite_restante for l in lots)
        if quantite > total_stock:
            return jsonify({"error": "Stock insuffisant"}), 400

        total_value = sum(l.quantite_restante * l.prix_achat for l in lots)
        prix_achat_moyen = total_value / total_stock

        marge = get_margin(prix_achat_moyen)
        prix_unitaire = round(prix_achat_moyen * (1 + marge), 2)
        total_ligne = prix_unitaire * quantite
        benefice = (prix_unitaire - prix_achat_moyen) * quantite

        # Deduct stock
        reste = quantite
        for lot in lots:
            if reste == 0:
                break
            d = min(lot.quantite_restante, reste)
            lot.quantite_restante -= d
            reste -= d

        vente_item = VenteItem(
            vente_id=vente.id,
            medicament_id=medicament_id,
            quantite=quantite,
            prix_achat_moyen=prix_achat_moyen,
            marge_pourcentage=marge,
            prix_vente_unitaire=prix_unitaire,
            total_ligne=total_ligne
        )
        db.session.add(vente_item)

        total_vente += total_ligne
        total_benefice += benefice

    vente.total = total_vente
    vente.benefice = total_benefice

    db.session.commit()

    return jsonify({
        "vente_id": vente.id,
        "total": total_vente,
        "benefice": total_benefice
    }), 201


@vente_bp.route("/preview", methods=["GET"])
def preview_vente():
    medicament_id = request.args.get("medicament_id", type=int)
    quantite = request.args.get("quantite", type=int)

    if not medicament_id or not quantite or quantite <= 0:
        return jsonify({"error": "Invalid parameters"}), 400

    today = date.today()

    lots = StockLot.query.filter(
        StockLot.medicament_id == medicament_id,
        StockLot.date_expiration > today,
        StockLot.quantite_restante > 0
    ).all()

    total_stock = sum(l.quantite_restante for l in lots)

    if quantite > total_stock:
        return jsonify({"error": "Stock insuffisant"}), 400

    total_value = sum(l.quantite_restante * l.prix_achat for l in lots)
    prix_achat_moyen = total_value / total_stock

    marge = get_margin(prix_achat_moyen)
    prix_unitaire = round(prix_achat_moyen * (1 + marge), 2)
    total = round(prix_unitaire * quantite, 2)

    return jsonify({
        "prix_unitaire": prix_unitaire,
        "total": total,
        "stock_disponible": total_stock
    })

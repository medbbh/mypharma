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
    medicament_id = data["medicament_id"]
    quantite_vendue = data["quantite"]

    today = date.today()

    # 1️⃣ Get valid stock
    lots = StockLot.query.filter(
        StockLot.medicament_id == medicament_id,
        StockLot.date_expiration > today,
        StockLot.quantite_restante > 0
    ).all()

    total_stock = sum(l.quantite_restante for l in lots)

    if quantite_vendue > total_stock:
        return jsonify({"error": "Stock insuffisant"}), 400

    # 2️⃣ Average purchase price
    total_value = sum(l.quantite_restante * l.prix_achat for l in lots)
    prix_achat_moyen = total_value / total_stock

    # 3️⃣ Margin
    marge = get_margin(prix_achat_moyen)
    prix_vente_unitaire = round(
        prix_achat_moyen + (prix_achat_moyen * marge), 2
    )

    total_ligne = prix_vente_unitaire * quantite_vendue
    benefice = (prix_vente_unitaire - prix_achat_moyen) * quantite_vendue

    # 4️⃣ Deduct stock (GLOBAL, no FIFO)
    reste = quantite_vendue
    for lot in lots:
        if reste == 0:
            break
        deduction = min(lot.quantite_restante, reste)
        lot.quantite_restante -= deduction
        reste -= deduction

    # 5️⃣ Persist vente
    vente = Vente(
        total=total_ligne,
        benefice=benefice
    )
    db.session.add(vente)
    db.session.flush()

    vente_item = VenteItem(
        vente_id=vente.id,
        medicament_id=medicament_id,
        quantite=quantite_vendue,
        prix_achat_moyen=prix_achat_moyen,
        marge_pourcentage=marge,
        prix_vente_unitaire=prix_vente_unitaire,
        total_ligne=total_ligne
    )
    db.session.add(vente_item)

    db.session.commit()

    return jsonify({
        "vente_id": vente.id,
        "prix_unitaire": prix_vente_unitaire,
        "total": total_ligne,
        "benefice": benefice
    }), 201

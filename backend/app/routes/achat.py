from flask import Blueprint, request, jsonify
from datetime import datetime
from app.extensions import db
from app.models.achat import Achat
from app.models.achat_item import AchatItem
from app.models.stock_lot import StockLot

achat_bp = Blueprint("achats", __name__, url_prefix="/achats")


@achat_bp.route("", methods=["POST"])
def create_achat():
    data = request.json

    achat = Achat(
        fournisseur_id=data["fournisseur_id"],
        date_achat=datetime.strptime(
            data["date_achat"], "%Y-%m-%d"
        ).date(),
        numero_facture=data.get("numero_facture"),
    )
    db.session.add(achat)
    db.session.flush()

    total = 0

    for item in data["items"]:
        expiration_date = datetime.strptime(
            item["date_expiration"], "%Y-%m-%d"
        ).date()

        ai = AchatItem(
            achat_id=achat.id,
            medicament_id=item["medicament_id"],
            lot=item["lot"],
            date_expiration=expiration_date,
            quantite=item["quantite"],
            prix_unitaire=item["prix_unitaire"],
        )
        db.session.add(ai)

        stock = StockLot(
            medicament_id=item["medicament_id"],
            lot=item["lot"],
            quantite_restante=item["quantite"],
            date_expiration=expiration_date,
            prix_achat=item["prix_unitaire"],
        )
        db.session.add(stock)

        total += item["quantite"] * item["prix_unitaire"]

    achat.total = total
    db.session.commit()

    return jsonify({"achat_id": achat.id, "total": total}), 201

@achat_bp.route("", methods=["GET"])
def list_achats():
    achats = Achat.query.all()
    result = []
    for achat in achats:
        items = AchatItem.query.filter_by(achat_id=achat.id).all()
        item_list = [
            {
                "medicament_id": item.medicament_id,
                "lot": item.lot,
                "date_expiration": item.date_expiration.strftime("%Y-%m-%d"),
                "quantite": item.quantite,
                "prix_unitaire": item.prix_unitaire,
            }
            for item in items
        ]
        result.append(
            {
                "id": achat.id,
                "fournisseur_id": achat.fournisseur_id,
                "date_achat": achat.date_achat.strftime("%Y-%m-%d"),
                "numero_facture": achat.numero_facture,
                "total": achat.total,
                "items": item_list,
            }
        )
    return jsonify(result)
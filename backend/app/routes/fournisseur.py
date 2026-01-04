from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.fournisseur import Fournisseur

fournisseur_bp = Blueprint("fournisseurs", __name__, url_prefix="/fournisseurs")

@fournisseur_bp.route("", methods=["POST"])
def create_fournisseur():
    data = request.json
    f = Fournisseur(
        nom=data["nom"],
        telephone=data.get("telephone"),
        adresse=data.get("adresse"),
    )
    db.session.add(f)
    db.session.commit()
    return jsonify({"id": f.id}), 201

@fournisseur_bp.route("", methods=["GET"])
def list_fournisseurs():
    fournisseurs = Fournisseur.query.all()
    return jsonify([{"id": f.id, "nom": f.nom} for f in fournisseurs])

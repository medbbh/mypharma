from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.medicament import Medicament

medicament_bp = Blueprint("medicaments", __name__, url_prefix="/medicaments")


@medicament_bp.route("", methods=["POST"])
def create_medicament():
    data = request.json

    required = ["nom_commercial", "nom_scientifique", "molecule", "dosage", "forme"]
    for field in required:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    medicament = Medicament(
        nom_commercial=data["nom_commercial"],
        nom_scientifique=data["nom_scientifique"],
        molecule=data["molecule"],
        dosage=data["dosage"],
        forme=data["forme"],
    )

    try:
        db.session.add(medicament)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Medicament already exists"}), 409

    return jsonify({"id": medicament.id}), 201


@medicament_bp.route("", methods=["GET"])
def list_medicaments():
    medicaments = Medicament.query.filter_by(is_active=True).all()

    return jsonify([
        {
            "id": m.id,
            "nom_commercial": m.nom_commercial,
            "nom_scientifique": m.nom_scientifique,
            "molecule": m.molecule,
            "dosage": m.dosage,
            "forme": m.forme
        }
        for m in medicaments
    ])


@medicament_bp.route("/<int:id>", methods=["PUT"])
def update_medicament(id):
    medicament = Medicament.query.get_or_404(id)
    data = request.json

    for field in ["nom_commercial", "nom_scientifique", "molecule", "dosage", "forme"]:
        if field in data:
            setattr(medicament, field, data[field])

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Duplicate medicament"}), 409

    return jsonify({"message": "Updated successfully"})


@medicament_bp.route("/<int:id>", methods=["DELETE"])
def delete_medicament(id):
    medicament = Medicament.query.get_or_404(id)
    medicament.is_active = False
    db.session.commit()

    return jsonify({"message": "Medicament archived"})

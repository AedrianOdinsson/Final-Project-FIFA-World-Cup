from flask import Blueprint, jsonify, request
from database import db
from models.selection import WorldCupSelection
from models.user import User

selection_bp = Blueprint('selection', __name__)


# GET — obtener todas las selecciones de un usuario
@selection_bp.route('/api/selection/<int:user_id>', methods=['GET'])
def get_selections(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    selections = WorldCupSelection.query.filter_by(user_id=user_id).all()
    return jsonify([s.to_dict() for s in selections]), 200


# POST — guardar una selección favorita
@selection_bp.route('/api/selection', methods=['POST'])
def create_selection():
    body = request.get_json()

    user_id = body.get('user_id')
    team_name = body.get('team_name', '').strip()
    group = body.get('group', '').strip()
    phase = body.get('phase', '').strip()

    if not all([user_id, team_name, group, phase]):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    new_selection = WorldCupSelection(
        user_id=user_id,
        team_name=team_name,
        group=group,
        phase=phase,
    )

    db.session.add(new_selection)
    db.session.commit()

    return jsonify(new_selection.to_dict()), 201


# DELETE — eliminar una selección
@selection_bp.route('/api/selection/<int:selection_id>', methods=['DELETE'])
def delete_selection(selection_id):
    selection = WorldCupSelection.query.get(selection_id)
    if not selection:
        return jsonify({"msg": "Selección no encontrada"}), 404

    db.session.delete(selection)
    db.session.commit()

    return jsonify({"msg": "Selección eliminada correctamente"}), 200
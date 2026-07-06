from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User

user_bp = Blueprint('user', __name__)


@user_bp.route('/api/user', methods=['GET'])
def get_users():
    return jsonify({"msg": "Todo bien"})


@user_bp.route('/api/user/register', methods=['POST'])
def register_user():
    body = request.get_json(silent=True) or {}

    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not name or not email or not password:
        return jsonify({"msg": "Nombre, email y contraseña son obligatorios"}), 400

    if len(password) < 6:
        return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Ya existe una cuenta con ese email"}), 409

    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Ya existe una cuenta con ese email"}), 409

    return jsonify({"msg": "Registro terminado", "user": new_user.to_dict()}), 201


@user_bp.route('/api/login', methods=['POST'])
def login_user():
    body = request.get_json(silent=True) or {}

    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({"msg": "Inicio de sesion terminado", "user": user.to_dict()}), 200
    else:
        return jsonify({"msg": "Credenciales invalidas"}), 401


@user_bp.route('/api/user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    body = request.get_json(silent=True) or {}

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    name = (body.get('name', user.name) or '').strip()
    email = (body.get('email', user.email) or '').strip().lower()
    password = body.get('password', None)

    if not name or not email:
        return jsonify({"msg": "Nombre y email no pueden estar vacíos"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing and existing.id != user.id:
        return jsonify({"msg": "Ese email ya está en uso por otra cuenta"}), 409

    user.name = name
    user.email = email

    if password:
        if len(password) < 6:
            return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres"}), 400
        user.password = generate_password_hash(password)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Ese email ya está en uso por otra cuenta"}), 409

    return jsonify({"msg": "Usuario actualizado correctamente", "user": user.to_dict()}), 200


@user_bp.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado correctamente"}), 200
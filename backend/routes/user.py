from flask import Blueprint, jsonify, request
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user', methods=['GET'])
def get_users():

    return jsonify({"msg": "Todo bien"})

@user_bp.route('/api/user/register', methods=['POST'])
def register_user():
    body = request.get_json()

    name= body.get('name').strip()
    email= body.get('email').strip()
    password= body.get('password',)

    new_user = User(
        name=name, 
        email=email, 
        password=generate_password_hash(password),
        )

    db.session.add(new_user)
    db.session.commit()


    return jsonify({"msg": "Registro  terminado"})

@user_bp.route('/api/login', methods=['POST'])
def login_user():
    body = request.get_json()

    email = body.get('email').strip()
    password = body.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({"msg": "Inicio de sesion terminado"})
    else:
        return jsonify({"msg": "Credenciales invalidas"}), 401

@user_bp.route('/api/user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    body = request.get_json()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    name = body.get('name', user.name).strip()
    email = body.get('email', user.email).strip()
    password = body.get('password', None)

    user.name = name
    user.email = email

    if password:
        user.password = generate_password_hash(password)

    db.session.commit()

    return jsonify({"msg": "Usuario actualizado correctamente"}), 200

@user_bp.route('/api/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado correctamente"}), 200
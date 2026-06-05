from datetime import datetime, timedelta
import hashlib
import secrets
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Usuario

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('nombre'):
        return jsonify({'error': 'Nombre, email y contraseña son requeridos'}), 400

    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    usuario = Usuario(
        nombre=data['nombre'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        rol=data.get('rol', 'estudiante'),
        bio=data.get('bio', ''),
    )
    db.session.add(usuario)
    db.session.commit()

    token = create_access_token(identity=str(usuario.id))
    return jsonify({'token': token, 'usuario': usuario.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400

    usuario = Usuario.query.filter_by(email=data['email']).first()
    if not usuario or not check_password_hash(usuario.password_hash, data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    if not usuario.activo:
        return jsonify({'error': 'Cuenta desactivada'}), 403

    usuario.ultimo_acceso = datetime.utcnow()
    db.session.commit()

    token = create_access_token(identity=str(usuario.id))
    return jsonify({'token': token, 'usuario': usuario.to_dict()})


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    usuario_id = int(get_jwt_identity())
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify(usuario.to_dict())


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    usuario_id = int(get_jwt_identity())
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    if data.get('nombre'):
        usuario.nombre = data['nombre']
    if data.get('bio') is not None:
        usuario.bio = data['bio']
    if data.get('avatar_url') is not None:
        usuario.avatar_url = data['avatar_url']

    db.session.commit()
    return jsonify(usuario.to_dict())


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': 'Email requerido'}), 400

    usuario = Usuario.query.filter_by(email=data['email']).first()
    if not usuario:
        return jsonify({'message': 'Si el email existe, recibirás instrucciones'}), 200

    token = secrets.token_urlsafe(32)
    usuario.reset_token = token
    usuario.reset_token_expira = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    return jsonify({
        'message': 'Si el email existe, recibirás instrucciones',
        'reset_token': token,
        'reset_url': f'/reset-password?token={token}'
    }), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if not data or not data.get('token') or not data.get('password'):
        return jsonify({'error': 'Token y nueva contraseña requeridos'}), 400

    usuario = Usuario.query.filter_by(reset_token=data['token']).first()
    if not usuario or not usuario.reset_token_expira or usuario.reset_token_expira < datetime.utcnow():
        return jsonify({'error': 'Token inválido o expirado'}), 400

    usuario.password_hash = generate_password_hash(data['password'])
    usuario.reset_token = None
    usuario.reset_token_expira = None
    db.session.commit()

    return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200

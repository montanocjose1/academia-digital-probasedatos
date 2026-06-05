from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Usuario, Curso, Capitulo, Leccion, Categoria, Inscripcion

admin_bp = Blueprint('admin', __name__)


def admin_required(f):
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def wrapper(*args, **kwargs):
        usuario_id = int(get_jwt_identity())
        usuario = Usuario.query.get(usuario_id)
        if not usuario or usuario.rol != 'admin':
            return jsonify({'error': 'Acceso no autorizado'}), 403
        return f(*args, **kwargs)
    return wrapper


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_usuarios = Usuario.query.count()
    total_cursos = Curso.query.count()
    total_inscripciones = Inscripcion.query.count()
    total_categorias = Categoria.query.count()

    return jsonify({
        'total_usuarios': total_usuarios,
        'total_cursos': total_cursos,
        'total_inscripciones': total_inscripciones,
        'total_categorias': total_categorias,
    })


@admin_bp.route('/cursos', methods=['POST'])
@admin_required
def create_course():
    data = request.get_json()
    if not data or not data.get('titulo'):
        return jsonify({'error': 'Título requerido'}), 400

    import re
    slug = data.get('slug', data['titulo'].lower().replace(' ', '-'))
    slug = re.sub(r'[^a-z0-9-]', '', slug)

    curso = Curso(
        titulo=data['titulo'],
        slug=slug,
        descripcion_corta=data.get('descripcion_corta', ''),
        descripcion_larga=data.get('descripcion_larga', ''),
        precio=data.get('precio', 0),
        nivel=data.get('nivel', 'principiante'),
        categoria_id=data.get('categoria_id'),
        instructor_id=data.get('instructor_id', int(get_jwt_identity())),
        portada_url=data.get('portada_url'),
        publicado=data.get('publicado', False),
        destacado=data.get('destacado', False),
    )
    db.session.add(curso)
    db.session.commit()

    return jsonify(curso.to_dict()), 201


@admin_bp.route('/cursos/<int:curso_id>', methods=['PUT'])
@admin_required
def update_course(curso_id):
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404

    data = request.get_json()
    for field in ['titulo', 'descripcion_corta', 'descripcion_larga', 'precio',
                  'nivel', 'categoria_id', 'portada_url', 'publicado', 'destacado']:
        if field in data:
            setattr(curso, field, data[field])
    if 'slug' in data:
        import re
        curso.slug = re.sub(r'[^a-z0-9-]', '', data['slug'])

    db.session.commit()
    return jsonify(curso.to_dict())


@admin_bp.route('/cursos/<int:curso_id>', methods=['DELETE'])
@admin_required
def delete_course(curso_id):
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
    db.session.delete(curso)
    db.session.commit()
    return jsonify({'message': 'Curso eliminado'}), 200


@admin_bp.route('/cursos/<int:curso_id>/capitulos', methods=['POST'])
@admin_required
def add_capitulo(curso_id):
    data = request.get_json()
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404

    max_orden = db.session.query(db.func.max(Capitulo.orden)).filter_by(curso_id=curso_id).scalar()
    capitulo = Capitulo(
        curso_id=curso_id,
        titulo=data['titulo'],
        descripcion=data.get('descripcion', ''),
        orden=data.get('orden', (max_orden or 0) + 1),
        duracion_estimada=data.get('duracion_estimada'),
    )
    db.session.add(capitulo)
    curso.total_modulos = (curso.total_modulos or 0) + 1
    db.session.commit()

    return jsonify(capitulo.to_dict()), 201


@admin_bp.route('/usuarios', methods=['GET'])
@admin_required
def list_users():
    usuarios = Usuario.query.order_by(Usuario.created_at.desc()).all()
    return jsonify([u.to_dict() for u in usuarios])

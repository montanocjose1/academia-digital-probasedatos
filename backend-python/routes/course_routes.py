from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Curso, Capitulo, Leccion, Categoria, Inscripcion, RecursoMultimedia

course_bp = Blueprint('courses', __name__)


@course_bp.route('/', methods=['GET'])
def list_courses():
    categoria = request.args.get('categoria')
    nivel = request.args.get('nivel')
    search = request.args.get('search')
    destacado = request.args.get('destacado')

    query = Curso.query.filter_by(publicado=True)

    if categoria:
        query = query.filter_by(categoria_id=int(categoria))
    if nivel:
        query = query.filter_by(nivel=nivel)
    if destacado:
        query = query.filter_by(destacado=True)
    if search:
        query = query.filter(Curso.titulo.ilike(f'%{search}%'))

    cursos = query.order_by(Curso.created_at.desc()).all()
    return jsonify([c.to_dict() for c in cursos])


@course_bp.route('/<slug>', methods=['GET'])
def get_course(slug):
    curso = Curso.query.filter_by(slug=slug, publicado=True).first()
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404
    return jsonify(curso.to_dict(include_capitulos=True))


@course_bp.route('/<int:curso_id>/lecciones/<int:leccion_id>', methods=['GET'])
def get_leccion(curso_id, leccion_id):
    leccion = Leccion.query.join(Capitulo).filter(
        Leccion.id == leccion_id,
        Capitulo.curso_id == curso_id
    ).first()
    if not leccion:
        return jsonify({'error': 'Lección no encontrada'}), 404

    result = leccion.to_dict()
    result['recursos'] = [r.to_dict() for r in leccion.recursos]
    result['evaluaciones'] = [e.to_dict() for e in leccion.evaluaciones.order_by('orden')]
    return jsonify(result)


@course_bp.route('/categorias', methods=['GET'])
def list_categorias():
    categorias = Categoria.query.all()
    return jsonify([c.to_dict() for c in categorias])


@course_bp.route('/<int:curso_id>/inscribir', methods=['POST'])
@jwt_required()
def enroll_course(curso_id):
    usuario_id = int(get_jwt_identity())
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Curso no encontrado'}), 404

    existing = Inscripcion.query.filter_by(usuario_id=usuario_id, curso_id=curso_id).first()
    if existing:
        return jsonify({'message': 'Ya estás inscrito en este curso', 'inscripcion': existing.to_dict()}), 200

    inscripcion = Inscripcion(usuario_id=usuario_id, curso_id=curso_id)
    db.session.add(inscripcion)
    curso.total_estudiantes = (curso.total_estudiantes or 0) + 1
    db.session.commit()

    return jsonify({'message': 'Inscripción exitosa', 'inscripcion': inscripcion.to_dict()}), 201


@course_bp.route('/<int:curso_id>/progreso', methods=['GET'])
@jwt_required()
def get_course_progress(curso_id):
    usuario_id = int(get_jwt_identity())
    inscripcion = Inscripcion.query.filter_by(usuario_id=usuario_id, curso_id=curso_id).first()
    if not inscripcion:
        return jsonify({'error': 'No estás inscrito en este curso'}), 404
    return jsonify(inscripcion.to_dict())

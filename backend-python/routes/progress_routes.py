from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ProgresoEstudiante, Leccion, Capitulo, Inscripcion

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/leccion/<int:leccion_id>', methods=['GET'])
@jwt_required()
def get_leccion_progress(leccion_id):
    usuario_id = int(get_jwt_identity())
    progreso = ProgresoEstudiante.query.filter_by(
        usuario_id=usuario_id, leccion_id=leccion_id
    ).first()
    if not progreso:
        return jsonify({'completado': False, 'puntuacion': None, 'intentos': 0})
    return jsonify(progreso.to_dict())


@progress_bp.route('/leccion/<int:leccion_id>', methods=['POST'])
@jwt_required()
def update_leccion_progress(leccion_id):
    usuario_id = int(get_jwt_identity())
    data = request.get_json()

    progreso = ProgresoEstudiante.query.filter_by(
        usuario_id=usuario_id, leccion_id=leccion_id
    ).first()

    if not progreso:
        progreso = ProgresoEstudiante(
            usuario_id=usuario_id,
            leccion_id=leccion_id,
            completado=data.get('completado', False),
            puntuacion=data.get('puntuacion'),
            tiempo_dedicado=data.get('tiempo_dedicado'),
            intentos=1,
            fecha_completado=datetime.utcnow() if data.get('completado') else None,
        )
        db.session.add(progreso)
    else:
        progreso.completado = data.get('completado', progreso.completado)
        if data.get('puntuacion') is not None:
            progreso.puntuacion = data['puntuacion']
        if data.get('tiempo_dedicado') is not None:
            progreso.tiempo_dedicado = (progreso.tiempo_dedicado or 0) + data['tiempo_dedicado']
        progreso.intentos = (progreso.intentos or 0) + 1
        if data.get('completado'):
            progreso.fecha_completado = datetime.utcnow()

    db.session.commit()
    return jsonify(progreso.to_dict())


@progress_bp.route('/curso/<int:curso_id>', methods=['GET'])
@jwt_required()
def get_all_progress(curso_id):
    usuario_id = int(get_jwt_identity())
    progresos = ProgresoEstudiante.query.join(Leccion).join(Capitulo).filter(
        ProgresoEstudiante.usuario_id == usuario_id,
        Capitulo.curso_id == curso_id
    ).all()

    return jsonify([p.to_dict() for p in progresos])


@progress_bp.route('/resumen', methods=['GET'])
@jwt_required()
def get_progress_summary():
    usuario_id = int(get_jwt_identity())
    inscripciones = Inscripcion.query.filter_by(usuario_id=usuario_id).all()

    result = []
    for ins in inscripciones:
        curso_data = ins.curso.to_dict() if ins.curso else None
        if curso_data:
            result.append({
                'curso': curso_data,
                'progreso': ins.progreso,
                'fecha_inscripcion': ins.fecha_inscripcion.isoformat() if ins.fecha_inscripcion else None,
                'fecha_completado': ins.fecha_completado.isoformat() if ins.fecha_completado else None,
                'certificado_url': ins.certificado_url,
            })

    return jsonify(result)

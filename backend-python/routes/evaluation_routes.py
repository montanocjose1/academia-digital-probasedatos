from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Evaluacion, RespuestaEstudiante

evaluation_bp = Blueprint('evaluations', __name__)


@evaluation_bp.route('/<int:evaluacion_id>/responder', methods=['POST'])
@jwt_required()
def submit_answer(evaluacion_id):
    usuario_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or data.get('respuesta') is None:
        return jsonify({'error': 'Respuesta requerida'}), 400

    evaluacion = Evaluacion.query.get(evaluacion_id)
    if not evaluacion:
        return jsonify({'error': 'Evaluación no encontrada'}), 404

    respuesta_seleccionada = int(data['respuesta'])
    es_correcta = respuesta_seleccionada == evaluacion.respuesta_correcta

    existing = RespuestaEstudiante.query.filter_by(
        usuario_id=usuario_id, evaluacion_id=evaluacion_id
    ).first()

    if existing:
        existing.respuesta_seleccionada = respuesta_seleccionada
        existing.es_correcta = es_correcta
    else:
        resp = RespuestaEstudiante(
            usuario_id=usuario_id,
            evaluacion_id=evaluacion_id,
            respuesta_seleccionada=respuesta_seleccionada,
            es_correcta=es_correcta,
        )
        db.session.add(resp)

    db.session.commit()

    return jsonify({
        'correcta': es_correcta,
        'respuesta_correcta': evaluacion.respuesta_correcta,
        'explicacion': evaluacion.explicacion,
    })


@evaluation_bp.route('/leccion/<int:leccion_id>/puntaje', methods=['GET'])
@jwt_required()
def get_leccion_score(leccion_id):
    usuario_id = int(get_jwt_identity())
    evaluaciones = Evaluacion.query.filter_by(leccion_id=leccion_id).all()
    total = len(evaluaciones)
    if total == 0:
        return jsonify({'total': 0, 'correctas': 0, 'puntaje': 100})

    respuestas = RespuestaEstudiante.query.filter(
        RespuestaEstudiante.usuario_id == usuario_id,
        RespuestaEstudiante.evaluacion_id.in_([e.id for e in evaluaciones])
    ).all()

    respuestas_map = {r.evaluacion_id: r for r in respuestas}
    correctas = sum(1 for e in evaluaciones if e.id in respuestas_map and respuestas_map[e.id].es_correcta)

    return jsonify({
        'total': total,
        'correctas': correctas,
        'puntaje': round(correctas / total * 100, 2) if total > 0 else 0,
    })

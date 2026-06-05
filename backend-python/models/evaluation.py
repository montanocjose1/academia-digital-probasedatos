from datetime import datetime
from . import db
from sqlalchemy.dialects.postgresql import JSONB


class Evaluacion(db.Model):
    __tablename__ = 'evaluaciones'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    leccion_id = db.Column(db.Integer, db.ForeignKey('academia.lecciones.id'), nullable=False)
    pregunta = db.Column(db.Text, nullable=False)
    opciones = db.Column(JSONB, nullable=False)
    respuesta_correcta = db.Column(db.Integer, nullable=False)
    explicacion = db.Column(db.Text)
    orden = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, include_answer=False):
        data = {
            'id': self.id,
            'leccion_id': self.leccion_id,
            'pregunta': self.pregunta,
            'opciones': self.opciones,
            'orden': self.orden,
        }
        if include_answer:
            data['respuesta_correcta'] = self.respuesta_correcta
            data['explicacion'] = self.explicacion
        return data


class RespuestaEstudiante(db.Model):
    __tablename__ = 'respuestas_estudiante'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    evaluacion_id = db.Column(db.Integer, db.ForeignKey('academia.evaluaciones.id'), nullable=False)
    respuesta_seleccionada = db.Column(db.Integer, nullable=False)
    es_correcta = db.Column(db.Boolean, nullable=False)
    fecha_respuesta = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'evaluacion_id': self.evaluacion_id,
            'respuesta_seleccionada': self.respuesta_seleccionada,
            'es_correcta': self.es_correcta,
            'fecha_respuesta': self.fecha_respuesta.isoformat() if self.fecha_respuesta else None,
        }


class ForoPregunta(db.Model):
    __tablename__ = 'foro_preguntas'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    curso_id = db.Column(db.Integer, db.ForeignKey('academia.cursos.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    resuelto = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    respuestas = db.relationship('ForoRespuesta', backref='pregunta', lazy='dynamic',
                                 cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'curso_id': self.curso_id,
            'usuario_id': self.usuario_id,
            'titulo': self.titulo,
            'contenido': self.contenido,
            'resuelto': self.resuelto,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class ForoRespuesta(db.Model):
    __tablename__ = 'foro_respuestas'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    pregunta_id = db.Column(db.Integer, db.ForeignKey('academia.foro_preguntas.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    es_solucion = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'pregunta_id': self.pregunta_id,
            'usuario_id': self.usuario_id,
            'contenido': self.contenido,
            'es_solucion': self.es_solucion,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

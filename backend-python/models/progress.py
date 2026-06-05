from datetime import datetime
from . import db


class ProgresoEstudiante(db.Model):
    __tablename__ = 'progreso_estudiante'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    leccion_id = db.Column(db.Integer, db.ForeignKey('academia.lecciones.id'), nullable=False)
    completado = db.Column(db.Boolean, default=False)
    puntuacion = db.Column(db.Numeric(5, 2))
    tiempo_dedicado = db.Column(db.Integer)
    intentos = db.Column(db.Integer, default=0)
    fecha_completado = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'leccion_id': self.leccion_id,
            'completado': self.completado,
            'puntuacion': float(self.puntuacion) if self.puntuacion else None,
            'tiempo_dedicado': self.tiempo_dedicado,
            'intentos': self.intentos,
            'fecha_completado': self.fecha_completado.isoformat() if self.fecha_completado else None,
        }

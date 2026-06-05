from datetime import datetime
from . import db


class Usuario(db.Model):
    __tablename__ = 'usuarios'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='estudiante')
    avatar_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    sitio_web = db.Column(db.String(255))
    verified = db.Column(db.Boolean, default=False)
    activo = db.Column(db.Boolean, default=True)
    ultimo_acceso = db.Column(db.DateTime)
    reset_token = db.Column(db.String(255))
    reset_token_expira = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cursos = db.relationship('Curso', backref='instructor', lazy='dynamic',
                             foreign_keys='Curso.instructor_id')
    inscripciones = db.relationship('Inscripcion', backref='usuario', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'rol': self.rol,
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'verified': self.verified,
            'ultimo_acceso': self.ultimo_acceso.isoformat() if self.ultimo_acceso else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

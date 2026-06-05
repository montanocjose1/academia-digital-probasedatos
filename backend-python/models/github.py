from datetime import datetime
from . import db


class RepositorioGithub(db.Model):
    __tablename__ = 'repositorios_github'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('academia.cursos.id'))
    nombre = db.Column(db.String(200), nullable=False)
    url_repositorio = db.Column(db.String(500), nullable=False)
    descripcion = db.Column(db.Text)
    rama_principal = db.Column(db.String(50), default='main')
    commits_ejemplo = db.Column(db.ARRAY(db.Text))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'curso_id': self.curso_id,
            'nombre': self.nombre,
            'url_repositorio': self.url_repositorio,
            'descripcion': self.descripcion,
            'rama_principal': self.rama_principal,
            'commits_ejemplo': self.commits_ejemplo or [],
        }

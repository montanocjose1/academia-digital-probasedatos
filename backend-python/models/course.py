from datetime import datetime
from . import db


class Categoria(db.Model):
    __tablename__ = 'categorias'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    icono = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    cursos = db.relationship('Curso', backref='categoria', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'icono': self.icono,
        }


class Curso(db.Model):
    __tablename__ = 'cursos'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True, index=True)
    descripcion_corta = db.Column(db.String(300))
    descripcion_larga = db.Column(db.Text)
    precio = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    nivel = db.Column(db.String(20), nullable=False, default='principiante')
    categoria_id = db.Column(db.Integer, db.ForeignKey('academia.categorias.id'))
    instructor_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    portada_url = db.Column(db.String(500))
    video_promo_url = db.Column(db.String(500))
    duracion_horas = db.Column(db.Numeric(5, 1))
    total_lecciones = db.Column(db.Integer, default=0)
    total_modulos = db.Column(db.Integer, default=0)
    rating = db.Column(db.Numeric(2, 1), default=0)
    total_estudiantes = db.Column(db.Integer, default=0)
    destacado = db.Column(db.Boolean, default=False)
    publicado = db.Column(db.Boolean, default=False)
    requisitos = db.Column(db.ARRAY(db.Text))
    objetivos = db.Column(db.ARRAY(db.Text))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    capitulos = db.relationship('Capitulo', backref='curso', lazy='dynamic',
                                order_by='Capitulo.orden', cascade='all, delete-orphan')
    inscripciones = db.relationship('Inscripcion', backref='curso', lazy='dynamic')

    def to_dict(self, include_capitulos=False):
        data = {
            'id': self.id,
            'titulo': self.titulo,
            'slug': self.slug,
            'descripcion_corta': self.descripcion_corta,
            'descripcion_larga': self.descripcion_larga,
            'precio': float(self.precio) if self.precio else 0,
            'nivel': self.nivel,
            'categoria_id': self.categoria_id,
            'categoria_nombre': self.categoria.nombre if self.categoria else None,
            'instructor_id': self.instructor_id,
            'instructor_nombre': self.instructor.nombre if self.instructor else None,
            'portada_url': self.portada_url,
            'duracion_horas': float(self.duracion_horas) if self.duracion_horas else 0,
            'total_lecciones': self.total_lecciones,
            'total_modulos': self.total_modulos,
            'rating': float(self.rating) if self.rating else 0,
            'total_estudiantes': self.total_estudiantes,
            'destacado': self.destacado,
            'publicado': self.publicado,
            'requisitos': self.requisitos or [],
            'objetivos': self.objetivos or [],
        }
        if include_capitulos:
            data['capitulos'] = [c.to_dict(include_lecciones=True) for c in self.capitulos]
        return data


class Capitulo(db.Model):
    __tablename__ = 'capitulos'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    curso_id = db.Column(db.Integer, db.ForeignKey('academia.cursos.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    orden = db.Column(db.Integer, nullable=False)
    duracion_estimada = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lecciones = db.relationship('Leccion', backref='capitulo', lazy='dynamic',
                                order_by='Leccion.orden', cascade='all, delete-orphan')

    def to_dict(self, include_lecciones=False):
        data = {
            'id': self.id,
            'curso_id': self.curso_id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'video_url': self.video_url,
            'orden': self.orden,
            'duracion_estimada': self.duracion_estimada,
        }
        if include_lecciones:
            data['lecciones'] = [l.to_dict() for l in self.lecciones]
        return data


class Leccion(db.Model):
    __tablename__ = 'lecciones'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    capitulo_id = db.Column(db.Integer, db.ForeignKey('academia.capitulos.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    contenido_texto = db.Column(db.Text)
    codigo_ejemplo = db.Column(db.Text)
    tipo = db.Column(db.String(30), default='teoria')
    orden = db.Column(db.Integer, nullable=False)
    duracion_estimada = db.Column(db.Integer)
    video_url = db.Column(db.String(500))
    recurso_url = db.Column(db.String(500))
    es_gratuito = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recursos = db.relationship('RecursoMultimedia', backref='leccion', lazy='dynamic',
                               cascade='all, delete-orphan')
    evaluaciones = db.relationship('Evaluacion', backref='leccion', lazy='dynamic',
                                   cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'capitulo_id': self.capitulo_id,
            'titulo': self.titulo,
            'contenido_texto': self.contenido_texto,
            'codigo_ejemplo': self.codigo_ejemplo,
            'tipo': self.tipo,
            'orden': self.orden,
            'duracion_estimada': self.duracion_estimada,
            'video_url': self.video_url,
            'es_gratuito': self.es_gratuito,
        }


class RecursoMultimedia(db.Model):
    __tablename__ = 'recursos_multimedia'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    leccion_id = db.Column(db.Integer, db.ForeignKey('academia.lecciones.id'), nullable=False)
    titulo = db.Column(db.String(200))
    tipo = db.Column(db.String(30), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    descripcion = db.Column(db.Text)
    orden = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'leccion_id': self.leccion_id,
            'titulo': self.titulo,
            'tipo': self.tipo,
            'url': self.url,
            'descripcion': self.descripcion,
        }


class Inscripcion(db.Model):
    __tablename__ = 'inscripciones'
    __table_args__ = {'schema': 'academia'}

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('academia.usuarios.id'), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('academia.cursos.id'), nullable=False)
    fecha_inscripcion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_completado = db.Column(db.DateTime)
    progreso = db.Column(db.Numeric(5, 2), default=0)
    certificado_generado = db.Column(db.Boolean, default=False)
    certificado_url = db.Column(db.String(500))

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'curso_id': self.curso_id,
            'fecha_inscripcion': self.fecha_inscripcion.isoformat() if self.fecha_inscripcion else None,
            'fecha_completado': self.fecha_completado.isoformat() if self.fecha_completado else None,
            'progreso': float(self.progreso) if self.progreso else 0,
            'certificado_generado': self.certificado_generado,
            'certificado_url': self.certificado_url,
        }

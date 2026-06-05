from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import Usuario
from .course import Categoria, Curso, Capitulo, Leccion, RecursoMultimedia, Inscripcion
from .progress import ProgresoEstudiante
from .evaluation import Evaluacion, RespuestaEstudiante, ForoPregunta, ForoRespuesta
from .github import RepositorioGithub

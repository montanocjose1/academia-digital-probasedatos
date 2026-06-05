# Documentación Técnica - Academia Digital Pro

## Arquitectura del Sistema

### 1. Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIOS (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│                    Frontend (React + Vite)                   │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │  Home   │ │ Catalog  │ │  Course   │ │   GA Lab     │  │
│  │  Page   │ │  Page    │ │  Detail   │ │  Interactive │  │
│  └─────────┘ └──────────┘ └───────────┘ └──────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │  Login  │ │  Profile │ │  Learning │ │   Admin      │  │
│  │/Register│ │  Page    │ │ Dashboard │ │  Dashboard   │  │
│  └─────────┘ └──────────┘ └───────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     API REST (Flask)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Auth    │ │ Courses  │ │ Progress │ │   GA Engine  │  │
│  │  Routes  │ │ Routes   │ │ Routes   │ │   Routes     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   Base de Datos PostgreSQL                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ │
│  │users │ │cursos│ │caps  │ │lecc  │ │prog  │ │eval    │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.x |
| Frontend | Vite | 8.x |
| Frontend | Tailwind CSS | 4.x |
| Frontend | React Router | 7.x |
| Backend | Python Flask | 3.0 |
| Backend | Flask-SQLAlchemy | 3.1 |
| Backend | Flask-JWT-Extended | 4.6 |
| Base de Datos | PostgreSQL | 16+ |
| ORM | SQLAlchemy | 2.0 |
| Control Versiones | Git / GitHub | - |
| Despliegue Frontend | GitHub Pages | - |

### 3. Estructura del Proyecto

```
academia-digital-pro/
├── frontend/                    # Aplicación React (Vite)
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── context/             # Contextos (Auth, Cart)
│   │   ├── config/              # Configuración (API)
│   │   └── assets/              # Recursos estáticos
│   ├── dist/                    # Build de producción
│   └── package.json
│
├── backend-python/              # API Flask
│   ├── models/                  # Modelos SQLAlchemy
│   ├── routes/                  # Blueprints Flask
│   ├── services/                # Lógica de negocio
│   ├── migrations/              # Scripts SQL
│   ├── app.py                   # Punto de entrada
│   ├── config.py                # Configuración
│   └── requirements.txt
│
├── database/                    # Base de datos
│   ├── schema.sql               # Esquema completo
│   ├── er-diagram.html          # Diagrama ER
│   └── seed.sql                 # Datos iniciales
│
├── ga-course/                   # Contenido del curso AG
│   ├── modulo1-introduccion.md
│   ├── modulo2-conceptos-fundamentales.md
│   ├── modulo3-funcion-fitness.md
│   ├── modulo4-seleccion.md
│   ├── modulo5-cruce.md
│   ├── modulo6-mutacion.md
│   ├── modulo7-implementacion-python.md
│   └── modulo8-proyecto-final.md
│
├── docs/                        # Documentación
│   ├── arquitectura.md
│   ├── guia-vm.md
│   └── presentacion.md
│
└── .github/workflows/           # CI/CD
    └── deploy.yml
```

### 4. API REST Endpoints

#### Autenticación
```
POST   /api/auth/register        Registro de usuario
POST   /api/auth/login           Inicio de sesión
GET    /api/auth/me              Perfil actual
PUT    /api/auth/profile         Actualizar perfil
POST   /api/auth/forgot-password Recuperar contraseña
POST   /api/auth/reset-password  Resetear contraseña
```

#### Cursos
```
GET    /api/courses/             Listar cursos
GET    /api/courses/:slug        Detalle del curso
GET    /api/courses/:id/lecciones/:id  Lección específica
GET    /api/courses/categorias   Listar categorías
POST   /api/courses/:id/inscribir Inscribirse
```

#### Progreso
```
GET    /api/progress/leccion/:id     Progreso en lección
POST   /api/progress/leccion/:id     Actualizar progreso
GET    /api/progress/curso/:id       Progreso en curso
GET    /api/progress/resumen         Resumen del usuario
```

#### Evaluaciones
```
POST   /api/evaluations/:id/responder  Enviar respuesta
GET    /api/evaluations/leccion/:id/puntaje  Obtener puntaje
```

#### Administración
```
GET    /api/admin/stats         Estadísticas del sistema
POST   /api/admin/cursos        Crear curso
PUT    /api/admin/cursos/:id    Actualizar curso
DELETE /api/admin/cursos/:id    Eliminar curso
GET    /api/admin/usuarios      Listar usuarios
```

#### Algoritmo Genético
```
POST   /api/ga/simulate         Ejecutar simulación AG
GET    /api/ga/explain          Explicación del AG
```

### 5. Base de Datos: 13 Tablas

| Tabla | Descripción | Registros semilla |
|-------|------------|-------------------|
| categorias | Categorías de cursos | 6 |
| usuarios | Usuarios del sistema | 3 |
| cursos | Cursos ofertados | 1 |
| capitulos | Módulos de cada curso | 8 |
| lecciones | Lecciones individuales | 24+ |
| recursos_multimedia | Recursos multimedia | 2+ |
| inscripciones | Inscripciones a cursos | - |
| progreso_estudiante | Progreso detallado | - |
| evaluaciones | Preguntas de evaluación | 10+ |
| respuestas_estudiante | Respuestas a evaluaciones | - |
| repositorios_github | Enlaces GitHub | 1 |
| foro_preguntas | Preguntas del foro | - |
| foro_respuestas | Respuestas del foro | - |

### 6. Seguridad

- **Autenticación:** JWT (JSON Web Tokens) con expiración de 24h
- **Contraseñas:** Hash bcrypt (werkzeug.security)
- **CORS:** Configurado para el frontend específico
- **Roles:** admin, instructor, estudiante (control de acceso)
- **Validación:** Server-side en todas las rutas

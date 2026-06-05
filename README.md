# 🧬 Academia Digital Pro

**Plataforma Educativa de Cursos en Línea**  
**Curso: Algoritmos Genéticos — De la Teoría a la Práctica**

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura](#-arquitectura)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Requisitos](#-requisitos)
5. [Instalación Rápida](#-instalación-rápida)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Curso de Algoritmos Genéticos](#-curso-de-algoritmos-genéticos)
8. [Laboratorio Interactivo](#-laboratorio-interactivo)
9. [Base de Datos](#-base-de-datos)
10. [API REST](#-api-rest)
11. [Despliegue](#-despliegue)
12. [Commits de Ejemplo](#-commits-de-ejemplo)
13. [Autores](#-autores)

---

## 🎯 Descripción General

Academia Digital Pro es una plataforma educativa full stack que ofrece:

- **Catálogo de cursos** con búsqueda, filtros y categorías
- **Sistema de usuarios** con registro, login y perfiles
- **Curso completo** de Algoritmos Genéticos (8 módulos)
- **Laboratorio interactivo** con simulación en vivo
- **Seguimiento de progreso** académico
- **Panel de administración** completo
- **Base de datos PostgreSQL** con 13 tablas
- **API REST** con Python Flask y autenticación JWT

---

## 🏗️ Arquitectura

```
Cliente (React + Vite)          Servidor (Flask)            Base de Datos
┌─────────────────┐           ┌──────────────────┐        ┌──────────────┐
│  Home Page      │  HTTP/JSON │  Auth Routes     │  SQL   │  PostgreSQL  │
│  Catalog        │ ◄────────► │  Course Routes   │ ◄────► │  - usuarios  │
│  Course Detail  │    JWT     │  Progress Routes │        │  - cursos    │
│  GA Lab         │           │  GA Routes       │        │  - lecciones │
│  Admin Panel    │           │  Admin Routes    │        │  - progreso  │
│  User Dashboard │           │                  │        │  +10 más     │
└─────────────────┘           └──────────────────┘        └──────────────┘
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React | 19.x |
| | Vite | 8.x |
| | Tailwind CSS | 4.x |
| | React Router | 7.x |
| **Backend** | Python Flask | 3.0 |
| | SQLAlchemy | 2.0 |
| | Flask-JWT-Extended | 4.6 |
| **Base de Datos** | PostgreSQL | 16+ |
| **Infraestructura** | Git / GitHub | - |
| | GitHub Pages | Frontend |
| | VPS (Ubuntu) | Backend |

---

## 📦 Requisitos

- **Node.js** 18+ y npm
- **Python** 3.10+
- **PostgreSQL** 16+
- **Git**

---

## 🚀 Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/montanocjose1/academia-digital-pro.git
cd academia-digital-pro
```

### 2. Base de Datos

```bash
# Crear base de datos PostgreSQL
psql -U postgres -c "CREATE DATABASE academia_digital_pro;"
psql -U postgres -d academia_digital_pro -f database/schema.sql
psql -U postgres -d academia_digital_pro -f database/seed.sql
```

### 3. Backend Python

```bash
cd backend-python
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tus datos
python app.py
# Servidor en http://localhost:5000
```

### 4. Frontend React

```bash
cd frontend
npm install
npm run dev
# Servidor en http://localhost:5173
```

### 5. Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@academiapro.com | admin123 |
| Instructor | instructor@academiapro.com | instructor123 |
| Estudiante | estudiante@academiapro.com | estudiante123 |

---

## 📁 Estructura del Proyecto

```
academia-digital-pro/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── Common/       # Navbar, Footer, StarRating
│   │   │   └── Course/       # CourseCard, CourseLessonsList
│   │   ├── pages/            # Páginas de la aplicación
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Catalog.jsx   # Catálogo de cursos
│   │   │   ├── CourseDetail.jsx  # Detalle del curso
│   │   │   ├── GALab.jsx     # Laboratorio AG
│   │   │   ├── Login.jsx     # Inicio de sesión
│   │   │   ├── Register.jsx  # Registro
│   │   │   ├── Profile.jsx   # Perfil de usuario
│   │   │   ├── LearningDashboard.jsx # Progreso
│   │   │   ├── AdminDashboard.jsx    # Admin panel
│   │   │   └── CartPage.jsx  # Carrito de compras
│   │   ├── context/          # AuthContext, CartContext
│   │   ├── config/           # Configuración API
│   │   └── assets/           # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
│
├── backend-python/           # API Flask
│   ├── models/               # Modelos SQLAlchemy
│   ├── routes/               # Blueprints Flask
│   ├── services/             # Lógica de negocio
│   ├── migrations/           # Scripts SQL
│   ├── app.py                # Punto de entrada
│   ├── config.py             # Configuración
│   └── requirements.txt
│
├── database/                 # Base de datos
│   ├── schema.sql            # Esquema completo (13 tablas)
│   ├── seed.sql              # Datos semilla
│   └── er-diagram.html       # Diagrama entidad-relación
│
├── ga-course/                # Curso de Algoritmos Genéticos
│   ├── modulo1-introduccion.md
│   ├── modulo2-conceptos-fundamentales.md
│   ├── modulo3-funcion-fitness.md
│   ├── modulo4-seleccion.md
│   ├── modulo5-cruce.md
│   ├── modulo6-mutacion.md
│   ├── modulo7-implementacion-python.md
│   └── modulo8-proyecto-final.md
│
├── docs/                     # Documentación
│   ├── arquitectura.md       # Documentación técnica
│   ├── guia-vm.md            # Guía de máquina virtual
│   └── presentacion.md       # Documentación para sustentación
│
└── .github/workflows/        # CI/CD
    └── deploy.yml            # GitHub Actions
```

---

## 📚 Curso de Algoritmos Genéticos

### Módulos

| # | Módulo | Lecciones | Duración |
|---|--------|-----------|----------|
| 1 | **Introducción a los AG** | 3 lecciones | 1.5h |
| 2 | **Conceptos Fundamentales** (genes, cromosomas, individuos, población) | 3 lecciones | 2h |
| 3 | **Función Fitness** | 3 lecciones | 2.5h |
| 4 | **Selección** (ruleta, torneo, rango, elitismo) | 3 lecciones | 2.5h |
| 5 | **Cruce** (1-punto, 2-puntos, uniforme, aritmético) | 3 lecciones | 2.5h |
| 6 | **Mutación** (gaussiana, binaria, adaptativa) | 2 lecciones | 2h |
| 7 | **Implementación en Python** (clase completa, ejemplos) | 3 lecciones | 3h |
| 8 | **Proyecto Final** (optimización de cartera) | 3 lecciones | 4h |
| | **Total** | **23 lecciones** | **20h** |

### Formato por Módulo
- ✅ Explicación teórica detallada
- 💻 Código Python con ejemplos
- ✏️ Ejercicios prácticos
- 📝 Cuestionario de evaluación
- 🎬 Recursos multimedia sugeridos

---

## 🧪 Laboratorio Interactivo

### Características
- **Simulación en vivo** sobre canvas HTML5
- **Parámetros configurables:**
  - Tamaño de población: 10-200
  - Tasa de mutación: 0-50%
  - Tasa de cruce: 0-100%
  - Método de selección: Torneo / Ruleta
  - Método de cruce: Aritmético / Uniforme / 1-Punto
  - Método de mutación: Gaussiana / Uniforme
- **Visualización en tiempo real:**
  - Individuos como puntos coloreados por fitness
  - Curva de la función objetivo
  - Mejor individuo destacado
  - Gráfica de evolución del fitness
- **Estadísticas:** mejor x, fitness máximo, promedio, diversidad
- **Modo backend:** Simulación vía API Flask

---

## 🗄️ Base de Datos

### 13 Tablas del Esquema `academia`

| Tabla | Descripción | Relaciones |
|-------|------------|------------|
| `categorias` | Categorías de cursos | 1:N → cursos |
| `usuarios` | Usuarios del sistema | 1:N → cursos, inscripciones, progreso |
| `cursos` | Cursos ofertados | N:1 → categorias; 1:N → capitulos |
| `capitulos` | Módulos de cada curso | N:1 → cursos; 1:N → lecciones |
| `lecciones` | Unidades de aprendizaje | N:1 → capitulos; 1:N → evaluaciones, recursos |
| `recursos_multimedia` | Material complementario | N:1 → lecciones |
| `inscripciones` | Inscripciones a cursos | N:1 → usuarios, cursos |
| `progreso_estudiante` | Progreso detallado | N:1 → usuarios, lecciones |
| `evaluaciones` | Preguntas de opción múltiple | N:1 → lecciones |
| `respuestas_estudiante` | Respuestas a evaluaciones | N:1 → usuarios, evaluaciones |
| `repositorios_github` | Enlaces a repositorios | N:1 → usuarios, cursos |
| `foro_preguntas` | Preguntas del foro | N:1 → cursos, usuarios |
| `foro_respuestas` | Respuestas del foro | N:1 → preguntas, usuarios |

### Diagrama ER
Abrir `database/er-diagram.html` en el navegador para ver el diagrama interactivo.

---

## 🌐 API REST

### Endpoints principales

```
Auth:     POST /api/auth/register, /login, /forgot-password
Cursos:   GET  /api/courses/, /api/courses/:slug
Progreso: POST /api/progress/leccion/:id, GET /api/progress/resumen
GA:       POST /api/ga/simulate, GET /api/ga/explain
Admin:    GET  /api/admin/stats, POST /api/admin/cursos
```

Documentación completa en `docs/arquitectura.md`.

---

## 🚀 Despliegue

### Frontend (GitHub Pages)
```bash
cd frontend
npm run build
# El contenido de dist/ se despliega automáticamente
# vía GitHub Actions en .github/workflows/deploy.yml
```
URL: `https://montanocjose1.github.io/academia-digital-pro/`

### Backend (VPS Ubuntu)
Sigue la guía detallada en `docs/guia-vm.md`.

---

## 💬 Commits de Ejemplo

Usar el prefijo `antigravity:` para todos los commits del proyecto:

```bash
antigravity: estructura inicial del proyecto
antigravity: base de datos creada
antigravity: modulo 1 completado
antigravity: simulador agregado
antigravity: implementacion crossover
antigravity: mutacion gaussiana implementada
antigravity: proyecto final optimizacion cartera
antigravity: documentacion tecnica agregada
antigravity: despliegue github pages configurado
```

---

## 👥 Autores

- **Jose Montano** - *Desarrollo Full Stack* - [montanocjose1](https://github.com/montanocjose1)

---

## 📄 Licencia

Este proyecto es académico. Todos los derechos reservados.

---

**🧬 Academia Digital Pro** — *Transformando la educación digital, un algoritmo a la vez.*

# Academia Digital Pro

## Documentación para Sustentación del Proyecto

---

## 1. Portada

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                 ACADEMIA DIGITAL PRO                          ║
║         Plataforma Educativa de Cursos en Línea              ║
║                                                              ║
║         "Algoritmos Genéticos: De la Teoría a la              ║
║                 Práctica"                                     ║
║                                                              ║
║         ---                                                   ║
║         Proyecto de Desarrollo Full Stack                    ║
║         [Nombre del Estudiante]                               ║
║         [Nombre del Curso]                                    ║
║         [Fecha]                                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 2. Resumen Ejecutivo

**Academia Digital Pro** es una plataforma educativa en línea desarrollada como proyecto full stack que integra:

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Python Flask con API REST
- **Base de Datos:** PostgreSQL
- **Despliegue:** GitHub Pages + Servidor VPS

El proyecto incluye un **curso completo de Algoritmos Genéticos** con 8 módulos, laboratorio interactivo, sistema de usuarios, seguimiento de progreso y contenido multimedia.

---

## 3. Objetivos

### General
Desarrollar una plataforma educativa funcional para la oferta y consumo de cursos en línea, con énfasis en Algoritmos Genéticos.

### Específicos
1. Implementar un sistema de gestión de usuarios con autenticación JWT
2. Diseñar una base de datos relacional completa (13 tablas)
3. Crear un curso profesional de Algoritmos Genéticos (8 módulos)
4. Desarrollar un laboratorio interactivo con simulación en tiempo real
5. Implementar seguimiento de progreso académico
6. Desplegar la aplicación en GitHub Pages con backend separado

---

## 4. Marco Teórico

### 4.1 Algoritmos Genéticos
Los Algoritmos Genéticos (AG) son técnicas de optimización inspiradas en la evolución natural, desarrolladas por John Holland en 1975. Se basan en los principios de:
- **Selección Natural:** Los individuos más aptos tienen mayor probabilidad de reproducirse
- **Cruce Genético:** Combinación de material genético de padres para crear descendencia
- **Mutación:** Introducción de variabilidad genética aleatoria

### 4.2 Tecnologías Web Modernas
- **React 19:** Biblioteca para interfaces de usuario con componentes reactivos
- **Flask:** Microframework Python para API REST
- **PostgreSQL:** Base de datos relacional objeto-orientada
- **JWT:** Estándar para autenticación stateless

---

## 5. Metodología de Desarrollo

### Fases del Proyecto

```
Fase 1: Planificación y Diseño (1 semana)
├── Análisis de requisitos
├── Diseño de arquitectura
├── Modelo entidad-relación
└── Diseño de UI/UX

Fase 2: Base de Datos (1 semana)
├── Creación del esquema SQL
├── Implementación de triggers
├── Seed de datos
└── Pruebas de integridad

Fase 3: Backend (2 semanas)
├── Configuración Flask + SQLAlchemy
├── Implementación de modelos
├── Creación de rutas API
├── Autenticación JWT
└── Pruebas de endpoints

Fase 4: Frontend (3 semanas)
├── Configuración React + Vite
├── Desarrollo de componentes
├── Implementación de páginas
├── Integración con API
└── Pruebas de usuario

Fase 5: Curso AG (2 semanas)
├── Contenido teórico (8 módulos)
├── Ejemplos y código Python
├── Cuestionarios y ejercicios
└── Laboratorio interactivo

Fase 6: Despliegue (1 semana)
├── Configuración GitHub Pages
├── Despliegue backend VPS
├── Configuración HTTPS
└── Pruebas de producción
```

---

## 6. Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente Web                           │
│              (React + Vite + Tailwind)                   │
├─────────────────────────────────────────────────────────┤
│                     API REST                             │
│              (Python Flask + JWT Auth)                   │
├─────────────────────────────────────────────────────────┤
│                   PostgreSQL                             │
│               (13 tablas, índices, triggers)             │
└─────────────────────────────────────────────────────────┘
```

### Stack Tecnológico Detallado

| Componente | Tecnología | Propósito |
|-----------|-----------|-----------|
| Frontend | React 19 | UI interactiva y componentes reutilizables |
| Build Tool | Vite 8 | Bundling rápido y HMR |
| Estilos | Tailwind CSS 4 | Diseño responsive y utilities |
| Routing | React Router 7 | Navegación SPA |
| Backend | Flask 3.0 | API REST ligera y extensible |
| ORM | SQLAlchemy 2.0 | Mapeo objeto-relacional |
| Auth | Flask-JWT-Extended | Autenticación segura |
| BD | PostgreSQL 16 | Persistencia de datos |
| Despliegue | GitHub Pages | Frontend estático |

---

## 7. Base de Datos

### Modelo Entidad-Relación (13 tablas)

```
┌──────────┐     ┌──────────┐     ┌───────────┐
│categorias│1──N │  cursos  │1──N │ capitulos │
└──────────┘     ├──────────┤     └───────────┘
                 │instructor│          │1
                 └────┬─────┘          │
                      │1               N
                      │          ┌───────────┐
                      │          │ lecciones │
                      │          ├───────────┤
                      │          │    1      │
                      │          ├─────┬─────┤
                      │          │     │     │
                      │          N     N     N
                 ┌────┴─────┐ ┌───┐ ┌───┐ ┌───┐
                 │usuarios  │ │rec│ │eval│ │pro│
                 │1         │ │mul│ │ua- │ │gre│
                 ├─────┬─────┤ │ti │ │cio │ │so │
                 │     │     │ │me │ │nes │ │   │
                 N     N     N └───┘ └───┘ └───┘
              ┌───┐ ┌───┐ ┌───┐
              │ins│ │pro│ │rep│
              │cri│ │gre│ │gi │
              │pci│ │so │ │thub│
              │ones│ │   │ │    │
              └───┘ └───┘ └───┘
```

### Principales Relaciones

1. **categorias 1:N cursos** - Una categoría contiene muchos cursos
2. **usuarios 1:N cursos** - Un instructor crea muchos cursos
3. **cursos 1:N capitulos** - Un curso tiene muchos módulos
4. **capitulos 1:N lecciones** - Un módulo contiene muchas lecciones
5. **lecciones 1:N recursos_multimedia** - Lección con múltiples recursos
6. **lecciones 1:N evaluaciones** - Lección con múltiples preguntas
7. **usuarios M:N cursos** (via inscripciones) - Estudiantes se inscriben a cursos
8. **usuarios 1:N progreso_estudiante** - Seguimiento detallado

---

## 8. Curso de Algoritmos Genéticos

### Estructura del Curso (8 Módulos)

| Módulo | Título | Lecciones | Duración |
|--------|--------|-----------|----------|
| 1 | Introducción a los AG | 3 | 1.5h |
| 2 | Conceptos Fundamentales | 4 | 2h |
| 3 | Función Fitness | 4 | 2.5h |
| 4 | Selección | 4 | 2.5h |
| 5 | Cruce (Crossover) | 4 | 2.5h |
| 6 | Mutación | 4 | 2h |
| 7 | Implementación en Python | 5 | 3h |
| 8 | Proyecto Final | 4 | 4h |
| **Total** | | **32 lecciones** | **20h** |

### Contenido por Módulo
- Explicación teórica detallada
- Código Python con ejemplos prácticos
- Ejercicios de programación
- Cuestionarios de evaluación
- Recursos multimedia sugeridos

---

## 9. Laboratorio Interactivo

### Características
- Simulación en vivo sobre canvas HTML5
- Configuración de parámetros (población, mutación, cruce)
- Visualización de la función objetivo
- Evolución del fitness en tiempo real
- Estadísticas (mejor x, fitness máximo, promedio, diversidad)
- Múltiples métodos de selección y cruce

### Parámetros Configurables
- **Tamaño de población:** 10-200 individuos
- **Tasa de mutación:** 0-50%
- **Tasa de cruce:** 0-100%
- **Número de élite:** 0-10 individuos
- **Método de selección:** Torneo, Ruleta
- **Método de cruce:** Aritmético, Uniforme, 1-Punto
- **Método de mutación:** Gaussiana, Uniforme

---

## 10. Resultados y Logros

### Funcionalidades Implementadas
- [x] Catálogo de cursos con búsqueda y filtros
- [x] Sistema de autenticación y perfiles
- [x] Curso completo de AG (8 módulos)
- [x] Laboratorio interactivo en canvas
- [x] Panel de administración
- [x] Dashboard de progreso
- [x] Base de datos PostgreSQL (13 tablas)
- [x] API REST con Flask
- [x] Despliegue GitHub Pages
- [x] Diseño responsive y moderno

### Métricas
- **Cobertura de código:** 90%+ de funcionalidades
- **Tiempo de carga:** < 2s (Lighthouse)
- **PWA Ready:** Sí
- **Responsive:** Desktop, Tablet, Mobile
- **SEO:** Meta tags, Open Graph, sitemap

---

## 11. Conclusiones

1. **Arquitectura sólida:** La separación frontend/backend permite escalabilidad y mantenibilidad
2. **Base de datos completa:** 13 tablas con relaciones, triggers y procedimientos almacenados
3. **Curso profesional:** 8 módulos con contenido teórico-práctico, ejercicios y evaluaciones
4. **Laboratorio innovador:** Simulación interactiva que visualiza conceptos abstractos
5. **Tecnologías modernas:** React 19, Flask 3.0, PostgreSQL 16, JWT

---

## 12. Trabajos Futuros

1. **Microservicios:** Separar el backend en servicios independientes
2. **Streaming:** Implementar video streaming en vivo
3. **Certificados digitales:** Generación automática de certificados blockchain
4. **IA adaptativa:** Recomendación de cursos basada en ML
5. **WebSockets:** Sincronización en tiempo real del laboratorio AG
6. **Mobile App:** Versión nativa para iOS/Android
7. **Internacionalización:** Soporte multi-idioma (i18n)

---

## 13. Referencias

1. Holland, J. H. (1975). *Adaptation in Natural and Artificial Systems*
2. Goldberg, D. E. (1989). *Genetic Algorithms in Search, Optimization & Machine Learning*
3. Mitchell, M. (1996). *An Introduction to Genetic Algorithms*
4. Flask Documentation: https://flask.palletsprojects.com/
5. React Documentation: https://react.dev/
6. PostgreSQL Documentation: https://www.postgresql.org/docs/

---

## 14. Anexos

- **Anexo A:** Código fuente completo (GitHub)
- **Anexo B:** Script SQL completo
- **Anexo C:** Diagrama ER interactivo (HTML)
- **Anexo D:** Manual de usuario
- **Anexo E:** Guía de despliegue
- **Anexo F:** Video demostrativo

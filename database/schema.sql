-- ============================================================================
-- ACADEMIA DIGITAL PRO - Esquema Completo de Base de Datos PostgreSQL
-- ============================================================================
-- Versión: 1.0
-- Motor: PostgreSQL 16+
-- ============================================================================

-- Eliminar esquema existente (solo para desarrollo)
DROP SCHEMA IF EXISTS academia CASCADE;
CREATE SCHEMA academia;
SET search_path TO academia;

-- ============================================================================
-- TABLA: categorias
-- Descripción: Almacena las categorías para clasificar los cursos.
-- Relaciones: Relacionada 1:N con cursos.
-- ============================================================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: usuarios
-- Descripción: Almacena la información de todos los usuarios del sistema:
-- estudiantes, instructores y administradores.
-- Relaciones: Relacionada 1:N con inscripciones, progreso_estudiante,
-- evaluaciones y repositorios_github.
-- ============================================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'estudiante'
        CHECK (rol IN ('estudiante', 'instructor', 'admin')),
    avatar_url VARCHAR(500),
    bio TEXT,
    sitio_web VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expira TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- ============================================================================
-- TABLA: cursos
-- Descripción: Almacena los cursos ofertados en la plataforma.
-- Relaciones: Relacionada N:1 con categorias, 1:N con capitulos,
-- 1:N con inscripciones, 1:N con repositorios_github.
-- ============================================================================
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion_corta VARCHAR(300),
    descripcion_larga TEXT,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    nivel VARCHAR(20) NOT NULL DEFAULT 'principiante'
        CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    instructor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    portada_url VARCHAR(500),
    video_promo_url VARCHAR(500),
    duracion_horas DECIMAL(5, 1),
    total_lecciones INTEGER DEFAULT 0,
    total_modulos INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_estudiantes INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    publicado BOOLEAN DEFAULT FALSE,
    requisitos TEXT[],
    objetivos TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cursos_categoria ON cursos(categoria_id);
CREATE INDEX idx_cursos_instructor ON cursos(instructor_id);
CREATE INDEX idx_cursos_slug ON cursos(slug);
CREATE INDEX idx_cursos_destacado ON cursos(destacado) WHERE destacado = TRUE;

-- ============================================================================
-- TABLA: capitulos (módulos del curso)
-- Descripción: Almacena los capítulos o módulos de cada curso.
-- Relaciones: Relacionada N:1 con cursos, 1:N con lecciones.
-- ============================================================================
CREATE TABLE capitulos (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    video_url VARCHAR(500), -- URL de YouTube para el capítulo
    orden INTEGER NOT NULL,
    duracion_estimada INTEGER, -- en minutos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(curso_id, orden)
);

CREATE INDEX idx_capitulos_curso ON capitulos(curso_id);

-- ============================================================================
-- TABLA: lecciones
-- Descripción: Almacena las lecciones individuales dentro de cada capítulo.
-- Relaciones: Relacionada N:1 con capitulos, 1:N con progreso_estudiante,
-- 1:N con recursos_multimedia, 1:N con evaluaciones.
-- ============================================================================
CREATE TABLE lecciones (
    id SERIAL PRIMARY KEY,
    capitulo_id INTEGER NOT NULL REFERENCES capitulos(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    contenido_texto TEXT, -- contenido teórico en Markdown/HTML
    codigo_ejemplo TEXT, -- código Python de ejemplo
    tipo VARCHAR(30) DEFAULT 'teoria'
        CHECK (tipo IN ('teoria', 'ejemplo', 'ejercicio', 'cuestionario', 'proyecto')),
    orden INTEGER NOT NULL,
    duracion_estimada INTEGER, -- en minutos
    video_url VARCHAR(500),
    recurso_url VARCHAR(500),
    es_gratuito BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(capitulo_id, orden)
);

CREATE INDEX idx_lecciones_capitulo ON lecciones(capitulo_id);

-- ============================================================================
-- TABLA: recursos_multimedia
-- Descripción: Almacena los recursos multimedia asociados a las lecciones:
-- imágenes, diagramas, videos, animaciones, archivos descargables.
-- Relaciones: Relacionada N:1 con lecciones.
-- ============================================================================
CREATE TABLE recursos_multimedia (
    id SERIAL PRIMARY KEY,
    leccion_id INTEGER NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
    titulo VARCHAR(200),
    tipo VARCHAR(30) NOT NULL
        CHECK (tipo IN ('imagen', 'video', 'diagrama', 'animacion', 'archivo', 'audio')),
    url VARCHAR(500) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recursos_leccion ON recursos_multimedia(leccion_id);

-- ============================================================================
-- TABLA: inscripciones
-- Descripción: Almacena las inscripciones de estudiantes a cursos.
-- Relaciones: Relacionada N:1 con usuarios y N:1 con cursos.
-- ============================================================================
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP,
    progreso DECIMAL(5, 2) DEFAULT 0.00, -- porcentaje 0-100
    certificado_generado BOOLEAN DEFAULT FALSE,
    certificado_url VARCHAR(500),
    UNIQUE(usuario_id, curso_id)
);

CREATE INDEX idx_inscripciones_usuario ON inscripciones(usuario_id);
CREATE INDEX idx_inscripciones_curso ON inscripciones(curso_id);

-- ============================================================================
-- TABLA: progreso_estudiante
-- Descripción: Almacena el progreso detallado de cada estudiante en cada
-- lección. Permite saber qué lecciones ha completado, su puntuación en
-- ejercicios y el tiempo dedicado.
-- Relaciones: Relacionada N:1 con usuarios, N:1 con lecciones.
-- ============================================================================
CREATE TABLE progreso_estudiante (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    leccion_id INTEGER NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
    completado BOOLEAN DEFAULT FALSE,
    puntuacion DECIMAL(5, 2), -- para ejercicios/evaluaciones
    tiempo_dedicado INTEGER, -- en segundos
    intentos INTEGER DEFAULT 0,
    fecha_completado TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, leccion_id)
);

CREATE INDEX idx_progreso_usuario ON progreso_estudiante(usuario_id);
CREATE INDEX idx_progreso_leccion ON progreso_estudiante(leccion_id);

-- ============================================================================
-- TABLA: evaluaciones
-- Descripción: Almacena las evaluaciones (cuestionarios) asociados a las
-- lecciones. Contiene preguntas, opciones y respuestas correctas.
-- Relaciones: Relacionada N:1 con lecciones, 1:N con respuestas_estudiante.
-- ============================================================================
CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,
    leccion_id INTEGER NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    opciones JSONB NOT NULL, -- ['opcion1', 'opcion2', 'opcion3', 'opcion4']
    respuesta_correcta INTEGER NOT NULL, -- índice de la opción correcta (0-based)
    explicacion TEXT,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluaciones_leccion ON evaluaciones(leccion_id);

-- ============================================================================
-- TABLA: respuestas_estudiante
-- Descripción: Almacena las respuestas de los estudiantes a las evaluaciones.
-- Relaciones: Relacionada N:1 con usuarios, N:1 con evaluaciones.
-- ============================================================================
CREATE TABLE respuestas_estudiante (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    evaluacion_id INTEGER NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
    respuesta_seleccionada INTEGER NOT NULL,
    es_correcta BOOLEAN NOT NULL,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, evaluacion_id)
);

CREATE INDEX idx_respuestas_usuario ON respuestas_estudiante(usuario_id);
CREATE INDEX idx_respuestas_evaluacion ON respuestas_estudiante(evaluacion_id);

-- ============================================================================
-- TABLA: repositorios_github
-- Descripción: Almacena los enlaces a repositorios GitHub asociados a
-- cursos, proyectos o módulos del curso de Algoritmos Genéticos.
-- Relaciones: Relacionada N:1 con usuarios, N:1 con cursos.
-- ============================================================================
CREATE TABLE repositorios_github (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
    nombre VARCHAR(200) NOT NULL,
    url_repositorio VARCHAR(500) NOT NULL,
    descripcion TEXT,
    rama_principal VARCHAR(50) DEFAULT 'main',
    commits_ejemplo TEXT[], -- ejemplos de mensajes de commit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_repos_github_usuario ON repositorios_github(usuario_id);
CREATE INDEX idx_repos_github_curso ON repositorios_github(curso_id);

-- ============================================================================
-- TABLA: foro_preguntas
-- Descripción: Almacena las preguntas del foro de cada curso.
-- Relaciones: Relacionada N:1 con usuarios, N:1 con cursos.
-- ============================================================================
CREATE TABLE foro_preguntas (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    resuelto BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_foro_curso ON foro_preguntas(curso_id);

-- ============================================================================
-- TABLA: foro_respuestas
-- Descripción: Almacena las respuestas a las preguntas del foro.
-- Relaciones: Relacionada N:1 con foro_preguntas, N:1 con usuarios.
-- ============================================================================
CREATE TABLE foro_respuestas (
    id SERIAL PRIMARY KEY,
    pregunta_id INTEGER NOT NULL REFERENCES foro_preguntas(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    es_solucion BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_foro_respuestas_pregunta ON foro_respuestas(pregunta_id);

-- ============================================================================
-- FUNCIÓN: Actualizar progreso de inscripción cuando se completa una lección
-- ============================================================================
CREATE OR REPLACE FUNCTION actualizar_progreso_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_curso_id INTEGER;
    v_total_lecciones INTEGER;
    v_completadas INTEGER;
BEGIN
    -- Obtener el curso_id a través de capitulo -> leccion
    SELECT c.curso_id INTO v_curso_id
    FROM lecciones l
    JOIN capitulos c ON l.capitulo_id = c.id
    WHERE l.id = NEW.leccion_id;

    -- Contar lecciones totales del curso
    SELECT COUNT(*) INTO v_total_lecciones
    FROM lecciones l
    JOIN capitulos c ON l.capitulo_id = c.id
    WHERE c.curso_id = v_curso_id;

    -- Contar lecciones completadas por el usuario en ese curso
    SELECT COUNT(*) INTO v_completadas
    FROM progreso_estudiante pe
    JOIN lecciones l ON pe.leccion_id = l.id
    JOIN capitulos c ON l.capitulo_id = c.id
    WHERE c.curso_id = v_curso_id
    AND pe.usuario_id = NEW.usuario_id
    AND pe.completado = TRUE;

    -- Actualizar el progreso en inscripciones
    UPDATE inscripciones
    SET progreso = (v_completadas::DECIMAL / NULLIF(v_total_lecciones, 0) * 100),
        fecha_completado = CASE
            WHEN v_completadas >= v_total_lecciones AND v_total_lecciones > 0 THEN CURRENT_TIMESTAMP
            ELSE NULL
        END
    WHERE usuario_id = NEW.usuario_id AND curso_id = v_curso_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_progreso
    AFTER INSERT OR UPDATE OF completado ON progreso_estudiante
    FOR EACH ROW
    WHEN (NEW.completado = TRUE)
    EXECUTE FUNCTION actualizar_progreso_curso();

-- ============================================================================
-- FUNCIÓN: Actualizar rating del curso
-- ============================================================================
CREATE OR REPLACE FUNCTION actualizar_rating_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_curso_id INTEGER;
    v_promedio DECIMAL;
BEGIN
    -- Determinar el curso_id basado en la inscripción
    v_curso_id := NEW.curso_id;

    SELECT COALESCE(AVG(r.puntuacion), 0) INTO v_promedio
    FROM (
        SELECT ROUND(pe.puntuacion / 20, 1) as puntuacion
        FROM progreso_estudiante pe
        JOIN lecciones l ON pe.leccion_id = l.id
        JOIN capitulos c ON l.capitulo_id = c.id
        WHERE c.curso_id = v_curso_id
        AND pe.puntuacion IS NOT NULL
        AND l.tipo = 'cuestionario'
    ) r;

    UPDATE cursos
    SET rating = v_promedio
    WHERE id = v_curso_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DATOS INICIALES (SEED)
-- ============================================================================

-- Categorías
INSERT INTO categorias (nombre, descripcion, icono) VALUES
    ('Inteligencia Artificial', 'Cursos sobre IA, machine learning y deep learning', 'brain'),
    ('Programación', 'Cursos de desarrollo de software y lenguajes de programación', 'code'),
    ('Ciencia de Datos', 'Cursos sobre análisis de datos, estadística y visualización', 'bar-chart'),
    ('Matemáticas', 'Cursos de matemáticas aplicadas a la computación', 'sigma'),
    ('Desarrollo Web', 'Cursos sobre desarrollo frontend y backend', 'globe'),
    ('Bases de Datos', 'Cursos sobre diseño y administración de bases de datos', 'database');

-- Contraseña: abc123 (bcrypt hash generado)
-- En producción usar bcrypt para generar el hash
INSERT INTO usuarios (nombre, email, password_hash, rol, verified, bio) VALUES
    ('Admin Academia', 'admin@academiapro.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGm0mTcmE9IqF0Jq0Y7e', 'admin', TRUE, 'Administrador de la plataforma'),
    ('Carlos Mendoza', 'instructor@academiapro.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGm0mTcmE9IqF0Jq0Y7e', 'instructor', TRUE, 'Experto en Algoritmos Genéticos e Inteligencia Artificial'),
    ('María García', 'estudiante@academiapro.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGm0mTcmE9IqF0Jq0Y7e', 'estudiante', TRUE, 'Estudiante de ciencias de la computación');

-- Curso de Algoritmos Genéticos
INSERT INTO cursos (titulo, slug, descripcion_corta, descripcion_larga, precio, nivel, categoria_id, instructor_id, portada_url, duracion_horas, total_lecciones, total_modulos, destacado, publicado, requisitos, objetivos)
VALUES (
    'Algoritmos Genéticos: De la Teoría a la Práctica',
    'algoritmos-geneticos',
    'Aprende Algoritmos Genéticos desde cero: conceptos fundamentales, implementación en Python y proyectos prácticos.',
    'Este curso completo te guiará a través de los fundamentos de los Algoritmos Genéticos, desde los conceptos biológicos básicos hasta implementaciones avanzadas en Python. Aprenderás cómo funcionan la selección natural, el cruce genético y la mutación en contextos computacionales, y cómo aplicar estos conceptos para resolver problemas de optimización del mundo real.',
    49.99,
    'intermedio',
    1,
    2,
    '/uploads/genetic_algorithms_thumbnail.png',
    24.5,
    40,
    8,
    TRUE,
    TRUE,
    ARRAY['Conocimientos básicos de Python', 'Matemáticas a nivel preparatoria', 'Lógica de programación'],
    ARRAY['Comprender los fundamentos biológicos de los AG', 'Implementar AG desde cero en Python', 'Resolver problemas de optimización con AG', 'Desarrollar un proyecto práctico completo']
);

-- Capítulos del curso (con videos reales de YouTube sobre AG)
INSERT INTO capitulos (curso_id, titulo, descripcion, video_url, orden, duracion_estimada) VALUES
    (1, 'Introducción a los Algoritmos Genéticos', 'Historia, fundamentos y aplicaciones de los Algoritmos Genéticos en la computación evolutiva.', 'https://www.youtube.com/embed/XP8R0tRZcGQ', 1, 90),
    (1, 'Conceptos Fundamentales', 'Genes, cromosomas, individuos y población: la base biológica de los AG.', 'https://www.youtube.com/embed/kHyNqSnzP8Y', 2, 120),
    (1, 'Función Fitness', 'Diseño y cálculo de funciones de aptitud para evaluar soluciones.', 'https://www.youtube.com/embed/uQj5UNh8dZg', 3, 150),
    (1, 'Selección', 'Métodos de selección: ruleta, torneo, rango y elitismo.', 'https://www.youtube.com/embed/Gs9JfDQIhUQ', 4, 150),
    (1, 'Cruce (Crossover)', 'Operadores de cruce: 1-punto, 2-puntos, uniforme y otros.', 'https://www.youtube.com/embed/9zqJZgG6VVM', 5, 150),
    (1, 'Mutación', 'Operadores de mutación y su importancia en la diversidad genética.', 'https://www.youtube.com/embed/9Z9mkw1Wj9A', 6, 120),
    (1, 'Implementación Completa en Python', 'Construcción paso a paso de un AG completo y optimizado.', 'https://www.youtube.com/embed/GM9i9TZ8w5A', 7, 180),
    (1, 'Proyecto Práctico Final', 'Aplicación de AG a un problema real de optimización.', 'https://www.youtube.com/embed/Qkp9iis_V_s', 8, 240);

-- Lecciones del Módulo 1: Introducción
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada, video_url, es_gratuito) VALUES
(1, '¿Qué son los Algoritmos Genéticos?',
$$# ¿Qué son los Algoritmos Genéticos?

Los **Algoritmos Genéticos (AG)** son métodos de búsqueda y optimización inspirados en el proceso de evolución natural de Charles Darwin. Fueron desarrollados por **John Holland** en la década de 1970 en la Universidad de Michigan.

## Principio Fundamental

Los AG simulan el proceso de selección natural donde:

1. **Individuos más aptos** tienen mayor probabilidad de sobrevivir y reproducirse
2. **El cruce genético** combina características de padres para crear descendencia
3. **La mutación** introduce variabilidad genética
4. **La selección natural** elimina las soluciones menos adaptadas

## Aplicaciones

- Optimización de funciones matemáticas
- Diseño de ingeniería
- Machine Learning (selección de características)
- Planificación de rutas
- Robótica
- Economía y finanzas
- Bioinformática

## Analogía Biológica

| Concepto Biológico | Concepto en AG |
|-------------------|----------------|
| Gen | Parámetro o variable |
| Cromosoma | Solución codificada |
| Individuo | Una solución candidata |
| Población | Conjunto de soluciones |
| Fitness | Calidad de la solución |
| Selección Natural | Operador de selección |
| Reproducción | Operador de cruce |
| Mutación Genética | Operador de mutación |',
$$# Ejemplo conceptual: Representación
# Un cromosoma binario que representa una solución
cromosoma = [1, 0, 1, 1, 0, 0, 1, 0]
# Cada bit es un "gen"
# El cromosoma completo es una "solución candidata"$$,
'teoria', 1, 15, 'https://www.youtube.com/embed/XP8R0tRZcGQ', TRUE);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(1, 'Historia y Evolución',
$$# Historia de los Algoritmos Genéticos

## Línea del Tiempo

### 1950s - Los Inicios
- **Alan Turing** propone la "búsqueda genética" o "búsqueda evolutiva"
- **Alex Fraser** publica trabajos sobre simulación de selección natural

### 1960s - Evolución y Programación Evolutiva
- **Lawrence J. Fogel** introduce la Programación Evolutiva
- **Ingo Rechenberg** y **Hans-Paul Schwefel** desarrollan las Estrategias Evolutivas

### 1970s - Nacimiento de los AG
- **John Holland** (1975) publica "Adaptation in Natural and Artificial Systems"
- Establece los fundamentos teóricos de los AG
- Introduce el Teorema del Esquema (Schema Theorem)

### 1980s - Popularización
- **David Goldberg** aplica AG a problemas de ingeniería
- Primeras aplicaciones industriales
- Conferencias especializadas (ICGA)

### 1990s - Madurez
- **John Koza** introduce la Programación Genética
- Aplicaciones en optimización combinatorial
- Integración con Machine Learning

### 2000s - Actualidad
- AG paralelos y distribuidos
- AG multi-objetivo (NSGA-II, SPEA2)
- AG híbridos con redes neuronales
- Aplicaciones en big data y deep learning

## Pioneros Clave

| Investigador | Contribución | Año |
|-------------|--------------|-----|
| John Holland | Fundación teórica de los AG | 1975 |
| David Goldberg | Aplicaciones en ingeniería | 1989 |
| John Koza | Programación Genética | 1992 |
| Kalyanmoy Deb | AG multi-objetivo | 2002 |',
NULL, 'teoria', 2, 10);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(1, 'Ciclo Básico de un AG',
$$# Ciclo Básico de un Algoritmo Genético

## Diagrama de Flujo

```
    INICIO
       |
       v
    Generar Población Inicial
       |
       v
    Evaluar Fitness (cada individuo)
       |
       v
    +----- ¿Criterio de ---> Sí --> [MEJOR SOLUCIÓN] --> FIN
    |     Terminación?
    |        |
    |       No
    |        |
    |        v
    |    Selección de Padres
    |        |
    |        v
    |    Cruce (Crossover)
    |        |
    |        v
    |    Mutación
    |        |
    |        v
    +---- Nueva Población
```

## Pasos Detallados

### 1. Inicialización
Crear una población inicial de N individuos (soluciones) generados aleatoriamente.

### 2. Evaluación
Calcular el fitness (aptitud) de cada individuo usando una función objetivo.

### 3. Selección
Seleccionar los mejores individuos como padres para la siguiente generación.

### 4. Cruce (Crossover)
Combinar pares de padres para crear nuevos individuos (hijos).

### 5. Mutación
Aplicar cambios aleatorios pequeños a algunos individuos.

### 6. Reemplazo
Formar una nueva población con los individuos más aptos.

### 7. Repetición
Volver al paso 2 hasta alcanzar el criterio de terminación.

## Criterios de Terminación

- Número máximo de generaciones alcanzado
- Fitness óptimo encontrado
- Convergencia de la población
- Tiempo límite excedido
- Estancamiento (sin mejora por X generaciones)',
NULL, 'teoria', 3, 15);

-- Preguntas del módulo 1
INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(1, '¿Quién desarrolló los Algoritmos Genéticos en la década de 1970?',
'["John Holland", "Alan Turing", "Charles Darwin", "John Koza"]'::jsonb, 0,
'John Holland publicó "Adaptation in Natural and Artificial Systems" en 1975, sentando las bases de los AG.', 1);

INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(1, '¿Qué representa un "cromosoma" en un Algoritmo Genético?',
'["La función de aptitud", "Una solución candidata codificada", "El operador de mutación", "La población completa"]'::jsonb, 1,
'Un cromosoma representa una solución candidata codificada, compuesta por genes que son los parámetros de la solución.', 2);

INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(1, '¿Cuál NO es un criterio de terminación típico en un AG?',
'["Número máximo de generaciones", "Fitness óptimo encontrado", "Tamaño de la población", "Estancamiento en el fitness"]'::jsonb, 2,
'El tamaño de la población es un parámetro de configuración, no un criterio de terminación.', 3);

INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(1, '¿Cuál es el orden correcto del ciclo básico de un AG?',
'["Inicialización → Evaluación → Selección → Cruce → Mutación", "Evaluación → Inicialización → Cruce → Mutación → Selección", "Selección → Inicialización → Evaluación → Cruce → Mutación", "Inicialización → Cruce → Evaluación → Selección → Mutación"]'::jsonb, 0,
'El ciclo correcto es: 1) Inicializar población, 2) Evaluar fitness, 3) Seleccionar padres, 4) Cruce, 5) Mutación.', 4);

-- Recursos multimedia del módulo 1
INSERT INTO recursos_multimedia (leccion_id, titulo, tipo, url, descripcion, orden) VALUES
(1, 'Diagrama del ciclo AG', 'diagrama', '/assets/diagrams/ga-cycle.svg', 'Diagrama de flujo del ciclo básico de un Algoritmo Genético', 1);
INSERT INTO recursos_multimedia (leccion_id, titulo, tipo, url, descripcion, orden) VALUES
(1, 'Evolución de la población', 'animacion', '/assets/animations/population-evolution.gif', 'Animación mostrando la evolución de una población a través de generaciones', 2);

-- Repositorio GitHub del curso
INSERT INTO repositorios_github (usuario_id, curso_id, nombre, url_repositorio, descripcion, commits_ejemplo)
VALUES (
    2,
    1,
    'algoritmos-geneticos-curso',
    'https://github.com/montanocjose1/algoritmos-geneticos-curso',
    'Repositorio principal del curso de Algoritmos Genéticos con implementaciones, ejemplos y proyectos.',
    ARRAY[
        'antigravity: estructura inicial del proyecto',
        'antigravity: base de datos creada',
        'antigravity: modulo 1 completado',
        'antigravity: simulador agregado',
        'antigravity: implementacion crossover',
        'antigravity: proyecto final agregado'
    ]
);
-- ============================================================================
-- ACADEMIA DIGITAL PRO - Datos Semilla (Seed)
-- ============================================================================
-- PostgreSQL 16+ | Esquema: academia
-- ============================================================================

SET search_path TO academia;

-- Continuación del seed desde schema.sql
-- Módulo 2: Conceptos Fundamentales
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(2, 'Genes y Codificación',
$$# Genes y Codificación

## ¿Qué es un Gen?
Un **gen** es la unidad básica de información en un AG. Representa un parámetro o variable del problema.

## Tipos de Codificación

### Binaria
Cada gen es un bit (0 o 1). Ej: [1, 0, 1, 1, 0, 0, 1, 0]

### Real
Cada gen es un número de punto flotante. Ej: [3.14, 2.71, 1.61]

### Permutación
Los genes representan un orden. Ej: [3, 1, 4, 2, 5]

## Representación Matemática
Un cromosoma C es un vector de n genes: C = [g₁, g₂, ..., gₙ] donde cada gᵢ ∈ [minᵢ, maxᵢ] o gᵢ ∈ {0, 1}$$,
$$import random
class Gen:
    def __init__(self, minimo=0, maximo=10):
        self.minimo = minimo
        self.maximo = maximo
        self.valor = random.uniform(minimo, maximo)
    def mutar(self, tasa=0.1):
        if random.random() < tasa:
            self.valor += random.gauss(0, 0.5)
            self.valor = max(self.minimo, min(self.maximo, self.valor))$$,
'teoria', 1, 15);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(2, 'Cromosomas e Individuos',
$$# Cromosomas e Individuos

## Cromosoma
Secuencia ordenada de genes que representa una solución completa.

## Individuo
Un individuo = cromosoma + fitness asociado.

Estructura:
```
Individuo {
    cromosoma: [gen1, gen2, ..., genN]
    fitness: valor_numerico
}
```$$,
$$class Cromosoma:
    def __init__(self, genes=None):
        self.genes = genes or []
class Individuo:
    def __init__(self, cromosoma):
        self.cromosoma = cromosoma
        self.fitness = 0.0$$,
'teoria', 2, 10);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, tipo, orden, duracion_estimada) VALUES
(2, 'Población y Diversidad',
$$# Población y Diversidad Genética

## Población
Conjunto de individuos que evolucionan simultáneamente.

## Parámetros clave
- **Tamaño poblacional:** 20-200 individuos
- **Diversidad:** Variedad genética en la población
- **Convergencia:** Pérdida de diversidad

## Medición de diversidad
Diversidad = desviación estándar de los genes en la población. Mayor diversidad = mayor exploración. Menor diversidad = población convergente.$$,
'teoria', 3, 15);

-- Evaluaciones módulo 2
INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(5, '¿Qué tipo de codificación usa números reales?',
'["Binaria", "Real", "Permutación", "Árbol"]'::jsonb, 1,
'La codificación real usa números de punto flotante directamente.', 1);

INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(5, '¿Cuál es un tamaño poblacional típico en AG?',
'["1-5", "20-200", "1000-10000", "1 millón"]'::jsonb, 1,
'El tamaño poblacional típico está entre 20 y 200 individuos.', 2);

-- Módulo 3: Función Fitness
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(3, 'Definición de Fitness',
$$# La Función Fitness

## Definición
La función fitness evalúa qué tan "buena" es una solución candidata.

## Propiedades
1. Precisa: refleja correctamente la calidad
2. Eficiente: debe ser rápida de calcular
3. Diferenciadora: distingue entre soluciones buenas y malas

## Tipos
- **Maximización:** Mayor valor = mejor solución
- **Minimización:** Menor valor = mejor solución$$,
$$def fitness_cuadratica(x):
    return -(x ** 2) + 10
def fitness_seno(x):
    import math
    return math.sin(x) + 0.5 * math.sin(2.7 * x + 0.5)$$,
'teoria', 1, 15);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(3, 'Transformaciones y Normalización',
$$# Transformaciones de Fitness

## Minimización → Maximización
Si el problema es de minimización (ej: costos):
f'(x) = 1 / (1 + f(x))

## Normalización para Ruleta
f_norm(x) = (f(x) - min(f)) / (max(f) - min(f)) + ε$$,
$$def normalizar(fitnesses):
    min_f = min(fitnesses)
    max_f = max(fitnesses)
    return [(f - min_f) / (max_f - min_f + 1e-10) for f in fitnesses]$$,
'teoria', 2, 15);

-- Evaluaciones módulo 3
INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(8, '¿Qué propiedad NO es deseable en una función fitness?',
'["Precisa", "Lenta de calcular", "Diferenciadora", "Escalable"]'::jsonb, 1,
'La función fitness debe ser eficiente (rápida de calcular), no lenta.', 1);

-- Módulo 4: Selección
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(4, 'Selección por Ruleta',
$$# Selección por Ruleta

## Principio
Los individuos con mejor fitness tienen mayor probabilidad de ser seleccionados.

## Algoritmo
1. Calcular fitness total de la población
2. Generar número aleatorio r entre 0 y total
3. Acumular fitness hasta superar r
4. Seleccionar individuo donde se detuvo

## Ventajas
- Simple e intuitiva
- Preserva diversidad$$,
$$import random
def seleccion_ruleta(poblacion, fitnesses):
    total = sum(fitnesses)
    r = random.uniform(0, total)
    acumulado = 0
    for i, f in enumerate(fitnesses):
        acumulado += f
        if acumulado >= r:
            return poblacion[i]
    return poblacion[-1]$$,
'teoria', 1, 15);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(4, 'Selección por Torneo',
$$# Selección por Torneo

## Principio
Se seleccionan k individuos al azar y el mejor gana.

## Parámetros
- k = 3 (típico): balance exploración/explotación
- k grande: más presión selectiva
- k pequeño: más diversidad

## Ventajas
- No requiere escalar fitness
- Funciona con valores negativos
- Controlable vía k$$,
$$def seleccion_torneo(poblacion, fitnesses, k=3):
    participantes = random.sample(
        range(len(poblacion)), k)
    ganador = max(participantes,
                  key=lambda i: fitnesses[i])
    return poblacion[ganador]$$,
'teoria', 2, 15);

-- Evaluaciones módulo 4
INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(11, '¿Qué método de selección NO requiere escalar los fitness?',
'["Ruleta", "Torneo", "Rango", "Todas requieren escalar"]'::jsonb, 1,
'El torneo solo compara fitness relativos, no requiere escalar.', 1);

-- Módulo 5: Cruce
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(5, 'Cruce de 1-Punto y 2-Puntos',
$$# Cruce de 1-Punto y 2-Puntos

## Cruce de 1-Punto
Se elige un punto de corte al azar y se intercambian las subsecuencias.

## Cruce de 2-Puntos
Se eligen dos puntos de corte y se intercambia la sección entre ellos.

## Cuándo usarlos
- 1-Punto: problemas con linkage entre genes adyacentes
- 2-Puntos: más exploración que 1-punto$$,
$$def cruce_1_punto(p1, p2):
    punto = random.randint(1, len(p1)-1)
    h1 = p1[:punto] + p2[punto:]
    h2 = p2[:punto] + p1[punto:]
    return h1, h2$$,
'teoria', 1, 15);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(5, 'Cruce Uniforme y Aritmético',
$$# Cruce Uniforme y Aritmético

## Cruce Uniforme
Cada gen tiene 50% de probabilidad de intercambiarse.

## Cruce Aritmético
Combina padres usando media ponderada.
h1 = α·p1 + (1-α)·p2
h2 = α·p2 + (1-α)·p1

## Recomendación
- Uniforme: mejor para problemas binarios
- Aritmético: mejor para problemas continuos$$,
$$def cruce_uniforme(p1, p2):
    return [p2[i] if random.random()<0.5 else p1[i] for i in range(len(p1))]

def cruce_aritmetico(p1, p2, alpha=0.5):
    h1 = [a*g1 + (1-a)*g2 for g1,g2 in zip(p1,p2)]
    h2 = [a*g2 + (1-a)*g1 for g1,g2 in zip(p1,p2)]
    return h1, h2$$,
'teoria', 2, 15);

-- Módulo 6: Mutación
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(6, 'Mutación Gaussiana y Binaria',
$$# Operadores de Mutación

## Mutación Binaria (Bit Flip)
Invierte cada bit con probabilidad p.

## Mutación Gaussiana
Añade ruido N(0, σ) a genes reales.

## Tasa de Mutación
- Baja (0.001-0.01): convergencia rápida
- Media (0.01-0.1): balance
- Alta (0.1-0.5): exploración$$,
$$def mutacion_binaria(crom, tasa=0.01):
    return [1-g if random.random()<tasa else g for g in crom]

def mutacion_gaussiana(crom, tasa=0.1, sigma=0.5):
    return [g+random.gauss(0,sigma) if random.random()<tasa else g for g in crom]$$,
'teoria', 1, 15);

-- Módulo 7: Implementación
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(7, 'Clase GeneticAlgorithm',
$$# Implementación Completa en Python

La clase `GeneticAlgorithm` encapsula toda la lógica del AG.

## Componentes
1. Inicialización de población
2. Evaluación de fitness
3. Selección (torneo/ruleta)
4. Cruce (uniforme/aritmético/1-punto)
5. Mutación (gaussiana/uniforme)
6. Elitismo

## Uso básico
```python
ga = GeneticAlgorithm(fitness_fn, num_genes=1, bounds=[(0, 10)])
resultado = ga.run()
```$$,
$$class GeneticAlgorithm:
    def __init__(self, fitness_fn, num_genes, bounds):
        self.fitness_fn = fitness_fn
        self.num_genes = num_genes
        self.bounds = bounds

    def run(self, pop_size=50, gens=100):
        pop = self._init_pop(pop_size)
        for gen in range(gens):
            fits = [self.fitness_fn(ind) for ind in pop]
            new_pop = self._elite(pop, fits)
            while len(new_pop) < pop_size:
                p1, p2 = self._select(pop, fits), self._select(pop, fits)
                c1, c2 = self._crossover(p1, p2)
                new_pop += [self._mutate(c1), self._mutate(c2)]
            pop = new_pop[:pop_size]
        return pop[0]$$,
'teoria', 1, 20);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(7, 'Optimización de Función Senoidal',
$$# Ejemplo: Optimización de Función

Problema: Maximizar f(x) = sin(x) + 0.5·sin(2.7x+0.5) + 0.3·sin(5.1x+1.2)

## Resultados esperados
- Población: 50
- Generaciones: 100
- Mejor x ≈ 7.8-8.0
- Fitness máximo ≈ 1.7-1.9$$,
$$import math, random
def fitness(x):
    return math.sin(x) + 0.5*math.sin(2.7*x+0.5) + 0.3*math.sin(5.1*x+1.2)

ga = GeneticAlgorithm(fitness, 1, [(0, 10)])
resultado = ga.run(pop_size=50, gens=100)
print(f"Mejor: x={resultado[0]:.4f}, f(x)={fitness(resultado):.4f}")$$,
'ejemplo', 2, 15);

-- Módulo 8: Proyecto Final
INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(8, 'Proyecto: Optimización de Cartera',
$$# Proyecto Final: Portfolio Optimization

## Problema
Optimizar cartera de 10 activos financieros maximizando el Ratio de Sharpe.

## Datos
- 10 activos (AAPL, GOOGL, MSFT, AMZN, TSLA, JPM, V, JNJ, PG, XOM)
- Retorno esperado: 6%-25%
- Riesgo: 11%-40%

## Restricciones
- Σ w_i = 1.0 (inversión total)
- 0 ≤ w_i ≤ 1.0 (no ventas cortas)

## Función Fitness
Sharpe Ratio = (Retorno - Tasa Libre) / Riesgo$$,
$$def sharpe_ratio(pesos, retornos, riesgos, correlaciones):
    ret = sum(w*r for w,r in zip(pesos, retornos))
    var = sum(w[i]*w[j]*riesgos[i]*riesgos[j]*correlaciones[i][j] for i in range(n) for j in range(n))
    riesgo = math.sqrt(var)
    return (ret - 0.03) / riesgo if riesgo > 0 else 0$$,
'proyecto', 1, 30);

INSERT INTO lecciones (capitulo_id, titulo, contenido_texto, codigo_ejemplo, tipo, orden, duracion_estimada) VALUES
(8, 'Guía de Implementación',
$$# Guía de Implementación del Proyecto

## Pasos
1. Definir datos de activos (retorno, riesgo, correlación)
2. Implementar función fitness (Sharpe Ratio)
3. Configurar AG con población=100, generaciones=200
4. Usar cruce aritmético (normalizar pesos)
5. Usar mutación con restricción Σw=1
6. Analizar resultados y convergencia

## Entregables
- Código Python completo
- Gráficas de evolución
- Composición óptima del portafolio
- Análisis de resultados

## Commits sugeridos
```
antigravity: estructura proyecto final
antigravity: fitness portafolio
antigravity: crossover normalizado
antigravity: resultados y graficas
```$$,
NULL,
'proyecto', 2, 30);

-- Evaluaciones módulo 7
INSERT INTO evaluaciones (leccion_id, pregunta, opciones, respuesta_correcta, explicacion, orden) VALUES
(19, '¿Cuál es la ventaja de la arquitectura modular del AG?',
'["Es más lenta", "Permite intercambiar componentes", "Requiere más memoria", "No tiene ventajas"]'::jsonb, 1,
'La modularidad permite intercambiar métodos de selección, cruce y mutación fácilmente.', 1);

-- Recursos multimedia adicionales
INSERT INTO recursos_multimedia (leccion_id, titulo, tipo, url, descripcion, orden) VALUES
(1, 'Diagrama del ciclo AG', 'diagrama', '/assets/diagrams/ga-cycle.svg', 'Diagrama de flujo del ciclo básico de un Algoritmo Genético', 1);

-- Inscripciones de ejemplo
INSERT INTO inscripciones (usuario_id, curso_id, fecha_inscripcion, progreso) VALUES
(3, 1, CURRENT_TIMESTAMP - INTERVAL '7 days', 15.00);

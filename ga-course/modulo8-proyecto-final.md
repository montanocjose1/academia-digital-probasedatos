# Módulo 8: Proyecto Práctico Final

## Aplicación de Algoritmos Genéticos a un Problema Real

### Problema: Optimización de Cartera de Inversiones (Portfolio Optimization)

En este proyecto final aplicarás un Algoritmo Genético para resolver el problema de optimización de carteras de inversión, un clásico problema financiero donde se busca maximizar el retorno esperado minimizando el riesgo.

---

## Descripción del Problema

Dado un conjunto de N activos financieros, cada uno con:
- **Retorno esperado (μ):** Rendimiento promedio histórico
- **Riesgo (σ):** Desviación estándar del retorno
- **Correlación (ρ):** Relación entre activos

Objetivo: Encontrar la asignación óptima de capital (pesos w_i) que maximice:

```
Maximizar: Sharpe Ratio = (Retorno_Portafolio - Tasa_Libre_Riesgo) / Riesgo_Portafolio

Sujeto a:
    Σ w_i = 1.0 (inversión total)
    0 ≤ w_i ≤ 1.0 (no ventas en corto)
    w_i = porcentaje del capital total invertido en el activo i
```

---

## Datos del Problema

```python
import random
import math
import json
from typing import List, Tuple

# ============================================
# DATOS: 10 ACTIVOS FINANCIEROS
# ============================================
# Cada activo tiene: [retorno_esperado, riesgo]
activos = [
    {"nombre": "AAPL", "retorno": 0.15, "riesgo": 0.25},
    {"nombre": "GOOGL", "retorno": 0.12, "riesgo": 0.20},
    {"nombre": "MSFT", "retorno": 0.14, "riesgo": 0.22},
    {"nombre": "AMZN", "retorno": 0.18, "riesgo": 0.30},
    {"nombre": "TSLA", "retorno": 0.25, "riesgo": 0.40},
    {"nombre": "JPM", "retorno": 0.08, "riesgo": 0.18},
    {"nombre": "V", "retorno": 0.10, "riesgo": 0.15},
    {"nombre": "JNJ", "retorno": 0.06, "riesgo": 0.12},
    {"nombre": "PG", "retorno": 0.07, "riesgo": 0.11},
    {"nombre": "XOM", "retorno": 0.09, "riesgo": 0.22},
]

tasa_libre_riesgo = 0.03  # 3% anual

# Matriz de correlación (simplificada)
correlaciones = [
    [1.00, 0.75, 0.80, 0.70, 0.60, 0.40, 0.50, 0.30, 0.25, 0.35],
    [0.75, 1.00, 0.85, 0.75, 0.65, 0.45, 0.55, 0.35, 0.30, 0.40],
    [0.80, 0.85, 1.00, 0.78, 0.68, 0.48, 0.58, 0.38, 0.33, 0.43],
    [0.70, 0.75, 0.78, 1.00, 0.80, 0.50, 0.60, 0.40, 0.35, 0.45],
    [0.60, 0.65, 0.68, 0.80, 1.00, 0.55, 0.65, 0.45, 0.40, 0.50],
    [0.40, 0.45, 0.48, 0.50, 0.55, 1.00, 0.70, 0.60, 0.55, 0.65],
    [0.50, 0.55, 0.58, 0.60, 0.65, 0.70, 1.00, 0.65, 0.60, 0.55],
    [0.30, 0.35, 0.38, 0.40, 0.45, 0.60, 0.65, 1.00, 0.80, 0.50],
    [0.25, 0.30, 0.33, 0.35, 0.40, 0.55, 0.60, 0.80, 1.00, 0.45],
    [0.35, 0.40, 0.43, 0.45, 0.50, 0.65, 0.55, 0.50, 0.45, 1.00],
]
```

---

## Implementación del Fitness

```python
def calcular_retorno_portafolio(pesos: List[float],
                                retornos: List[float]) -> float:
    """Calcula el retorno esperado del portafolio"""
    return sum(w * r for w, r in zip(pesos, retornos))


def calcular_riesgo_portafolio(pesos: List[float],
                               riesgos: List[float],
                               correlaciones: List[List[float]]) -> float:
    """Calcula el riesgo (volatilidad) del portafolio"""
    n = len(pesos)
    varianza = 0.0
    for i in range(n):
        for j in range(n):
            varianza += (pesos[i] * pesos[j] *
                         riesgos[i] * riesgos[j] *
                         correlaciones[i][j])
    return math.sqrt(varianza)


def sharpe_ratio(pesos: List[float],
                 retornos: List[float],
                 riesgos: List[float],
                 correlaciones: List[List[float]],
                 tasa_libre_riesgo: float = 0.03) -> float:
    """
    Calcula el ratio de Sharpe del portafolio.

    Sharpe = (Retorno_Portafolio - Tasa_Libre_Riesgo) / Riesgo_Portafolio
    """
    retorno = calcular_retorno_portafolio(pesos, retornos)
    riesgo = calcular_riesgo_portafolio(pesos, riesgos, correlaciones)

    if riesgo == 0:
        return 0

    return (retorno - tasa_libre_riesgo) / riesgo


# ============================================
# SOLUCIÓN CON ALGORITMO GENÉTICO
# ============================================

class GAPortafolio:
    """
    Algoritmo Genético para optimización de cartera de inversiones.
    """

    def __init__(self, num_activos: int, retornos: List[float],
                 riesgos: List[float], correlaciones: List[List[float]],
                 tasa_libre_riesgo: float = 0.03,
                 population_size: int = 100,
                 generations: int = 200,
                 mutation_rate: float = 0.15,
                 crossover_rate: float = 0.85,
                 elitism: int = 3):
        self.num_activos = num_activos
        self.retornos = retornos
        self.riesgos = riesgos
        self.correlaciones = correlaciones
        self.tasa_libre_riesgo = tasa_libre_riesgo
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.history = []

    def crear_individuo(self) -> List[float]:
        """Crea una asignación aleatoria que suma 1.0"""
        pesos = [random.random() for _ in range(self.num_activos)]
        total = sum(pesos)
        return [w / total for w in pesos]

    def inicializar_poblacion(self) -> List[List[float]]:
        return [self.crear_individuo() for _ in range(self.population_size)]

    def fitness(self, pesos: List[float]) -> float:
        """Calcula el Sharpe Ratio"""
        return sharpe_ratio(
            pesos, self.retornos, self.riesgos,
            self.correlaciones, self.tasa_libre_riesgo
        )

    def evaluar(self, poblacion: List[List[float]]) -> List[float]:
        return [self.fitness(ind) for ind in poblacion]

    def seleccion_torneo(self, poblacion: List[List[float]],
                         fitnesses: List[float], k: int = 3) -> List[float]:
        participantes = random.sample(range(len(poblacion)), k)
        ganador = max(participantes, key=lambda i: fitnesses[i])
        return poblacion[ganador][:]

    def cruzar(self, p1: List[float], p2: List[float]) -> Tuple[List[float], List[float]]:
        """Cruce con ponderación convexa"""
        if random.random() > self.crossover_rate:
            return p1[:], p2[:]

        alpha = random.random()
        h1 = [alpha * g1 + (1 - alpha) * g2 for g1, g2 in zip(p1, p2)]
        h2 = [(1 - alpha) * g1 + alpha * g2 for g1, g2 in zip(p1, p2)]

        # Normalizar
        total1, total2 = sum(h1), sum(h2)
        return [w / total1 for w in h1], [w / total2 for w in h2]

    def mutar(self, individuo: List[float]) -> List[float]:
        """Mutación que mantiene la suma = 1.0"""
        mutado = individuo[:]
        for i in range(len(mutado)):
            if random.random() < self.mutation_rate:
                mutado[i] += random.gauss(0, 0.1)
                mutado[i] = max(0, mutado[i])

        total = sum(mutado)
        return [w / total for w in mutado]

    def calcular_diversidad(self, poblacion: List[List[float]]) -> float:
        """Calcula diversidad promedio de la población"""
        if len(poblacion) <= 1:
            return 0.0

        centroide = [sum(ind[i] for ind in poblacion) / len(poblacion)
                     for i in range(self.num_activos)]

        distancias = [math.sqrt(sum((ind[i] - centroide[i])**2
                                    for i in range(self.num_activos)))
                      for ind in poblacion]

        return sum(distancias) / len(distancias)

    def ejecutar(self, verbose: bool = True) -> dict:
        """Ejecuta la optimización"""
        poblacion = self.inicializar_poblacion()

        for gen in range(self.generations):
            fitnesses = self.evaluar(poblacion)

            mejor_idx = max(range(len(fitnesses)), key=lambda i: fitnesses[i])
            mejor_f = fitnesses[mejor_idx]
            mejor_ind = poblacion[mejor_idx]
            avg_f = sum(fitnesses) / len(fitnesses)
            div = self.calcular_diversidad(poblacion)

            ret = calcular_retorno_portafolio(mejor_ind, self.retornos)
            rie = calcular_riesgo_portafolio(mejor_ind, self.riesgos, self.correlaciones)

            self.history.append({
                'generation': gen + 1,
                'best_sharpe': round(mejor_f, 4),
                'avg_sharpe': round(avg_f, 4),
                'diversity': round(div, 4),
                'retorno': round(ret, 4),
                'riesgo': round(rie, 4),
                'pesos': [round(w, 4) for w in mejor_ind],
            })

            if verbose and (gen + 1) % 20 == 0:
                print(f"Gen {gen+1:4d} | Sharpe: {mejor_f:.4f} | "
                      f"Ret: {ret:.4f} | Rie: {rie:.4f} | Div: {div:.4f}")

            nueva_poblacion = []

            if self.elitism > 0:
                indices = sorted(range(len(fitnesses)),
                                 key=lambda i: fitnesses[i],
                                 reverse=True)
                for i in range(min(self.elitism, len(indices))):
                    nueva_poblacion.append(poblacion[indices[i]][:])

            while len(nueva_poblacion) < self.population_size:
                p1 = self.seleccion_torneo(poblacion, fitnesses)
                p2 = self.seleccion_torneo(poblacion, fitnesses)
                h1, h2 = self.cruzar(p1, p2)
                h1 = self.mutar(h1)
                h2 = self.mutar(h2)
                nueva_poblacion.extend([h1, h2])

            poblacion = nueva_poblacion[:self.population_size]

        # Resultado final
        fitnesses = self.evaluar(poblacion)
        mejor_idx = max(range(len(fitnesses)), key=lambda i: fitnesses[i])
        mejor = poblacion[mejor_idx]
        mejor_f = fitnesses[mejor_idx]

        return {
            'mejor_portafolio': {
                'activos': [a['nombre'] for a in activos],
                'pesos': [round(w * 100, 2) for w in mejor],
                'sharpe_ratio': round(mejor_f, 4),
                'retorno_esperado': round(calcular_retorno_portafolio(mejor, self.retornos) * 100, 2),
                'riesgo': round(calcular_riesgo_portafolio(mejor, self.riesgos, self.correlaciones) * 100, 2),
            },
            'history': self.history,
            'config': {
                'population_size': self.population_size,
                'generations': self.generations,
                'mutation_rate': self.mutation_rate,
                'crossover_rate': self.crossover_rate,
                'elitism': self.elitism,
            }
        }
```

---

## Ejecución del Proyecto

```python
# ============================================
# EJECUCIÓN PRINCIPAL
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("OPTIMIZACIÓN DE CARTERA CON ALGORITMOS GENÉTICOS")
    print("=" * 60)

    retornos = [a['retorno'] for a in activos]
    riesgos = [a['riesgo'] for a in activos]

    ga_portafolio = GAPortafolio(
        num_activos=len(activos),
        retornos=retornos,
        riesgos=riesgos,
        correlaciones=correlaciones,
        tasa_libre_riesgo=tasa_libre_riesgo,
        population_size=100,
        generations=200,
        mutation_rate=0.15,
        crossover_rate=0.85,
        elitism=3,
    )

    resultado = ga_portafolio.ejecutar(verbose=True)

    print("\n" + "=" * 60)
    print("RESULTADO FINAL")
    print("=" * 60)

    portafolio = resultado['mejor_portafolio']
    print(f"\nRatio de Sharpe: {portafolio['sharpe_ratio']}")
    print(f"Retorno esperado: {portafolio['retorno_esperado']}%")
    print(f"Riesgo (volatilidad): {portafolio['riesgo']}%")

    print("\nAsignación óptima:")
    for nombre, peso in zip(portafolio['activos'], portafolio['pesos']):
        barra = '█' * int(peso / 2) + '░' * (20 - int(peso / 2))
        print(f"  {nombre:6s}: {barra} {peso:.1f}%")

    config = resultado['config']
    print(f"\nConfiguración del AG:")
    print(f"  Población: {config['population_size']}")
    print(f"  Generaciones: {config['generations']}")
    print(f"  Tasa mutación: {config['mutation_rate']}")
    print(f"  Tasa cruce: {config['crossover_rate']}")
    print(f"  Elitismo: {config['elitism']}")
```

---

## Análisis de Resultados

```python
def analizar_convergencia(history: List[dict]):
    """Analiza la convergencia del AG"""
    sharpe_inicial = history[0]['best_sharpe']
    sharpe_final = history[-1]['best_sharpe']
    mejora = ((sharpe_final - sharpe_inicial) / abs(sharpe_inicial)) * 100

    print("\n--- Análisis de Convergencia ---")
    print(f"Sharpe inicial: {sharpe_inicial:.4f}")
    print(f"Sharpe final: {sharpe_final:.4f}")
    print(f"Mejora: {mejora:.1f}%")

    # Estabilidad (últimas 10 generaciones)
    ultimos = [h['best_sharpe'] for h in history[-10:]]
    estabilidad = max(ultimos) - min(ultimos)
    print(f"Estabilidad (últimas 10 gen): ±{estabilidad:.4f}")
    print(f"Generaciones para converger: ", end="")

    for h in history:
        if h['best_sharpe'] >= sharpe_final * 0.99:
            print(f"{h['generation']}")
            break

analizar_convergencia(resultado['history'])
```

---

## Extensiones del Proyecto

### 1. Restricciones Adicionales
- Límite máximo por activo (ej: no más de 30% en un solo activo)
- Exposición mínima a sectores específicos
- Restricciones de liquidez

### 2. Multi-Objetivo
- Optimizar retorno y riesgo simultáneamente (Frontera de Markowitz)
- Usar NSGA-II para encontrar el frente de Pareto

### 3. Ventanas Temporales
- Optimización con datos históricos rodantes
- Backtesting del portafolio óptimo

---

## Entregables del Proyecto

1. **Código fuente completo** (comentado y modular)
2. **Documentación técnica** (arquitectura, decisiones de diseño)
3. **Análisis de resultados** (gráficas, tablas, conclusiones)
4. **Repositorio GitHub** con commits usando prefijo `antigravity:`

### Ejemplos de Commits
```
antigravity: estructura inicial del proyecto final
antigravity: implementacion funcion fitness portafolio
antigravity: operador cruce para pesos normalizados
antigravity: mutacion con restriccion presupuestaria
antigravity: resultados optimizacion cartera
antigravity: graficas de convergencia agregadas
antigravity: README y documentacion final
```

---

## Rúbrica de Evaluación

| Criterio | Puntos |
|----------|--------|
| Implementación correcta del AG | 25 |
| Función fitness bien definida | 15 |
| Operadores genéticos correctos | 15 |
| Resultados óptimos o cercanos | 15 |
| Visualización y análisis | 15 |
| Documentación y código limpio | 10 |
| Repositorio GitHub organizado | 5 |
| **Total** | **100** |

---

## Cuestionario Final

1. ¿Por qué es necesario normalizar los pesos para que sumen 1?
   a) Porque el AG lo requiere
   b) Para representar el 100% de la inversión ✓
   c) Para hacer el fitness más rápido
   d) No es necesario

2. ¿Qué indica un Ratio de Sharpe mayor?
   a) Peor rendimiento ajustado por riesgo
   b) Mejor rendimiento ajustado por riesgo ✓
   c) Mayor riesgo
   d) Menor retorno

3. ¿Cuál es la principal ventaja de usar AG para optimización de carteras?
   a) Es el método más rápido
   b) Maneja restricciones no lineales fácilmente ✓
   c) Siempre encuentra el óptimo global
   d) No requiere datos históricos

---

## Recursos Multimedia Sugeridos

- **Video:** "Portfolio Optimization with Genetic Algorithms" (YouTube)
- **Documento:** "Markowitz Portfolio Theory" - Harry Markowitz (Premio Nobel)
- **Artículo:** "Genetic Algorithms for Financial Portfolio Optimization"
- **Herramienta:** Plotly para gráficas interactivas de la frontera eficiente
- **Dataset:** Yahoo Finance API para datos reales del mercado

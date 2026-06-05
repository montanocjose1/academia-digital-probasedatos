# Módulo 4: Selección

## Métodos de Selección en Algoritmos Genéticos

### Importancia de la Selección

La selección determina qué individuos serán padres de la siguiente generación. Una buena selección mantiene la presión evolutiva necesaria para converger hacia soluciones óptimas, sin perder diversidad genética.

---

## 1. Selección por Ruleta (Roulette Wheel Selection)

### Principio
Los individuos con mejor fitness tienen mayor probabilidad de ser seleccionados, como una ruleta donde cada individuo ocupa un área proporcional a su fitness.

### Ventajas
- Simple e intuitiva
- Preserva diversidad

### Desventajas
- Puede converger lentamente
- Problemas con fitness negativos

```python
import random

def seleccion_ruleta(poblacion, fitnesses):
    """
    Selección por ruleta proporcional al fitness.

    Args:
        poblacion: Lista de individuos
        fitnesses: Lista de valores de fitness (mayor = mejor)

    Returns:
        Individuo seleccionado
    """
    # Ajustar fitness si hay negativos
    min_f = min(fitnesses)
    if min_f < 0:
        fitness_ajustado = [f - min_f + 1e-10 for f in fitnesses]
    else:
        fitness_ajustado = [f + 1e-10 for f in fitnesses]

    total = sum(fitness_ajustado)
    r = random.uniform(0, total)
    acumulado = 0

    for i, f in enumerate(fitness_ajustado):
        acumulado += f
        if acumulado >= r:
            return poblacion[i]

    return poblacion[-1]

# Ejemplo interactivo
poblacion = ['A', 'B', 'C', 'D', 'E']
fitnesses = [0.5, 1.0, 2.0, 3.0, 3.5]

print("=== Selección por Ruleta ===")
print(f"Población: {poblacion}")
print(f"Fitness: {fitnesses}")

# Mostrar probabilidades
total = sum(f + 1e-10 for f in fitnesses)
probabilidades = [(f + 1e-10) / total * 100 for f in fitnesses]
for i, (ind, fit, prob) in enumerate(zip(poblacion, fitnesses, probabilidades)):
    print(f"  {ind}: fitness={fit}, probabilidad={prob:.1f}%")

# Simular selecciones
selecciones = [seleccion_ruleta(poblacion, fitnesses) for _ in range(1000)]
conteo = {ind: selecciones.count(ind) for ind in poblacion}
print(f"\nSelecciones en 1000 intentos:")
for ind, count in sorted(conteo.items()):
    print(f"  {ind}: {count} ({count/10:.1f}%)")
```

---

## 2. Selección por Torneo (Tournament Selection)

### Principio
Se seleccionan k individuos al azar y el mejor de ellos es el ganador.

### Ventajas
- No requiere escalar fitness
- Fácil de controlar la presión selectiva (vía k)
- Funciona con fitness negativos

### Desventajas
- Puede perder diversidad si k es muy grande

```python
def seleccion_torneo(poblacion, fitnesses, k=3):
    """
    Selección por torneo de tamaño k.

    Args:
        poblacion: Lista de individuos
        fitnesses: Lista de valores de fitness
        k: Tamaño del torneo (default: 3)

    Returns:
        Individuo ganador del torneo
    """
    participantes = random.sample(range(len(poblacion)), k)
    ganador = max(participantes, key=lambda i: fitnesses[i])
    return poblacion[ganador]

# Análisis de presión selectiva vs k
def probabilidad_ganar_mejor(k, n):
    """
    Probabilidad de que el mejor individuo gane un torneo
    de tamaño k en una población de tamaño n.
    """
    return 1 - ((k - 1) / k) ** k  # Aproximación

print("\n=== Análisis de Torneo ===")
for k in [2, 3, 5, 10, 20]:
    prob = probabilidad_ganar_mejor(k, 50)
    print(f"  k={k}: Probabilidad de seleccionar al mejor = {prob:.2%}")
```

---

## 3. Selección por Rango (Ranking Selection)

### Principio
Los individuos se ordenan por fitness y se asignan probabilidades basadas en su posición (rango), no en el valor absoluto del fitness.

### Ventajas
- Evita convergencia prematura
- Funciona bien cuando hay individuos con fitness muy alto

```python
def seleccion_rango(poblacion, fitnesses, presion_selectiva=1.5):
    """
    Selección basada en el rango del individuo.

    Args:
        poblacion: Lista de individuos
        fitnesses: Lista de valores de fitness
        presion_selectiva: s (1.0 = uniforme, 2.0 = máxima presión)

    Returns:
        Individuo seleccionado
    """
    n = len(poblacion)
    # Ordenar índices por fitness (mejor = rango más alto)
    indices = sorted(range(n), key=lambda i: fitnesses[i])

    # Calcular probabilidad basada en rango (linear ranking)
    probabilidades = []
    for i in range(n):
        # El peor tiene rango 1, el mejor tiene rango n
        rango = i + 1
        prob = (2 - presion_selectiva) / n + (2 * rango * (presion_selectiva - 1)) / (n * (n - 1))
        probabilidades.append(prob)

    # Asignar probabilidades a los individuos originales
    prob_original = [0] * n
    for nuevo_idx, orig_idx in enumerate(indices):
        prob_original[orig_idx] = probabilidades[nuevo_idx]

    r = random.random()
    acumulado = 0
    for i, prob in enumerate(prob_original):
        acumulado += prob
        if r <= acumulado:
            return poblacion[i]

    return poblacion[-1]

# Ejemplo
poblacion = ['A', 'B', 'C', 'D', 'E']
fitnesses = [10, 5, 8, 3, 1]

print("\n=== Selección por Rango ===")
indices = sorted(range(len(poblacion)), key=lambda i: fitnesses[i])
print("Ranking (peor -> mejor):")
for rank, idx in enumerate(indices, 1):
    print(f"  Rango {rank}: {poblacion[idx]} (fitness={fitnesses[idx]})")

selecciones = [seleccion_rango(poblacion, fitnesses) for _ in range(1000)]
conteo = {ind: selecciones.count(ind) for ind in poblacion}
print(f"\nSelecciones en 1000 intentos:")
for ind, count in sorted(conteo.items()):
    print(f"  {ind}: {count} ({count/10:.1f}%)")
```

---

## 4. Elitismo (Elitism)

### Principio
Los mejores individuos pasan directamente a la siguiente generación sin ser modificados.

### Ventajas
- Garantiza que la mejor solución no se pierda
- Mejora la convergencia

```python
def elitismo(poblacion, fitnesses, n_elite=2):
    """
    Selecciona los n mejores individuos para la siguiente generación.

    Args:
        poblacion: Lista de individuos
        fitnesses: Lista de valores de fitness
        n_elite: Número de individuos de élite

    Returns:
        Lista de individuos de élite
    """
    indices = sorted(range(len(poblacion)),
                     key=lambda i: fitnesses[i],
                     reverse=True)
    return [poblacion[i] for i in indices[:n_elite]]

# Ejemplo
print("\n=== Elitismo ===")
poblacion = ['A', 'B', 'C', 'D', 'E']
fitnesses = [3.5, 1.2, 4.8, 2.1, 0.5]
mejores = elitismo(poblacion, fitnesses, 2)
print(f"Individuos de élite: {mejores}")
```

---

## Comparación de Métodos

| Método | Presión Selectiva | Diversidad | Velocidad | Complejidad |
|--------|------------------|------------|-----------|-------------|
| Ruleta | Media | Alta | O(n) | Baja |
| Torneo | Alta (k grande) | Media | O(k) | Baja |
| Rango | Configurable | Alta | O(n log n) | Media |
| Elitismo | Muy alta | Baja | O(n log n) | Muy baja |

---

## Ejercicios

1. **Ejercicio 1:** Implementa un torneo probabilístico donde el mejor no siempre gana, sino que tiene una probabilidad p de ganar.

2. **Ejercicio 2:** Compara la velocidad de convergencia usando ruleta vs torneo para la función `f(x) = sin(x) + 0.5*sin(2.7x)`.

3. **Ejercicio 3:** Implementa truncation selection (seleccionar el top 20% como padres).

---

## Cuestionario

1. ¿Qué método de selección NO requiere escalar los fitness?
   a) Ruleta
   b) Torneo ✓
   c) Rango
   d) Todas requieren escalar

2. En selección por torneo, ¿qué efecto tiene aumentar k?
   a) Reduce la presión selectiva
   b) Aumenta la presión selectiva ✓
   c) No tiene efecto
   d) Hace el algoritmo más lento

3. El elitismo garantiza:
   a) Mayor diversidad
   b) Que los mejores sobrevivan ✓
   c) Mutación más rápida
   d) Selección aleatoria

# Módulo 6: Mutación

## Operadores de Mutación en Algoritmos Genéticos

### Definición

La **mutación** es el operador genético que introduce cambios aleatorios en los individuos. Su función principal es mantener la diversidad genética de la población y prevenir la convergencia prematura hacia óptimos locales.

### Importancia de la Mutación

- **Exploración:** Permite acceder a regiones del espacio de búsqueda no cubiertas por el cruce
- **Diversidad:** Evita que la población se estanque en soluciones subóptimas
- **Recuperación:** Puede reintroducir genes perdidos por selección

### Tasa de Mutación

La tasa de mutación controla la probabilidad de que un gen mute:

- **Tasa baja (0.001-0.01):** Convergencia más rápida, menor diversidad
- **Tasa media (0.01-0.1):** Balance exploración/explotación
- **Tasa alta (0.1-0.5):** Mayor exploración, puede dificultar convergencia

---

## 1. Mutación Binaria (Bit Flip)

Para cromosomas binarios, cada bit tiene probabilidad `p` de invertirse.

```
Antes: [1, 0, 1, 1, 0, 0, 1, 0]
          ^              ^
Después: [1, 1, 1, 1, 0, 1, 1, 0]
```

```python
import random
import math

def mutacion_binaria(cromosoma, tasa=0.01):
    """
    Mutación binaria: invierte cada bit con probabilidad = tasa.

    Args:
        cromosoma: Lista de bits (0 o 1)
        tasa: Probabilidad de mutación por bit

    Returns:
        Cromosoma mutado
    """
    return [
        1 - gen if random.random() < tasa else gen
        for gen in cromosoma
    ]

# Ejemplo
cromosoma = [1, 0, 1, 1, 0, 0, 1, 0]
mutado = mutacion_binaria(cromosoma, 0.1)
bits_mutados = sum(1 for a, b in zip(cromosoma, mutado) if a != b)

print("Mutación Binaria (tasa=0.1):")
print(f"Original: {cromosoma}")
print(f"Mutado:   {mutado}")
print(f"Bits mutados: {bits_mutados}")
```

---

## 2. Mutación Gaussiana (para codificación real)

Para cromosomas de números reales, se añade ruido gaussiano.

```python
def mutacion_gaussiana(cromosoma, tasa=0.1, sigma=0.5, minimo=0, maximo=10):
    """
    Mutación gaussiana para valores reales.

    Args:
        cromosoma: Lista de valores reales
        tasa: Probabilidad de mutación por gen
        sigma: Desviación estándar del ruido
        minimo, maximo: Límites del rango de valores

    Returns:
        Cromosoma mutado
    """
    mutado = []
    for gen in cromosoma:
        if random.random() < tasa:
            gen = gen + random.gauss(0, sigma)
            gen = max(minimo, min(maximo, gen))
        mutado.append(gen)
    return mutado

# Ejemplo interactivo
cromosoma = [3.5, 1.2, 7.8, 4.1, 6.3]
print("\nMutación Gaussiana (tasa=0.3, σ=0.5):")
print(f"Original:      {cromosoma}")
for i in range(3):
    mutado = mutacion_gaussiana(cromosoma, 0.3, 0.5)
    cambios = sum(1 for a, b in zip(cromosoma, mutado) if abs(a-b) > 0.001)
    print(f"Mutado ({i+1}):   {[round(v, 2) for v in mutado]} ({cambios} genes mutados)")
```

---

## 3. Mutación por Intercambio (Swap)

Para cromosomas de permutación (TSP, scheduling), intercambia dos genes.

```python
def mutacion_swap(cromosoma, tasa=0.1):
    """
    Mutación por intercambio de dos posiciones.

    Args:
        cromosoma: Lista (permutación)
        tasa: Probabilidad de aplicar la mutación al cromosoma

    Returns:
        Cromosoma mutado
    """
    if random.random() < tasa:
        i, j = random.sample(range(len(cromosoma)), 2)
        cromosoma = cromosoma[:]
        cromosoma[i], cromosoma[j] = cromosoma[j], cromosoma[i]
    return cromosoma

# Ejemplo TSP
ruta = ['A', 'B', 'C', 'D', 'E', 'F']
print("\nMutación Swap (tasa=0.5):")
print(f"Original: {ruta}")
for _ in range(3):
    print(f"Mutado:   {mutacion_swap(ruta, 0.5)}")
```

---

## 4. Mutación por Inversión (Inversion)

Invierte el orden de una subsecuencia del cromosoma.

```python
def mutacion_inversion(cromosoma, tasa=0.1):
    """
    Mutación por inversión de una subsecuencia.

    Args:
        cromosoma: Lista
        tasa: Probabilidad de aplicar la mutación

    Returns:
        Cromosoma mutado
    """
    if random.random() < tasa:
        i, j = sorted(random.sample(range(len(cromosoma)), 2))
        cromosoma = cromosoma[:i] + cromosoma[i:j+1][::-1] + cromosoma[j+1:]
    return cromosoma

# Ejemplo
print("\nMutación por Inversión:")
cromo = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
print(f"Original: {cromo}")
print(f"Invertido: {mutacion_inversion(cromo, 1.0)}")
```

---

## 5. Mutación por Desplazamiento (Scramble)

Reordena aleatoriamente una subsección del cromosoma.

```python
def mutacion_scramble(cromosoma, tasa=0.1):
    """
    Mutación scramble: reordena aleatoriamente una subsección.
    """
    if random.random() < tasa:
        i, j = sorted(random.sample(range(len(cromosoma)), 2))
        subseccion = cromosoma[i:j+1]
        random.shuffle(subseccion)
        cromosoma = cromosoma[:i] + subseccion + cromosoma[j+1:]
    return cromosoma

# Ejemplo
cromo = [1, 2, 3, 4, 5, 6, 7, 8]
print(f"\nMutación Scramble:")
print(f"Original: {cromo}")
for _ in range(3):
    print(f"Scramble: {mutacion_scramble(cromo, 1.0)}")
```

---

## 6. Mutación No Uniforme

La magnitud de la mutación disminuye con las generaciones (mayor exploración al inicio, mayor explotación al final).

```python
def mutacion_no_uniforme(cromosoma, generacion, max_generaciones,
                         tasa=0.1, sigma_inicial=1.0):
    """
    Mutación no uniforme: la magnitud decrece con las generaciones.

    Args:
        cromosoma: Lista de valores reales
        generacion: Generación actual (0-based)
        max_generaciones: Número total de generaciones
        tasa: Probabilidad de mutación por gen
        sigma_inicial: Desviación estándar inicial

    Returns:
        Cromosoma mutado
    """
    # Factor de decaimiento
    r = 1.0 - (generacion / max_generaciones)
    sigma = sigma_inicial * r

    return mutacion_gaussiana(cromosoma, tasa, sigma)


# Demostración del decaimiento
print("\nMutación No Uniforme:")
for gen in [0, 25, 50, 75, 99]:
    sigma = 1.0 * (1 - gen / 100)
    print(f"  Generación {gen+1:3d}: σ = {sigma:.3f}")
```

---

## Estrategias Avanzadas de Mutación

### Mutación Adaptativa
La tasa de mutación se ajusta dinámicamente según la diversidad de la población:

```python
def tasa_mutacion_adaptativa(poblacion, tasa_base=0.1):
    """
    Calcula la tasa de mutación basada en la diversidad de la población.

    Si la diversidad es baja, aumenta la mutación.
    Si la diversidad es alta, reduce la mutación.
    """
    valores = list(poblacion)
    diversidad = len(set(round(v, 2) for v in valores)) / len(valores)
    tasa = tasa_base * (1.0 - diversidad + 0.1)
    return min(0.5, max(0.001, tasa))


# Simulación
print("\nTasa de Mutación Adaptativa:")
poblacion_diversa = [random.uniform(0, 10) for _ in range(50)]
poblacion_convergente = [5.1 + random.gauss(0, 0.01) for _ in range(50)]

print(f"Población diversa:     tasa = {tasa_mutacion_adaptativa(poblacion_diversa):.4f}")
print(f"Población convergente: tasa = {tasa_mutacion_adaptativa(poblacion_convergente):.4f}")
```

---

## Comparación de Operadores de Mutación

| Operador | Tipo | Efecto | Cuándo usarlo |
|----------|------|--------|---------------|
| Bit Flip | Binario | Cambio mínimo | Codificación binaria |
| Gaussiana | Real | Perturbación local | Variables continuas |
| Swap | Permutación | Reordenamiento | TSP, scheduling |
| Inversión | Permutación | Cambio de orden | Problemas de orden |
| Scramble | Permutación | Gran cambio | Alta exploración |
| No Uniforme | Real | Explotación progresiva | Problemas continuos |

---

## Ejercicios

1. **Ejercicio 1:** Implementa una mutación que disminuya la tasa linealmente de 0.3 a 0.01 a lo largo de las generaciones.

2. **Ejercicio 2:** Compara el rendimiento de mutación gaussiana (σ=0.1 vs σ=1.0) en la función `f(x) = -(x-5)² + 25`.

3. **Ejercicio 3:** Crea una función fitness que mida la diversidad genética de la población como métrica para ajustar la mutación.

---

## Cuestionario

1. ¿Cuál es la función principal de la mutación en un AG?
   a) Combinar genes de padres
   b) Mantener la diversidad genética ✓
   c) Evaluar la población
   d) Seleccionar los mejores

2. Una tasa de mutación demasiado alta puede causar:
   a) Convergencia prematura
   b) Comportamiento cercano a búsqueda aleatoria ✓
   c) Mejor convergencia
   d) Menor exploración

3. ¿Qué tipo de mutación es más adecuada para codificación binaria?
   a) Gaussiana
   b) Bit Flip ✓
   c) Swap
   d) Inversión

---

## Recursos Multimedia Sugeridos

- **Diagrama:** Efecto de diferentes tasas de mutación en la convergencia
- **Animación:** Mutación gaussiana en espacio 2D
- **Video:** "Mutation Operators in Genetic Algorithms Explained"
- **Gráfica:** Tasa de mutación vs convergencia para diferentes problemas

# Módulo 5: Cruce (Crossover)

## Operadores de Cruce en Algoritmos Genéticos

### Definición

El **cruce** (o crossover) es el operador genético principal que combina el material genético de dos padres para crear nuevos individuos (hijos). Es el mecanismo que permite explorar nuevas regiones del espacio de búsqueda combinando características exitosas.

---

## 1. Cruce de 1-Punto (Single-Point Crossover)

El operador más simple. Se elige un punto de corte al azar y se intercambian las subsecuencias.

```
Padre 1: [A1, A2, A3 | A4, A5, A6]
Padre 2: [B1, B2, B3 | B4, B5, B6]
                        ^ punto de corte
Hijo 1:  [A1, A2, A3, B4, B5, B6]
Hijo 2:  [B1, B2, B3, A4, A5, A6]
```

```python
import random

def cruce_1_punto(padre1, padre2):
    """
    Cruce de 1-punto para cromosomas representados como listas.

    Args:
        padre1, padre2: Listas de genes

    Returns:
        (hijo1, hijo2): Tupla con los dos hijos
    """
    if len(padre1) < 2:
        return padre1[:], padre2[:]

    punto = random.randint(1, len(padre1) - 1)
    hijo1 = padre1[:punto] + padre2[punto:]
    hijo2 = padre2[:punto] + padre1[punto:]

    return hijo1, hijo2

# Ejemplo
p1 = [1, 0, 1, 1, 0, 0, 1, 0]
p2 = [0, 1, 0, 0, 1, 1, 0, 1]
h1, h2 = cruce_1_punto(p1, p2)

print(f"Padre 1: {p1}")
print(f"Padre 2: {p2}")
print(f"Hijo 1:  {h1}")
print(f"Hijo 2:  {h2}")
```

---

## 2. Cruce de 2-Puntos (Two-Point Crossover)

Se eligen dos puntos de corte y se intercambia la sección entre ellos.

```
Padre 1: [A1, A2 | A3, A4, A5 | A6]
Padre 2: [B1, B2 | B3, B4, B5 | B6]
                  ^         ^ puntos de corte
Hijo 1:  [A1, A2, B3, B4, B5, A6]
Hijo 2:  [B1, B2, A3, A4, A5, B6]
```

```python
def cruce_2_puntos(padre1, padre2):
    """
    Cruce de 2-puntos para cromosomas representados como listas.
    """
    n = len(padre1)
    if n < 3:
        return padre1[:], padre2[:]

    p1, p2 = sorted(random.sample(range(1, n), 2))

    hijo1 = padre1[:p1] + padre2[p1:p2] + padre1[p2:]
    hijo2 = padre2[:p1] + padre1[p1:p2] + padre2[p2:]

    return hijo1, hijo2

# Ejemplo
h1, h2 = cruce_2_puntos(p1, p2)
print(f"\nCruce 2-Puntos:")
print(f"Padre 1: {p1}")
print(f"Padre 2: {p2}")
print(f"Hijo 1:  {h1}")
print(f"Hijo 2:  {h2}")
```

---

## 3. Cruce Uniforme (Uniform Crossover)

Cada gen tiene una probabilidad independiente (generalmente 50%) de intercambiarse entre padres.

```python
def cruce_uniforme(padre1, padre2, prob_intercambio=0.5):
    """
    Cruce uniforme: cada gen se intercambia con probabilidad prob_intercambio.

    Args:
        padre1, padre2: Listas de genes
        prob_intercambio: Probabilidad de intercambiar cada gen

    Returns:
        (hijo1, hijo2)
    """
    hijo1, hijo2 = [], []

    for g1, g2 in zip(padre1, padre2):
        if random.random() < prob_intercambio:
            hijo1.append(g2)
            hijo2.append(g1)
        else:
            hijo1.append(g1)
            hijo2.append(g2)

    return hijo1, hijo2

# Análisis de máscara de cruce
print(f"\nCruce Uniforme (prob=0.5):")
for _ in range(3):
    h1, h2 = cruce_uniforme(p1, p2)
    mascara = ['|' if a != b else ' ' for a, b in zip(h1, p1)]
    print(f"Máscara: {''.join(mascara)}")
    print(f"Hijo 1:  {h1}")
    print(f"Hijo 2:  {h2}\n")
```

---

## 4. Cruce Aritmético (para codificación real)

Combina los genes de los padres usando una media ponderada.

```python
def cruce_aritmetico(padre1, padre2, alpha=None):
    """
    Cruce aritmético para representación de números reales.

    Args:
        padre1, padre2: Listas de valores reales
        alpha: Factor de combinación (None = aleatorio por gen)

    Returns:
        (hijo1, hijo2)
    """
    hijo1, hijo2 = [], []

    for g1, g2 in zip(padre1, padre2):
        if alpha is None:
            a = random.random()
        else:
            a = alpha
        hijo1.append(a * g1 + (1 - a) * g2)
        hijo2.append(a * g2 + (1 - a) * g1)

    return hijo1, hijo2

# Ejemplo con valores reales
p1_real = [3.5, 1.2, 7.8]
p2_real = [1.5, 4.3, 2.1]

print("Cruce Aritmético:")
h1, h2 = cruce_aritmetico(p1_real, p2_real)
print(f"Padre 1: {p1_real}")
print(f"Padre 2: {p2_real}")
print(f"Hijo 1:  {[round(v, 2) for v in h1]}")
print(f"Hijo 2:  {[round(v, 2) for v in h2]}")
```

---

## 5. Cruce para Permutaciones (TSP)

Cruces especializados para problemas donde el orden importa (ej: Vendedor Viajero).

```python
def cruce_ox(padre1, padre2):
    """
    Cruce Order-Based (OX) para permutaciones.
    Mantiene el orden relativo de los genes.
    """
    n = len(padre1)
    hijo = [None] * n

    # Seleccionar subsecuencia aleatoria
    inicio, fin = sorted(random.sample(range(n), 2))

    # Copiar subsecuencia del padre 1
    hijo[inicio:fin] = padre1[inicio:fin]

    # Llenar el resto con genes del padre 2 en orden
    pos = fin
    for gen in padre2:
        if gen not in hijo:
            if pos >= n:
                pos = 0
            hijo[pos] = gen
            pos += 1

    return hijo

# Ejemplo TSP (ciudades = genes)
ruta1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
ruta2 = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']

hijo = cruce_ox(ruta1, ruta2)
print("\nCruce OX para TSP:")
print(f"Padre 1: {ruta1}")
print(f"Padre 2: {ruta2}")
print(f"Hijo:    {hijo}")
```

---

## 6. Cruce BLX-α (Blend Crossover)

Para codificación real, genera hijos en un intervalo extendido más allá de los padres.

```python
def cruce_blx_alpha(padre1, padre2, alpha=0.5):
    """
    Cruce BLX-α (Blend Crossover).
    Genera hijos en [min - alpha*d, max + alpha*d]
    donde d = |padre1 - padre2|
    """
    hijo1, hijo2 = [], []

    for g1, g2 in zip(padre1, padre2):
        d = abs(g1 - g2)
        min_val = min(g1, g2) - alpha * d
        max_val = max(g1, g2) + alpha * d

        hijo1.append(random.uniform(min_val, max_val))
        hijo2.append(random.uniform(min_val, max_val))

    return hijo1, hijo2

# Ejemplo
print("\nCruce BLX-α (α=0.5):")
h1, h2 = cruce_blx_alpha(p1_real, p2_real)
print(f"Padre 1: {p1_real}")
print(f"Padre 2: {p2_real}")
print(f"Hijo 1:  {[round(v, 2) for v in h1]}")
print(f"Hijo 2:  {[round(v, 2) for v in h2]}")
```

---

## Comparación de Operadores

| Operador | Tipo | Ventajas | Desventajas |
|----------|------|----------|-------------|
| 1-Punto | Binario/Real | Simple, rápido | Sesgo posicional |
| 2-Puntos | Binario/Real | Más exploración | Similar a 1-punto |
| Uniforme | Binario | Máxima recombinación | Puede romper esquemas |
| Aritmético | Real | Bueno para funciones continuas | Convergencia lenta |
| OX | Permutación | Mantiene orden relativo | Complejidad O(n²) |
| BLX-α | Real | Explora fuera del intervalo | Puede generar valores fuera de rango |

---

## Ejercicios

1. **Ejercicio 1:** Implementa un cruce de 3-puntos y compáralo con 1-punto y 2-puntos.

2. **Ejercicio 2:** Para el problema de maximizar `f(x) = sin(x)`, compara la tasa de convergencia usando cruce uniforme vs cruce aritmético.

3. **Ejercicio 3:** Implementa el cruce PMX (Partially Mapped Crossover) para permutaciones.

---

## Cuestionario

1. ¿Cuál es el propósito principal del operador de cruce?
   a) Introducir cambios aleatorios
   b) Combinar material genético de padres ✓
   c) Eliminar individuos malos
   d) Evaluar la población

2. En el cruce uniforme con prob=0.5, ¿cuántos genes se intercambian en promedio?
   a) Todos
   b) La mitad ✓
   c) Ninguno
   d) Depende del fitness

3. ¿Qué tipo de cruce es más adecuado para problemas de permutación como el TSP?
   a) 1-punto
   b) Uniforme
   c) OX (Order Crossover) ✓
   d) Aritmético

---

## Recursos Multimedia Sugeridos

- **Diagrama:** Visualización de todos los tipos de cruce
- **Animación:** Cruce 1-punto en cromosomas binarios
- **Video:** "Crossover Operators in Genetic Algorithms"
- **Imagen:** Efecto del cruce en el landscape de fitness

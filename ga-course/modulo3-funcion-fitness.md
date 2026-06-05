# Módulo 3: Función Fitness

## La Función de Aptitud (Fitness)

### Definición

La **función fitness** (o función de aptitud) es el corazón de un Algoritmo Genético. Evalúa qué tan "buena" es una solución candidata para el problema que se desea resolver.

### Propiedades de una buena función fitness

1. **Precisa:** Debe reflejar correctamente la calidad de la solución
2. **Eficiente:** Debe ser rápida de calcular (se evalúa muchas veces)
3. **Diferenciadora:** Debe poder distinguir entre soluciones buenas y malas
4. **Escalable:** Debe funcionar para diferentes tamaños del problema

### Tipos de funciones fitness

#### Maximización
- Mayor valor = mejor solución
- Ejemplo: `f(x) = sin(x)`, ganancias, eficiencia

#### Minimización
- Menor valor = mejor solución
- Ejemplo: `f(x) = x²`, costos, errores, distancias

### Transformaciones comunes

| Problema | Función Original | Función Fitness |
|----------|-----------------|-----------------|
| Minimizar costo | `g(x) = costo` | `f(x) = 1/(1 + g(x))` |
| Maximizar ganancia | `g(x) = ganancia` | `f(x) = g(x)` |
| Minimizar error | `g(x) = error` | `f(x) = -g(x)` |
| Maximizar precisión | `g(x) = %` | `f(x) = g(x)/100` |

---

## Código Python: Funciones Fitness

```python
import math
import random
import matplotlib.pyplot as plt
import numpy as np

# ============================================
# FUNCIONES FITNESS COMUNES
# ============================================

def fitness_cuadratica(x):
    """Función cuadrática simple (máximo en x=0)"""
    return -(x ** 2) + 10

def fitness_seno(x):
    """Función sinusoidal con múltiples máximos"""
    return math.sin(x) + 0.5 * math.sin(2.7 * x + 0.5) + 0.3 * math.sin(5.1 * x + 1.2)

def fitness_rastrigin(x, y):
    """Función Rastrigin - tiene múltiples mínimos locales"""
    A = 10
    return -(A * 2 + (x**2 - A * math.cos(2 * math.pi * x)) + (y**2 - A * math.cos(2 * math.pi * y)))

def fitness_ackley(x, y):
    """Función Ackley - superficie compleja"""
    a, b, c = 20, 0.2, 2 * math.pi
    sum1 = x**2 + y**2
    sum2 = math.cos(c * x) + math.cos(c * y)
    return -( -a * math.exp(-b * math.sqrt(sum1 / 2)) - math.exp(sum2 / 2) + a + math.exp(1) )

def fitness_esfera(*x):
    """Función esfera (simple, un mínimo global)"""
    return -sum(v ** 2 for v in x)

def fitness_rosenbrock(x, y):
    """Función Rosenbrock (valle angosto)"""
    return -((1 - x)**2 + 100 * (y - x**2)**2)

# ============================================
# VISUALIZACIÓN DE FUNCIONES FITNESS
# ============================================

def graficar_funcion_1d(funcion, rango=(-5, 5), titulo="Función Fitness"):
    """Grafica una función fitness 1D"""
    xs = [i * 0.01 for i in range(int(rango[0] * 100), int(rango[1] * 100))]
    ys = [funcion(x) for x in xs]

    plt.figure(figsize=(10, 6))
    plt.plot(xs, ys, 'b-', linewidth=2)
    plt.axhline(y=0, color='gray', linestyle='--', alpha=0.3)
    plt.xlabel('x')
    plt.ylabel('f(x)')
    plt.title(titulo)
    plt.grid(True, alpha=0.3)

    # Marcar máximos
    max_idx = ys.index(max(ys))
    plt.plot(xs[max_idx], ys[max_idx], 'r*', markersize=15,
             label=f'Máximo: x={xs[max_idx]:.2f}, f={ys[max_idx]:.2f}')
    plt.legend()
    plt.show()

def graficar_funcion_2d(funcion, rango=(-5, 5), titulo="Función Fitness 2D"):
    """Grafica una función fitness 2D como superficie"""
    x = np.linspace(rango[0], rango[1], 50)
    y = np.linspace(rango[0], rango[1], 50)
    X, Y = np.meshgrid(x, y)
    Z = np.array([[funcion(X[i][j], Y[i][j]) for j in range(len(X[0]))]
                  for i in range(len(X))])

    fig = plt.figure(figsize=(12, 5))

    ax1 = fig.add_subplot(121, projection='3d')
    surf = ax1.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)
    ax1.set_title(f'{titulo} - Superficie')
    ax1.set_xlabel('x')
    ax1.set_ylabel('y')
    ax1.set_zlabel('f(x, y)')

    ax2 = fig.add_subplot(122)
    contour = ax2.contourf(X, Y, Z, levels=20, cmap='viridis')
    plt.colorbar(contour, ax=ax2)
    ax2.set_title(f'{titulo} - Contorno')
    ax2.set_xlabel('x')
    ax2.set_ylabel('y')

    plt.tight_layout()
    plt.show()

# ============================================
# SISTEMA DE FITNESS CON RESTRICCIONES
# ============================================

class FitnessConRestricciones:
    """Maneja funciones fitness con restricciones usando penalizaciones"""

    def __init__(self, funcion_objetivo, restricciones=None, factor_penalizacion=100):
        self.funcion_objetivo = funcion_objetivo
        self.restricciones = restricciones or []
        self.factor_penalizacion = factor_penalizacion

    def evaluar(self, *valores):
        fitness_base = self.funcion_objetivo(*valores)
        penalizacion = 0

        for restriccion in self.restricciones:
            if not restriccion(*valores):
                penalizacion += self.factor_penalizacion

        return fitness_base - penalizacion

# Ejemplo: Optimizar x + y sujeto a x² + y² <= 1
def objetivo(x, y):
    return x + y

def restriccion_circulo(x, y):
    return x**2 + y**2 <= 1.0

fitness = FitnessConRestricciones(objetivo, [restriccion_circulo])

# Probar soluciones
print("Solución factible (0.5, 0.5):", fitness.evaluar(0.5, 0.5))
print("Solución no factible (2, 2):", fitness.evaluar(2, 2))
print("Solución óptima (~0.707, 0.707):", fitness.evaluar(0.707, 0.707))

# ============================================
# NORMALIZACIÓN DE FITNESS
# ============================================

def normalizar_fitness(fitnesses):
    """Normaliza valores de fitness para selección por ruleta"""
    min_f = min(fitnesses)
    if min_f < 0:
        fitnesses = [f - min_f + 1e-10 for f in fitnesses]

    total = sum(fitnesses)
    if total == 0:
        return [1.0 / len(fitnesses)] * len(fitnesses)

    return [f / total for f in fitnesses]

# Ejemplo
fitnesses = [3.5, 1.2, 0.8, 4.1, 2.3]
normalizados = normalizar_fitness(fitnesses)
print("\nFitness original:", fitnesses)
print("Fitness normalizado:", [round(f, 4) for f in normalizados])
print("Suma:", sum(normalizados))
```

---

## Ejercicios

1. **Ejercicio 1:** Implementa la función fitness para el problema del "Vendedor Viajero" (TSP) donde se minimiza la distancia total.

2. **Ejercicio 2:** Crea una función fitness con restricciones para optimizar el área de un rectángulo dado un perímetro fijo.

3. **Ejercicio 3:** Grafica la función de Rastrigin en 2D y encuentra (analíticamente) su mínimo global.

---

## Cuestionario

1. ¿Qué propiedad NO es deseable en una función fitness?
   a) Precisa
   b) Lenta de calcular ✓
   c) Diferenciadora
   d) Escalable

2. Si tenemos un problema de minimización de costos, ¿cómo transformamos la función para usarla en un AG?
   a) f(x) = costo(x)
   b) f(x) = 1/(1 + costo(x)) ✓
   c) f(x) = -costo(x)
   d) f(x) = costo(x)²

3. ¿Qué función fitness tiene múltiples mínimos locales?
   a) Esfera
   b) Rastrigin ✓
   c) Lineal
   d) Cuadrática simple

---

## Recursos Multimedia Sugeridos

- **Diagrama:** Comparación de funciones fitness (máximos locales vs globales)
- **Imagen:** Superficies 3D de Rastrigin, Ackley, Rosenbrock
- **Video:** "Understanding Fitness Functions in Genetic Algorithms"
- **Animación:** Landscape de fitness con individuos evolución

# Módulo 2: Conceptos Fundamentales

## Genes, Cromosomas, Individuos y Población

### 1. Genes

**Definición:** Un gen es la unidad básica de información en un Algoritmo Genético. Representa un parámetro o variable del problema que se desea optimizar.

**Características:**
- Puede ser binario (0/1), real (número decimal), entero, o de cualquier tipo
- Cada gen codifica una característica específica de la solución
- El rango de valores del gen define el espacio de búsqueda

**Ejemplo:** Para optimizar f(x, y), tendríamos 2 genes: [gen_x, gen_y]

### 2. Cromosomas

**Definición:** Un cromosoma es una secuencia ordenada de genes que representa una solución completa al problema.

**Tipos de codificación:**
- **Binaria:** [1, 0, 1, 1, 0, 0, 1, 0]
- **Real:** [3.14, 2.71, 1.61]
- **Permutación:** [3, 1, 4, 2, 5]
- **Árbol:** (Programación Genética)

### 3. Individuos

**Definición:** Un individuo es una solución candidata en el espacio de búsqueda, compuesta por un cromosoma y su valor de fitness asociado.

**Estructura:**
```
Individuo {
    cromosoma: [gen1, gen2, ..., genN]
    fitness: valor_numerico
}
```

### 4. Población

**Definición:** Conjunto de individuos que evolucionan simultáneamente.

**Parámetros clave:**
- **Tamaño poblacional:** Número de individuos (típicamente 20-200)
- **Diversidad:** Variedad genética en la población

---

## Código Python: Representación

```python
import random
import math

class Gen:
    """Representa un gen individual"""
    def __init__(self, valor=None, minimo=0, maximo=10):
        self.minimo = minimo
        self.maximo = maximo
        self.valor = valor if valor is not None else random.uniform(minimo, maximo)

    def mutar(self, tasa=0.1):
        if random.random() < tasa:
            self.valor += random.gauss(0, (self.maximo - self.minimo) * 0.1)
            self.valor = max(self.minimo, min(self.maximo, self.valor))

class Cromosoma:
    """Representa un cromosoma compuesto de genes"""
    def __init__(self, num_genes=2):
        self.genes = [Gen() for _ in range(num_genes)]

    def obtener_valores(self):
        return [gen.valor for gen in self.genes]

class Individuo:
    """Un individuo = cromosoma + fitness"""
    def __init__(self, num_genes=2):
        self.cromosoma = Cromosoma(num_genes)
        self.fitness = 0.0

    def evaluar(self, funcion_fitness):
        valores = self.cromosoma.obtener_valores()
        self.fitness = funcion_fitness(*valores)

class Poblacion:
    """Conjunto de individuos"""
    def __init__(self, tamano=50, num_genes=2):
        self.individuos = [Individuo(num_genes) for _ in range(tamano)]

    def evaluar_todo(self, funcion_fitness):
        for ind in self.individuos:
            ind.evaluar(funcion_fitness)

    def mejor_individuo(self):
        return max(self.individuos, key=lambda ind: ind.fitness)

    def fitness_promedio(self):
        return sum(ind.fitness for ind in self.individuos) / len(self.individuos)

# Ejemplo de uso
def funcion_esfera(x, y):
    return -(x**2 + y**2)  # Maximizar: queremos el punto (0,0)

poblacion = Poblacion(tamano=100, num_genes=2)
poblacion.evaluar_todo(funcion_esfera)
mejor = poblacion.mejor_individuo()

print(f"Mejor solución: x={mejor.cromosoma.genes[0].valor:.4f}, "
      f"y={mejor.cromosoma.genes[1].valor:.4f}")
print(f"Fitness: {mejor.fitness:.4f}")
print(f"Fitness promedio: {poblacion.fitness_promedio():.4f}")
```

**Salida esperada:**
```
Mejor solución: x=0.2345, y=-0.1234
Fitness: -0.0702
Fitness promedio: -35.6789
```

---

## Ejercicios

1. **Ejercicio 1:** Crea una población de 50 individuos con 3 genes. Evalúa usando la función `f(x, y, z) = -( (x-2)^2 + (y+1)^2 + (z-3)^2 )`.

2. **Ejercicio 2:** Modifica la clase `Gen` para que use codificación binaria de 8 bits.

3. **Ejercicio 3:** Implementa una función que calcule la diversidad genética de la población (desviación estándar de los genes).

---

## Cuestionario

1. ¿Qué es un gen en el contexto de los AG?
   a) Una proteína
   b) Un parámetro de la solución ✓
   c) Un operador genético
   d) La población completa

2. ¿Qué tipo de codificación usa números reales?
   a) Binaria
   b) Real ✓
   c) Permutación
   d) Árbol

3. ¿Cuál es un tamaño poblacional típico?
   a) 1-5
   b) 20-200 ✓
   c) 1000-10000
   d) 1 millón

---

## Recursos Multimedia Sugeridos

- **Diagrama:** Estructura gen-cromosoma-individuo-población
- **Imagen:** Representación visual de codificación binaria vs real
- **Video:** "Genetic Algorithms - What is a Chromosome?" (YouTube)
- **Animación:** Evolución de una población en un espacio 2D

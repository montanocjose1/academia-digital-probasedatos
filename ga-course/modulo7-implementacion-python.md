# Módulo 7: Implementación Completa en Python

## Construcción de un Algoritmo Genético Profesional

En este módulo construiremos un AG completo, modular y optimizado que servirá como base para cualquier problema de optimización.

---

## Arquitectura del AG

```
GeneticAlgorithm
    ├── Problema (abstracto)
    │   ├── fitness_function()
    │   └── decode()
    ├── Población
    │   ├── individuos[]
    │   ├── evaluar()
    │   └── estadísticas()
    ├── Selección
    │   ├── torneo()
    │   ├── ruleta()
    │   └── rango()
    ├── Cruce
    │   ├── 1-punto()
    │   ├── uniforme()
    │   └── aritmético()
    ├── Mutación
    │   ├── gaussiana()
    │   └── no_uniforme()
    └── Estadísticas
        ├── history[]
        └── plot()
```

---

## Implementación Completa

### 1. Clase Principal - GeneticAlgorithm

```python
import random
import math
import json
from typing import List, Tuple, Callable, Optional, Dict
from dataclasses import dataclass


@dataclass
class GAConfig:
    """Configuración del Algoritmo Genético"""
    population_size: int = 100
    generations: int = 200
    mutation_rate: float = 0.1
    crossover_rate: float = 0.8
    elitism: int = 2
    tournament_size: int = 3
    selection_method: str = 'tournament'
    crossover_method: str = 'uniform'
    mutation_method: str = 'gaussian'
    optimization: str = 'max'
    seed: Optional[int] = None


class EstadisticasGeneracion:
    """Estadísticas de una generación"""
    def __init__(self, generacion: int, mejor_fitness: float,
                 mejor_individuo: List[float], fitness_promedio: float,
                 diversidad: float, peor_fitness: float):
        self.generacion = generacion
        self.mejor_fitness = mejor_fitness
        self.mejor_individuo = mejor_individuo
        self.fitness_promedio = fitness_promedio
        self.diversidad = diversidad
        self.peor_fitness = peor_fitness

    def to_dict(self) -> Dict:
        return {
            'generation': self.generacion,
            'best_fitness': round(self.mejor_fitness, 6),
            'best_individual': [round(x, 6) for x in self.mejor_individuo],
            'avg_fitness': round(self.fitness_promedio, 6),
            'diversity': round(self.diversidad, 6),
            'worst_fitness': round(self.peor_fitness, 6),
        }


class GeneticAlgorithm:
    """
    Implementación profesional de un Algoritmo Genético.

    Soporta múltiples métodos de selección, cruce y mutación.
    Diseñado para ser extensible y reutilizable.
    """

    def __init__(self, fitness_func: Callable, num_genes: int,
                 gene_bounds: List[Tuple[float, float]],
                 config: Optional[GAConfig] = None):
        """
        Args:
            fitness_func: Función de fitness (recibe lista de genes, retorna float)
            num_genes: Número de genes por individuo
            gene_bounds: Lista de tuplas (min, max) para cada gen
            config: Configuración del AG (opcional)
        """
        self.fitness_func = fitness_func
        self.num_genes = num_genes
        self.gene_bounds = gene_bounds
        self.config = config or GAConfig()
        self.history: List[EstadisticasGeneracion] = []
        self.poblacion = []
        self.fitnesses = []

        if self.config.seed is not None:
            random.seed(self.config.seed)

    def crear_individuo(self) -> List[float]:
        """Crea un individuo aleatorio dentro de los límites"""
        return [random.uniform(low, high)
                for low, high in self.gene_bounds]

    def inicializar_poblacion(self) -> None:
        """Crea la población inicial"""
        self.poblacion = [self.crear_individuo()
                          for _ in range(self.config.population_size)]

    def evaluar(self) -> None:
        """Evalúa toda la población"""
        self.fitnesses = [self.fitness_func(ind) for ind in self.poblacion]

    def seleccionar(self) -> List[float]:
        """Selecciona un padre según el método configurado"""
        if self.config.selection_method == 'tournament':
            return self._seleccion_torneo()
        elif self.config.selection_method == 'roulette':
            return self._seleccion_ruleta()
        elif self.config.selection_method == 'ranking':
            return self._seleccion_rango()
        else:
            raise ValueError(f"Método de selección desconocido: {self.config.selection_method}")

    def _seleccion_torneo(self) -> List[float]:
        """Selección por torneo"""
        k = self.config.tournament_size
        participantes = random.sample(range(len(self.poblacion)), k)
        if self.config.optimization == 'max':
            ganador = max(participantes, key=lambda i: self.fitnesses[i])
        else:
            ganador = min(participantes, key=lambda i: self.fitnesses[i])
        return self.poblacion[ganador][:]

    def _seleccion_ruleta(self) -> List[float]:
        """Selección por ruleta proporcional"""
        fitnesses = self.fitnesses[:]
        if self.config.optimization == 'min':
            min_f = min(fitnesses)
            fitnesses = [f - min_f + 1e-10 for f in fitnesses]
        else:
            fitnesses = [max(0, f) + 1e-10 for f in fitnesses]

        total = sum(fitnesses)
        r = random.uniform(0, total)
        acumulado = 0
        for i, f in enumerate(fitnesses):
            acumulado += f
            if acumulado >= r:
                return self.poblacion[i][:]
        return self.poblacion[-1][:]

    def _seleccion_rango(self) -> List[float]:
        """Selección por ranking lineal"""
        n = len(self.poblacion)
        s = 1.5  # Presión selectiva

        indices = sorted(range(n), key=lambda i: self.fitnesses[i],
                         reverse=(self.config.optimization == 'max'))

        prob = [(2 - s) / n + (2 * (n - i) * (s - 1)) / (n * (n - 1))
                for i in range(n)]

        prob_idx = {indices[i]: prob[i] for i in range(n)}

        r = random.random()
        acumulado = 0
        for i in range(n):
            acumulado += prob_idx[i]
            if r <= acumulado:
                return self.poblacion[i][:]
        return self.poblacion[-1][:]

    def cruzar(self, padre1: List[float], padre2: List[float]) -> Tuple[List[float], List[float]]:
        """Aplica cruce según el método configurado"""
        if self.config.crossover_method == 'uniform':
            return self._cruce_uniforme(padre1, padre2)
        elif self.config.crossover_method == 'arithmetic':
            return self._cruce_aritmetico(padre1, padre2)
        elif self.config.crossover_method == 'single_point':
            return self._cruce_1_punto(padre1, padre2)
        else:
            raise ValueError(f"Método de cruce desconocido: {self.config.crossover_method}")

    def _cruce_uniforme(self, p1: List[float], p2: List[float]) -> Tuple[List[float], List[float]]:
        """Cruce uniforme"""
        if random.random() > self.config.crossover_rate:
            return p1[:], p2[:]
        h1, h2 = [], []
        for g1, g2 in zip(p1, p2):
            if random.random() < 0.5:
                h1.append(g2)
                h2.append(g1)
            else:
                h1.append(g1)
                h2.append(g2)
        return h1, h2

    def _cruce_aritmetico(self, p1: List[float], p2: List[float]) -> Tuple[List[float], List[float]]:
        """Cruce aritmético"""
        if random.random() > self.config.crossover_rate:
            return p1[:], p2[:]
        alpha = random.random()
        h1 = [alpha * g1 + (1 - alpha) * g2 for g1, g2 in zip(p1, p2)]
        h2 = [alpha * g2 + (1 - alpha) * g1 for g1, g2 in zip(p1, p2)]
        return h1, h2

    def _cruce_1_punto(self, p1: List[float], p2: List[float]) -> Tuple[List[float], List[float]]:
        """Cruce de 1-punto"""
        if random.random() > self.config.crossover_rate:
            return p1[:], p2[:]
        punto = random.randint(1, self.num_genes - 1)
        h1 = p1[:punto] + p2[punto:]
        h2 = p2[:punto] + p1[punto:]
        return h1, h2

    def mutar(self, individuo: List[float]) -> List[float]:
        """Aplica mutación según el método configurado"""
        if self.config.mutation_method == 'gaussian':
            return self._mutacion_gaussiana(individuo)
        elif self.config.mutation_method == 'uniform':
            return self._mutacion_uniforme(individuo)
        elif self.config.mutation_method == 'non_uniform':
            return self._mutacion_no_uniforme(individuo, len(self.history))
        else:
            raise ValueError(f"Método de mutación desconocido: {self.config.mutation_method}")

    def _mutacion_gaussiana(self, individuo: List[float]) -> List[float]:
        """Mutación gaussiana"""
        mutado = []
        for gen, (low, high) in zip(individuo, self.gene_bounds):
            if random.random() < self.config.mutation_rate:
                sigma = (high - low) * 0.1
                gen = gen + random.gauss(0, sigma)
                gen = max(low, min(high, gen))
            mutado.append(gen)
        return mutado

    def _mutacion_uniforme(self, individuo: List[float]) -> List[float]:
        """Mutación uniforme (reemplazo aleatorio)"""
        mutado = []
        for gen, (low, high) in zip(individuo, self.gene_bounds):
            if random.random() < self.config.mutation_rate:
                gen = random.uniform(low, high)
            mutado.append(gen)
        return mutado

    def _mutacion_no_uniforme(self, individuo: List[float],
                              generacion: int) -> List[float]:
        """Mutación no uniforme (magnitud decreciente)"""
        r = 1.0 - (generacion / self.config.generations)
        mutado = []
        for gen, (low, high) in zip(individuo, self.gene_bounds):
            if random.random() < self.config.mutation_rate:
                sigma = (high - low) * 0.1 * r
                gen = gen + random.gauss(0, sigma)
                gen = max(low, min(high, gen))
            mutado.append(gen)
        return mutado

    def calcular_diversidad(self) -> float:
        """Calcula la diversidad genética de la población"""
        if len(self.poblacion) <= 1:
            return 0.0

        centroide = [sum(ind[i] for ind in self.poblacion) / len(self.poblacion)
                     for i in range(self.num_genes)]

        distancias = [math.sqrt(sum((ind[i] - centroide[i])**2
                                    for i in range(self.num_genes)))
                      for ind in self.poblacion]

        return sum(distancias) / len(distancias)

    def ejecutar(self, verbose: bool = True) -> Dict:
        """
        Ejecuta el AG completo.

        Returns:
            Dict con resultados e historial
        """
        self.inicializar_poblacion()

        for gen in range(self.config.generations):
            self.evaluar()

            if self.config.optimization == 'max':
                mejor_idx = max(range(len(self.fitnesses)),
                                key=lambda i: self.fitnesses[i])
            else:
                mejor_idx = min(range(len(self.fitnesses)),
                                key=lambda i: self.fitnesses[i])

            mejor_f = self.fitnesses[mejor_idx]
            mejor_ind = self.poblacion[mejor_idx]

            if self.config.optimization == 'max':
                peor_f = min(self.fitnesses)
            else:
                peor_f = max(self.fitnesses)

            avg_f = sum(self.fitnesses) / len(self.fitnesses)
            div = self.calcular_diversidad()

            stats = EstadisticasGeneracion(
                generacion=gen + 1,
                mejor_fitness=mejor_f,
                mejor_individuo=mejor_ind,
                fitness_promedio=avg_f,
                diversidad=div,
                peor_fitness=peor_f,
            )
            self.history.append(stats)

            if verbose and (gen + 1) % 10 == 0:
                print(f"Gen {gen+1:4d} | Mejor: {mejor_f:.6f} | "
                      f"Prom: {avg_f:.6f} | Div: {div:.4f} | "
                      f"x*: {[round(v, 4) for v in mejor_ind]}")

            # Crear nueva población
            nueva_poblacion = []

            # Elitismo
            if self.config.elitism > 0:
                indices = sorted(range(len(self.fitnesses)),
                                 key=lambda i: self.fitnesses[i],
                                 reverse=(self.config.optimization == 'max'))
                for i in range(min(self.config.elitism, len(indices))):
                    nueva_poblacion.append(self.poblacion[indices[i]][:])

            # Generar hijos
            while len(nueva_poblacion) < self.config.population_size:
                p1 = self.seleccionar()
                p2 = self.seleccionar()
                h1, h2 = self.cruzar(p1, p2)
                h1 = self.mutar(h1)
                h2 = self.mutar(h2)
                nueva_poblacion.extend([h1, h2])

            self.poblacion = nueva_poblacion[:self.config.population_size]

        # Resultados finales
        self.evaluar()
        if self.config.optimization == 'max':
            mejor_idx = max(range(len(self.fitnesses)),
                            key=lambda i: self.fitnesses[i])
        else:
            mejor_idx = min(range(len(self.fitnesses)),
                            key=lambda i: self.fitnesses[i])

        return {
            'best_x': [round(v, 6) for v in self.poblacion[mejor_idx]],
            'best_fitness': round(self.fitnesses[mejor_idx], 6),
            'history': [h.to_dict() for h in self.history],
            'avg_fitness_final': round(sum(self.fitnesses) / len(self.fitnesses), 6),
            'config': {
                'population_size': self.config.population_size,
                'generations': self.config.generations,
                'mutation_rate': self.config.mutation_rate,
                'crossover_rate': self.config.crossover_rate,
                'elitism': self.config.elitism,
                'selection': self.config.selection_method,
                'crossover': self.config.crossover_method,
                'mutation': self.config.mutation_method,
            }
        }
```

---

## 2. Ejemplos de Aplicación

### Ejemplo 1: Optimización de Función Senoidal

```python
# Problema: Maximizar f(x) = sin(x) + 0.5*sin(2.7x + 0.5) + 0.3*sin(5.1x + 1.2)

def fitness_seno(x):
    return math.sin(x[0]) + 0.5 * math.sin(2.7 * x[0] + 0.5) + 0.3 * math.sin(5.1 * x[0] + 1.2)

config = GAConfig(
    population_size=50,
    generations=100,
    mutation_rate=0.1,
    crossover_rate=0.8,
    elitism=2,
    selection_method='tournament',
    crossover_method='arithmetic',
    mutation_method='gaussian',
)

ga = GeneticAlgorithm(
    fitness_func=fitness_seno,
    num_genes=1,
    gene_bounds=[(0, 10)],
    config=config,
)

resultado = ga.ejecutar(verbose=True)
print(f"\n=== RESULTADO ===")
print(f"Mejor x: {resultado['best_x']}")
print(f"Mejor fitness: {resultado['best_fitness']}")
```

### Ejemplo 2: Minimización de la Función Esfera

```python
# Problema: Minimizar f(x,y) = x² + y² (mínimo en 0,0)

def fitness_esfera(x):
    return -(x[0]**2 + x[1]**2)  # Negativo para convertir minimización en maximización

ga = GeneticAlgorithm(
    fitness_func=fitness_esfera,
    num_genes=2,
    gene_bounds=[(-5, 5), (-5, 5)],
    config=GAConfig(population_size=80, generations=150),
)

resultado = ga.ejecutar()
print(f"\nMínimo encontrado: x={resultado['best_x'][0]:.6f}, y={resultado['best_x'][1]:.6f}")
print(f"f(x,y) = {resultado['best_fitness']:.6f}")
```

---

## 3. Exportación de Resultados

```python
def exportar_resultados(resultado: Dict, filename: str = 'resultados_ag.json'):
    """Exporta los resultados del AG a JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    print(f"Resultados exportados a {filename}")

# Uso
exportar_resultados(resultado)
```

---

## 4. Visualización de Resultados

```python
import matplotlib.pyplot as plt

def graficar_evolucion(history: List[Dict]):
    """Grafica la evolución del AG"""
    gens = [h['generation'] for h in history]
    best = [h['best_fitness'] for h in history]
    avg = [h['avg_fitness'] for h in history]
    div = [h['diversity'] for h in history]

    fig, axes = plt.subplots(2, 2, figsize=(12, 8))

    axes[0, 0].plot(gens, best, 'b-', linewidth=2, label='Mejor')
    axes[0, 0].plot(gens, avg, 'r--', linewidth=2, label='Promedio')
    axes[0, 0].set_xlabel('Generación')
    axes[0, 0].set_ylabel('Fitness')
    axes[0, 0].set_title('Evolución del Fitness')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)

    axes[0, 1].plot(gens, div, 'g-', linewidth=2)
    axes[0, 1].set_xlabel('Generación')
    axes[0, 1].set_ylabel('Diversidad')
    axes[0, 1].set_title('Diversidad Genética')
    axes[0, 1].grid(True, alpha=0.3)

    axes[1, 0].plot(gens, [h['best_individual'][0] for h in history], 'm-', linewidth=2)
    axes[1, 0].set_xlabel('Generación')
    axes[1, 0].set_ylabel('Mejor x')
    axes[1, 0].set_title('Evolución de la Mejor Solución')
    axes[1, 0].grid(True, alpha=0.3)

    axes[1, 1].axis('off')

    plt.tight_layout()
    plt.show()

# Uso
# graficar_evolucion(resultado['history'])
```

---

## Ejercicios

1. **Ejercicio 1:** Usa la clase `GeneticAlgorithm` para optimizar la función de Rosenbrock `f(x,y) = (1-x)² + 100(y-x²)²`.

2. **Ejercicio 2:** Implementa un nuevo método de selección llamado "truncation" (seleccionar el top 30%).

3. **Ejercicio 3:** Añade un callback que se ejecute cada N generaciones y permita monitorear el progreso.

4. **Ejercicio 4:** Implementa una parada temprana si el fitness no mejora en 20 generaciones.

---

## Cuestionario

1. ¿Cuál es la ventaja de la arquitectura modular del AG?
   a) Es más lenta
   b) Permite intercambiar componentes fácilmente ✓
   c) Requiere más memoria
   d) No tiene ventajas

2. ¿Qué función cumple el elitismo en la implementación?
   a) Aumenta la mutación
   b) Preserva los mejores individuos ✓
   c) Reduce la población
   d) Cambia el método de selección

3. ¿Cómo se maneja la minimización en este AG?
   a) No se puede
   b) Negando el fitness ✓
   c) Usando otro algoritmo
   d) Invirtiendo la selección

---

## Recursos Multimedia Sugeridos

- **Diagrama:** Arquitectura UML de la implementación
- **Video:** Tutorial de implementación paso a paso
- **Código:** Repositorio GitHub con el código completo
- **Gráfica:** Comparación de rendimiento entre diferentes configuraciones

"""
Módulo independiente de Algoritmos Genéticos para uso educativo.
Puede ejecutarse de forma standalone o importarse desde otros módulos.
"""

import random
import math
import matplotlib.pyplot as plt
import io
import base64


class GeneticAlgorithm:
    """
    Implementación completa de un Algoritmo Genético para maximizar
    la función: f(x) = sin(x) + 0.5*sin(2.7x + 0.5) + 0.3*sin(5.1x + 1.2)

    Atributos:
        population_size (int): Tamaño de la población
        mutation_rate (float): Tasa de mutación (0-1)
        generations (int): Número de generaciones
        crossover_rate (float): Tasa de cruce (0-1)
        elitism (int): Número de individuos de élite
    """

    def __init__(self, population_size=50, mutation_rate=0.1,
                 generations=100, crossover_rate=0.8, elitism=2):
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.generations = generations
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.history = []

    def fitness(self, x):
        """Función objetivo a maximizar"""
        return (math.sin(x) + 0.5 * math.sin(2.7 * x + 0.5)
                + 0.3 * math.sin(5.1 * x + 1.2))

    def create_individual(self):
        """Crea un individuo aleatorio en el rango [0, 10]"""
        return random.uniform(0, 10)

    def create_population(self):
        """Crea la población inicial"""
        return [self.create_individual() for _ in range(self.population_size)]

    def evaluate(self, population):
        """Evalúa toda la población"""
        return [self.fitness(ind) for ind in population]

    def tournament_selection(self, population, fitnesses, k=3):
        """Selección por torneo"""
        selected = random.sample(range(len(population)), k)
        winner = max(selected, key=lambda i: fitnesses[i])
        return population[winner]

    def roulette_selection(self, population, fitnesses):
        """Selección por ruleta"""
        min_f = min(fitnesses)
        adjusted = [f - min_f + 1e-10 for f in fitnesses]
        total = sum(adjusted)
        r = random.uniform(0, total)
        cumulative = 0
        for i, f in enumerate(adjusted):
            cumulative += f
            if cumulative >= r:
                return population[i]
        return population[-1]

    def crossover(self, parent1, parent2):
        """Cruce uniforme"""
        if random.random() > self.crossover_rate:
            return parent1, parent2
        alpha = random.random()
        child1 = alpha * parent1 + (1 - alpha) * parent2
        child2 = (1 - alpha) * parent1 + alpha * parent2
        return child1, child2

    def mutate(self, individual):
        """Mutación gaussiana"""
        if random.random() < self.mutation_rate:
            return individual + random.gauss(0, 0.5)
        return individual

    def run(self, verbose=False):
        """Ejecuta el algoritmo genético completo"""
        population = self.create_population()
        best_individual = None
        best_fitness = float('-inf')

        for gen in range(self.generations):
            fitnesses = self.evaluate(population)

            gen_best_idx = max(range(len(fitnesses)), key=lambda i: fitnesses[i])
            gen_best = population[gen_best_idx]
            gen_best_f = fitnesses[gen_best_idx]

            if gen_best_f > best_fitness:
                best_fitness = gen_best_f
                best_individual = gen_best

            avg_fitness = sum(fitnesses) / len(fitnesses)
            diversity = len(set(round(f, 2) for f in fitnesses))

            self.history.append({
                'generation': gen + 1,
                'best_fitness': round(gen_best_f, 4),
                'avg_fitness': round(avg_fitness, 4),
                'diversity': diversity,
                'best_x': round(gen_best, 4),
            })

            if verbose and gen % 10 == 0:
                print(f"Gen {gen+1:3d} | Best: {gen_best_f:.4f} (x={gen_best:.4f}) | Avg: {avg_fitness:.4f} | Div: {diversity}")

            new_population = []

            if self.elitism > 0:
                sorted_indices = sorted(range(len(fitnesses)),
                                        key=lambda i: fitnesses[i],
                                        reverse=True)
                for i in range(min(self.elitism, len(sorted_indices))):
                    new_population.append(population[sorted_indices[i]])

            while len(new_population) < self.population_size:
                p1 = self.tournament_selection(population, fitnesses)
                p2 = self.tournament_selection(population, fitnesses)
                c1, c2 = self.crossover(p1, p2)
                c1 = self.mutate(c1)
                c2 = self.mutate(c2)
                new_population.extend([c1, c2])

            population = new_population[:self.population_size]

        return {
            'best_x': round(best_individual, 4),
            'best_fitness': round(best_fitness, 4),
            'history': self.history,
        }

    def plot_evolution(self):
        """Genera gráfica de la evolución del fitness"""
        generations = [h['generation'] for h in self.history]
        best_fitnesses = [h['best_fitness'] for h in self.history]
        avg_fitnesses = [h['avg_fitness'] for h in self.history]

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        ax1.plot(generations, best_fitnesses, 'b-', label='Mejor Fitness', linewidth=2)
        ax1.plot(generations, avg_fitnesses, 'r--', label='Fitness Promedio', linewidth=2)
        ax1.set_xlabel('Generación')
        ax1.set_ylabel('Fitness')
        ax1.set_title('Evolución del Fitness')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        diversity = [h['diversity'] for h in self.history]
        ax2.plot(generations, diversity, 'g-', linewidth=2)
        ax2.set_xlabel('Generación')
        ax2.set_ylabel('Diversidad')
        ax2.set_title('Diversidad de la Población')
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        return fig

    def plot_function(self):
        """Genera gráfica de la función objetivo"""
        fig, ax = plt.subplots(figsize=(10, 6))
        xs = [i * 0.01 for i in range(0, 1000)]
        ys = [self.fitness(x) for x in xs]
        ax.plot(xs, ys, 'b-', linewidth=2, label='f(x)')
        ax.set_xlabel('x')
        ax.set_ylabel('f(x)')
        ax.set_title('Función Objetivo')
        ax.grid(True, alpha=0.3)
        ax.legend()
        return fig


def ejemplo_basico():
    """Ejemplo de uso básico del AG"""
    print("=== Algoritmo Genético - Ejemplo Básico ===")
    ga = GeneticAlgorithm(
        population_size=30,
        mutation_rate=0.1,
        generations=50,
        crossover_rate=0.8,
        elitism=2
    )

    result = ga.run(verbose=True)

    print(f"\n--- Resultados Finales ---")
    print(f"Mejor x encontrado: {result['best_x']}")
    print(f"Mejor fitness: {result['best_fitness']}")
    print(f"Total de generaciones: {len(result['history'])}")

    return result


if __name__ == '__main__':
    ejemplo_basico()

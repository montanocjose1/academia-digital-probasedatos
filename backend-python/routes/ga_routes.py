from flask import Blueprint, request, jsonify
import random
import math

ga_bp = Blueprint('genetic_algorithm', __name__)


class GeneticAlgorithmSolver:
    def __init__(self, population_size=50, mutation_rate=0.1,
                 generations=100, crossover_rate=0.8,
                 elitism=2, optimization='max'):
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.generations = generations
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.optimization = optimization
        self.history = []

    def fitness_function(self, x):
        return (math.sin(x) + 0.5 * math.sin(2.7 * x + 0.5)
                + 0.3 * math.sin(5.1 * x + 1.2))

    def create_individual(self):
        return random.uniform(0, 10)

    def create_population(self):
        return [self.create_individual() for _ in range(self.population_size)]

    def calculate_fitness(self, individual):
        return self.fitness_function(individual)

    def evaluate_population(self, population):
        return [self.calculate_fitness(ind) for ind in population]

    def select_parent_tournament(self, population, fitnesses, tournament_size=3):
        selected = random.sample(range(len(population)), tournament_size)
        if self.optimization == 'max':
            winner = max(selected, key=lambda i: fitnesses[i])
        else:
            winner = min(selected, key=lambda i: fitnesses[i])
        return population[winner]

    def select_parent_roulette(self, population, fitnesses):
        if self.optimization == 'min':
            min_f = min(fitnesses)
            adjusted = [f - min_f + 1e-10 for f in fitnesses]
        else:
            adjusted = [max(0, f) + 1e-10 for f in fitnesses]

        total = sum(adjusted)
        r = random.uniform(0, total)
        cumulative = 0
        for i, f in enumerate(adjusted):
            cumulative += f
            if cumulative >= r:
                return population[i]
        return population[-1]

    def crossover_uniform(self, parent1, parent2):
        if random.random() > self.crossover_rate:
            return parent1, parent2
        alpha = random.random()
        child1 = alpha * parent1 + (1 - alpha) * parent2
        child2 = (1 - alpha) * parent1 + alpha * parent2
        return child1, child2

    def mutate(self, individual):
        if random.random() < self.mutation_rate:
            return individual + random.gauss(0, 0.5)
        return individual

    def run(self, selection_method='tournament'):
        population = self.create_population()
        best_individual = None
        best_fitness = float('-inf') if self.optimization == 'max' else float('inf')

        for generation in range(self.generations):
            fitnesses = self.evaluate_population(population)

            pop_data = []
            for i, ind in enumerate(population):
                pop_data.append({
                    'x': round(ind, 4),
                    'fitness': round(fitnesses[i], 4),
                })
                if self.optimization == 'max' and fitnesses[i] > best_fitness:
                    best_fitness = fitnesses[i]
                    best_individual = ind
                elif self.optimization == 'min' and fitnesses[i] < best_fitness:
                    best_fitness = fitnesses[i]
                    best_individual = ind

            avg_fitness = sum(fitnesses) / len(fitnesses)
            diversity = len(set(round(f, 2) for f in fitnesses))

            self.history.append({
                'generation': generation + 1,
                'best_fitness': round(max(fitnesses) if self.optimization == 'max' else min(fitnesses), 4),
                'avg_fitness': round(avg_fitness, 4),
                'diversity': diversity,
                'best_x': round(best_individual, 4) if best_individual else 0,
                'population': pop_data,
            })

            new_population = []

            if self.elitism > 0:
                sorted_idx = sorted(range(len(fitnesses)),
                                    key=lambda i: fitnesses[i],
                                    reverse=(self.optimization == 'max'))
                for i in range(min(self.elitism, len(sorted_idx))):
                    new_population.append(population[sorted_idx[i]])

            while len(new_population) < self.population_size:
                if selection_method == 'tournament':
                    p1 = self.select_parent_tournament(population, fitnesses)
                    p2 = self.select_parent_tournament(population, fitnesses)
                else:
                    p1 = self.select_parent_roulette(population, fitnesses)
                    p2 = self.select_parent_roulette(population, fitnesses)

                c1, c2 = self.crossover_uniform(p1, p2)
                c1 = self.mutate(c1)
                c2 = self.mutate(c2)
                new_population.extend([c1, c2])

            population = new_population[:self.population_size]

        return {
            'best_x': round(best_individual, 4),
            'best_fitness': round(best_fitness, 4),
            'history': self.history,
        }


@ga_bp.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json() or {}

    solver = GeneticAlgorithmSolver(
        population_size=data.get('population_size', 50),
        mutation_rate=data.get('mutation_rate', 0.1),
        generations=data.get('generations', 100),
        crossover_rate=data.get('crossover_rate', 0.8),
        elitism=data.get('elitism', 2),
        optimization=data.get('optimization', 'max'),
    )

    result = solver.run(selection_method=data.get('selection_method', 'tournament'))

    return jsonify({
        'config': {
            'population_size': solver.population_size,
            'mutation_rate': solver.mutation_rate,
            'generations': solver.generations,
            'crossover_rate': solver.crossover_rate,
            'elitism': solver.elitism,
            'selection_method': data.get('selection_method', 'tournament'),
        },
        'result': {
            'best_x': result['best_x'],
            'best_fitness': result['best_fitness'],
            'history': result['history'][-1] if result['history'] else None,
        },
        'full_history': result['history'],
    })


@ga_bp.route('/explain', methods=['GET'])
def explain_ga():
    return jsonify({
        'algorithm': 'Genetic Algorithm',
        'description': 'Optimization algorithm inspired by natural selection',
        'components': {
            'population': 'Set of candidate solutions',
            'fitness_function': 'f(x) = sin(x) + 0.5*sin(2.7x+0.5) + 0.3*sin(5.1x+1.2)',
            'selection': ['tournament', 'roulette'],
            'crossover': 'Uniform crossover with configurable rate',
            'mutation': 'Gaussian mutation with configurable rate',
            'elitism': 'Preserve best individuals across generations',
        },
        'parameters': {
            'population_size': 'Number of individuals (default: 50)',
            'mutation_rate': 'Probability of mutation (default: 0.1)',
            'generations': 'Number of iterations (default: 100)',
            'crossover_rate': 'Probability of crossover (default: 0.8)',
        },
    })

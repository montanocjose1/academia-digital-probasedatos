import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Info, Code, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import GeneticAlgorithmDemo from '../components/GeneticAlgorithmDemo';

const EXPLANATION = [
  { title: 'Población', desc: 'Conjunto de candidatos a solución. Cada individuo representa un valor de x en el dominio de la función.' },
  { title: 'Selección', desc: 'Se escogen individuos mediante torneo o ruleta. Favorece a los más aptos sin descartar débiles.' },
  { title: 'Cruce', desc: 'Dos padres se combinan para generar hijos que mezclan sus características (aritmético, uniforme).' },
  { title: 'Mutación', desc: 'Pequeñas perturbaciones aleatorias que permiten explorar nuevas zonas del espacio de búsqueda.' },
  { title: 'Elitismo', desc: 'Los mejores individuos pasan intactos a la siguiente generación, asegurando la mejor solución.' },
];

export default function GALab() {
  const [showPython, setShowPython] = useState(false);
  const [pyResult, setPyResult] = useState(null);
  const [pyLoading, setPyLoading] = useState(false);

  const runPythonSimulation = async () => {
    setPyLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ga/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          population_size: 60,
          mutation_rate: 0.1,
          generations: 100,
          crossover_rate: 0.85,
          elitism: 2,
          selection_method: 'tournament',
        }),
      });
      const data = await res.json();
      setPyResult(data);
    } catch {
      setPyResult({
        error: true,
        message: 'Backend no disponible. Ejecuta: cd backend-python && python app.py',
      });
    }
    setPyLoading(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl pt-8 pb-4">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
      </div>

      <section className="relative overflow-hidden pb-4">
        <div className="glow-orb w-[500px] h-[300px] bg-indigo-600/8 top-0 left-[40%]" />
        <div className="container-xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 badge-primary mb-4">
              <BookOpen className="w-3 h-3" /> Laboratorio Interactivo
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
              Algoritmo <span className="gradient-text">Genético</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Visualiza en tiempo real cómo una población de individuos evoluciona mediante selección natural,
              cruce y mutación para encontrar el máximo de una función matemática.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-6">
        <div className="container-xl">
          <GeneticAlgorithmDemo />

          <div className="glass-panel rounded-2xl p-6 mt-6 border border-white/6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                <Info className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white mb-1">Función objetivo</h3>
                <p className="text-sm text-slate-400">
                  <code className="px-2 py-0.5 rounded bg-white/5 text-indigo-300 text-xs">
                    f(x) = sin(x) + 0.5 · sin(2.7x + 0.5) + 0.3 · sin(5.1x + 1.2)
                  </code>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  El algoritmo busca encontrar el valor de <strong className="text-slate-300">x</strong> que maximiza esta función.
                  Los puntos rojos representan individuos con baja aptitud; los verdes/amarillos, alta aptitud.
                  La estrella dorada marca el mejor individuo de cada generación.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-2xl text-white">¿Cómo funciona?</h2>
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {EXPLANATION.map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs mb-3">{i + 1}</div>
                  <h4 className="font-display font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowPython(!showPython)}
              className="flex items-center gap-2 w-full px-6 py-4 rounded-2xl glass-panel border border-white/6 hover:border-indigo-500/30 transition-all cursor-pointer text-left"
            >
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <div className="flex-1">
                <span className="font-display font-semibold text-white">Simulador Python (Backend)</span>
                <span className="text-xs text-slate-500 ml-2">Ejecuta el AG en el servidor Flask</span>
              </div>
              {showPython ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {showPython && (
              <div className="p-6 rounded-2xl border border-white/6 bg-white/[0.02] mt-2">
                <p className="text-sm text-slate-400 mb-4">
                  Ejecuta el Algoritmo Genético en el backend Python. Obtendrás estadísticas detalladas de la última generación.
                </p>
                <button
                  onClick={runPythonSimulation}
                  disabled={pyLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FlaskConical className="w-4 h-4" />
                  {pyLoading ? 'Ejecutando...' : 'Ejecutar Simulación'}
                </button>

                {pyResult && !pyResult.error && (
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/6">
                    <h4 className="text-sm font-semibold text-white mb-3">Resultados</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="stat-card text-center">
                        <div className="font-display font-bold text-lg text-amber-400">{pyResult.result?.best_x || 0}</div>
                        <div className="text-[11px] text-slate-500">Mejor x</div>
                      </div>
                      <div className="stat-card text-center">
                        <div className="font-display font-bold text-lg text-green-400">{pyResult.result?.best_fitness || 0}</div>
                        <div className="text-[11px] text-slate-500">Fitness máximo</div>
                      </div>
                      <div className="stat-card text-center">
                        <div className="font-display font-bold text-lg text-indigo-400">{pyResult.config?.population_size || 0}</div>
                        <div className="text-[11px] text-slate-500">Población</div>
                      </div>
                      <div className="stat-card text-center">
                        <div className="font-display font-bold text-lg text-cyan-400">{pyResult.config?.mutation_rate || 0}</div>
                        <div className="text-[11px] text-slate-500">Tasa mutación</div>
                      </div>
                    </div>
                  </div>
                )}

                {pyResult?.error && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">{pyResult.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => window.open('/ga-course/modulo7-implementacion-python.md', '_blank')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer text-sm"
            >
              <Code className="w-4 h-4" /> Ver implementación Python completa
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

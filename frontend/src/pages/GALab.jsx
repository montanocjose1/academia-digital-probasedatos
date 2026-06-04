import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Info } from 'lucide-react';
import GeneticAlgorithmDemo from '../components/GeneticAlgorithmDemo';

const EXPLANATION = [
  {
    title: 'Población',
    desc: 'Un conjunto de candidatos a solución. Cada individuo representa un valor de x en el dominio de la función.',
  },
  {
    title: 'Selección (Torneo)',
    desc: 'Se escogen aleatoriamente 3 individuos y se queda el mejor. Esto favorece a los más aptos sin descartar por completo a los débiles.',
  },
  {
    title: 'Cruce (Recombinación)',
    desc: 'Dos padres se combinan con un factor aleatorio para generar dos hijos que mezclan sus características (cruce aritmético).',
  },
  {
    title: 'Mutación',
    desc: 'Con una probabilidad del 10%, un individuo sufre una pequeña perturbación aleatoria, permitiendo explorar nuevas zonas.',
  },
  {
    title: 'Elitismo',
    desc: 'Los 2 mejores individuos pasan intactos a la siguiente generación, asegurando que no se pierda la mejor solución encontrada.',
  },
];

export default function GALab() {
  return (
    <div className="page-wrapper">
      {/* Back link */}
      <div className="container-xl pt-8 pb-4">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pb-4">
        <div className="glow-orb w-[500px] h-[300px] bg-indigo-600/8 top-0 left-[40%]" />
        <div className="container-xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 badge-primary mb-4">
              <BookOpen className="w-3 h-3" /> Laboratorio Interactivo
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
              Algoritmo{' '}
              <span className="gradient-text">Genético</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Visualiza en tiempo real cómo una población de individuos evoluciona mediante selección natural,
              cruce y mutación para encontrar el máximo de una función matemática.
            </p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="section pt-6">
        <div className="container-xl">
          <GeneticAlgorithmDemo />

          {/* Target function info */}
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

          {/* Explanation */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-2xl text-white">¿Cómo funciona?</h2>
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {EXPLANATION.map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs mb-3">
                    {i + 1}
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Config */}
          <div className="glass-panel rounded-2xl p-6 mt-6 border border-white/6">
            <h3 className="font-display font-semibold text-white text-sm mb-3">Parámetros del algoritmo</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              {[
                { label: 'Tamaño población', value: '60' },
                { label: 'Tasa de cruce', value: '85%' },
                { label: 'Tasa de mutación', value: '10%' },
                { label: 'Selección', value: 'Torneo (k=3)' },
                { label: 'Elitismo', value: '2 individuos' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-slate-300 font-medium">{value}</div>
                  <div className="text-[11px] text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Dna, Trophy, Zap, Settings, BarChart3 } from 'lucide-react';

const DEFAULT_CONFIG = {
  POP_SIZE: 60,
  MUTATION_RATE: 0.1,
  CROSSOVER_RATE: 0.85,
  GENE_MIN: -5,
  GENE_MAX: 12,
  TOURNAMENT_SIZE: 3,
  ELITE_COUNT: 2,
  MAX_GENERATIONS: 500,
};

function targetFn(x) {
  return Math.sin(x) + 0.5 * Math.sin(2.7 * x + 0.5) + 0.3 * Math.sin(5.1 * x + 1.2);
}

function initPop(config) {
  return Array.from({ length: config.POP_SIZE }, () => ({
    genes: [config.GENE_MIN + Math.random() * (config.GENE_MAX - config.GENE_MIN)],
  }));
}

function evalPop(pop) {
  pop.forEach(ind => { ind.fitness = targetFn(ind.genes[0]) + 2.5; });
  return pop;
}

function selectTournament(pop, config) {
  let best = null, bestF = -Infinity;
  for (let i = 0; i < config.TOURNAMENT_SIZE; i++) {
    const ind = pop[Math.floor(Math.random() * pop.length)];
    if (ind.fitness > bestF) { bestF = ind.fitness; best = ind; }
  }
  return { ...best };
}

function selectRoulette(pop) {
  const totalFit = pop.reduce((s, ind) => s + ind.fitness, 0);
  let r = Math.random() * totalFit;
  for (const ind of pop) {
    r -= ind.fitness;
    if (r <= 0) return { ...ind };
  }
  return { ...pop[pop.length - 1] };
}

function crossoverArithmetic(a, b, config) {
  if (Math.random() < config.CROSSOVER_RATE) {
    const t = Math.random();
    return [
      { genes: [t * a.genes[0] + (1 - t) * b.genes[0]] },
      { genes: [(1 - t) * a.genes[0] + t * b.genes[0]] },
    ];
  }
  return [{ ...a }, { ...b }];
}

function crossoverUniform(a, b, config) {
  if (Math.random() < config.CROSSOVER_RATE) {
    return Math.random() < 0.5
      ? [{ ...a }, { ...b }]
      : [{ ...b }, { ...a }];
  }
  return [{ ...a }, { ...b }];
}

function crossoverSinglePoint(a, b, config) {
  return crossoverArithmetic(a, b, config);
}

function mutateGaussian(ind, config) {
  if (Math.random() < config.MUTATION_RATE) {
    const x = ind.genes[0] + (Math.random() - 0.5) * 1.0;
    return { genes: [Math.max(config.GENE_MIN, Math.min(config.GENE_MAX, x))] };
  }
  return ind;
}

function mutateUniform(ind, config) {
  if (Math.random() < config.MUTATION_RATE) {
    return { genes: [config.GENE_MIN + Math.random() * (config.GENE_MAX - config.GENE_MIN)] };
  }
  return ind;
}

function evolveOnce(pop, config, selectionFn, crossoverFn, mutationFn) {
  evalPop(pop);
  pop.sort((a, b) => b.fitness - a.fitness);
  const next = pop.slice(0, config.ELITE_COUNT).map(e => ({ ...e }));
  while (next.length < config.POP_SIZE) {
    const [c1, c2] = crossoverFn(selectionFn(pop, config), selectionFn(pop, config), config);
    next.push(mutationFn(c1, config));
    if (next.length < config.POP_SIZE) next.push(mutationFn(c2, config));
  }
  return evalPop(next.slice(0, config.POP_SIZE));
}

export default function GeneticAlgorithmDemo() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);
  const [selectionMethod, setSelectionMethod] = useState('tournament');
  const [crossoverMethod, setCrossoverMethod] = useState('arithmetic');
  const [mutationMethod, setMutationMethod] = useState('gaussian');

  const selectionMap = { tournament: selectTournament, roulette: selectRoulette };
  const crossoverMap = { arithmetic: crossoverArithmetic, uniform: crossoverUniform, single_point: crossoverSinglePoint };
  const mutationMap = { gaussian: mutateGaussian, uniform: mutateUniform };

  const gaRef = useRef({
    population: evalPop(initPop(DEFAULT_CONFIG)),
    generation: 0,
    running: false,
    history: [],
    avgHistory: [],
    diversityHistory: [],
  });

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [genD, setGenD] = useState(0);
  const [converged, setConverged] = useState(false);

  const getStats = useCallback(() => {
    const pop = gaRef.current.population;
    const fits = pop.map(p => p.fitness);
    const best = Math.max(...fits);
    const avg = fits.reduce((a, b) => a + b, 0) / fits.length;
    const bestInd = pop.reduce((a, b) => a.fitness > b.fitness ? a : b, pop[0]);
    const vals = pop.map(p => p.genes[0]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    const diversity = Math.sqrt(variance);
    return { best, avg, diversity, bestX: bestInd.genes[0] };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const { GENE_MIN, GENE_MAX } = config;
    const pad = { t: 32, b: 36, l: 56, r: 24 };
    const pw = w - pad.l - pad.r;
    const ph = h - pad.t - pad.b;
    const yMin = -1.9;
    const yMax = 2.0;

    const toX = (x) => pad.l + ((x - GENE_MIN) / (GENE_MAX - GENE_MIN)) * pw;
    const toY = (y) => pad.t + ((yMax - y) / (yMax - yMin)) * ph;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#080b16';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = pad.l + (i / 10) * pw;
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = pad.t + (i / 8) * ph;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + pw, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t + ph / 2); ctx.lineTo(pad.l + pw, pad.t + ph / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ph); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 8; i++) {
      const x = GENE_MIN + (i / 8) * (GENE_MAX - GENE_MIN);
      ctx.fillText(x.toFixed(1), toX(x), pad.t + ph + 8);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 6; i++) {
      const y = yMin + (i / 6) * (yMax - yMin);
      ctx.fillText(y.toFixed(1), pad.l - 8, toY(y));
    }

    // Function curve
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = GENE_MIN + (i / 300) * (GENE_MAX - GENE_MIN);
      const y = targetFn(x);
      if (i === 0) ctx.moveTo(toX(x), toY(y));
      else ctx.lineTo(toX(x), toY(y));
    }
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const lastX = GENE_MIN + 1 * (GENE_MAX - GENE_MIN);
    ctx.lineTo(toX(lastX), pad.t + ph);
    ctx.lineTo(toX(GENE_MIN), pad.t + ph);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ph);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Population dots
    const pop = gaRef.current.population;
    const fits = pop.map(p => p.fitness);
    const bestF = Math.max(...fits);
    const worstF = Math.min(...fits);
    const fRange = bestF - worstF || 1;

    pop.forEach(ind => {
      const x = ind.genes[0];
      const y = targetFn(x);
      const cx = toX(x);
      const cy = toY(y);
      const ratio = (ind.fitness - worstF) / fRange;
      const r = Math.round(180 * (1 - ratio) + 30);
      const g = Math.round(180 * ratio + 40);
      const b = 30;
      ctx.beginPath();
      ctx.arc(cx, cy, 4 + ratio * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
      ctx.fill();
    });

    const bestInd = pop.reduce((a, b) => a.fitness > b.fitness ? a : b, pop[0]);
    if (bestInd) {
      const bx = toX(bestInd.genes[0]);
      const by = toY(targetFn(bestInd.genes[0]));
      const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 22);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }

    // Stats
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Generación ${gaRef.current.generation}`, pad.l + 10, pad.t + 8);
    if (bestInd) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`★ Mejor: x = ${bestInd.genes[0].toFixed(4)}`, pad.l + 10, pad.t + 28);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.fillText(`f(x) = ${(bestInd.fitness - 2.5).toFixed(4)}`, pad.l + 10, pad.t + 44);
    }
    const avg = fits.reduce((a, b) => a + b, 0) / fits.length;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Población: ${config.POP_SIZE}`, pad.l + pw - 8, pad.t + 8);
    ctx.fillText(`Fit prom: ${(avg - 2.5).toFixed(4)}`, pad.l + pw - 8, pad.t + 24);

    // Fitness chart
    const history = gaRef.current.history;
    const chartH = 40;
    const chartY = h - chartH - 8;
    const chartW = w - pad.l - pad.r;
    const chartX = pad.l;

    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.beginPath();
    ctx.roundRect(chartX, chartY, chartW, chartH, 6);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('Evolución del fitness', chartX + 6, chartY + 4);

    if (history.length >= 2) {
      const minF = Math.min(...history);
      const maxF = Math.max(...history);
      const fR = maxF - minF || 1;
      const plotL = chartX + 6;
      const plotR = chartX + chartW - 6;
      const plotW = plotR - plotL;
      const plotT = chartY + 16;
      const plotB = chartY + chartH - 6;
      const plotH = plotB - plotT;

      ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const x = plotL + (i / (history.length - 1)) * plotW;
        const y = plotT + ((maxF - history[i]) / fR) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [config]);

  const step = useCallback(() => {
    const ga = gaRef.current;
    if (!ga.running) return;
    const sel = selectionMap[selectionMethod] || selectTournament;
    const cross = crossoverMap[crossoverMethod] || crossoverArithmetic;
    const mut = mutationMap[mutationMethod] || mutateGaussian;
    ga.population = evolveOnce(ga.population, config, sel, cross, mut);
    ga.generation++;
    const fits = ga.population.map(p => p.fitness);
    ga.history.push(Math.max(...fits));
    ga.avgHistory.push(fits.reduce((a, b) => a + b, 0) / fits.length);

    const vals = ga.population.map(p => p.genes[0]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    ga.diversityHistory.push(Math.sqrt(variance));

    if (ga.history.length > config.MAX_GENERATIONS) ga.history.shift();
    if (ga.avgHistory.length > config.MAX_GENERATIONS) ga.avgHistory.shift();

    if (ga.history.length > 20) {
      const recent = ga.history.slice(-20);
      const stable = Math.abs(recent[recent.length - 1] - recent[0]) < 0.001;
      if (stable && ga.generation > 30) {
        setConverged(true);
      }
    }

    setGenD(ga.generation);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [config, draw, selectionMethod, crossoverMethod, mutationMethod]);

  const toggleRun = useCallback(() => {
    const ga = gaRef.current;
    ga.running = !ga.running;
    setRunning(ga.running);
    setConverged(false);
  }, []);

  const reset = useCallback(() => {
    const ga = gaRef.current;
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    ga.population = evalPop(initPop(config));
    ga.generation = 0;
    ga.running = false;
    ga.history = [];
    ga.avgHistory = [];
    ga.diversityHistory = [];
    setRunning(false);
    setGenD(0);
    setConverged(false);
    requestAnimationFrame(draw);
  }, [config, draw]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(step, 1000 / speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, speed, step]);

  useEffect(() => {
    draw();
    const onResize = () => requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  const stats = getStats();

  return (
    <div ref={containerRef} className="glass-panel rounded-2xl overflow-hidden border border-white/6">
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-400" />
              Algoritmo Genético en Vivo
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Población: {config.POP_SIZE} | Mutación: {(config.MUTATION_RATE * 100).toFixed(0)}% | {selectionMethod === 'tournament' ? 'Torneo' : 'Ruleta'}
            </p>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" /> Configurar
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="mx-6 mb-4 p-4 rounded-xl bg-white/3 border border-white/6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Parámetros del Algoritmo</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Población</label>
              <input type="range" min={10} max={200} value={config.POP_SIZE}
                onChange={e => { setConfig(c => ({ ...c, POP_SIZE: +e.target.value })); reset(); }}
                className="w-full" />
              <span className="text-xs text-slate-400">{config.POP_SIZE}</span>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Mutación</label>
              <input type="range" min={0} max={50} value={config.MUTATION_RATE * 100}
                onChange={e => { setConfig(c => ({ ...c, MUTATION_RATE: +e.target.value / 100 })); }}
                className="w-full" />
              <span className="text-xs text-slate-400">{(config.MUTATION_RATE * 100).toFixed(0)}%</span>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Cruce</label>
              <input type="range" min={0} max={100} value={config.CROSSOVER_RATE * 100}
                onChange={e => { setConfig(c => ({ ...c, CROSSOVER_RATE: +e.target.value / 100 })); }}
                className="w-full" />
              <span className="text-xs text-slate-400">{(config.CROSSOVER_RATE * 100).toFixed(0)}%</span>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Elitismo</label>
              <input type="range" min={0} max={10} value={config.ELITE_COUNT}
                onChange={e => { setConfig(c => ({ ...c, ELITE_COUNT: +e.target.value })); }}
                className="w-full" />
              <span className="text-xs text-slate-400">{config.ELITE_COUNT}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Selección</label>
              <select value={selectionMethod} onChange={e => setSelectionMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <option value="tournament">Torneo</option>
                <option value="roulette">Ruleta</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Cruce</label>
              <select value={crossoverMethod} onChange={e => setCrossoverMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <option value="arithmetic">Aritmético</option>
                <option value="uniform">Uniforme</option>
                <option value="single_point">1-Punto</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Mutación</label>
              <select value={mutationMethod} onChange={e => setMutationMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <option value="gaussian">Gaussiana</option>
                <option value="uniform">Uniforme</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="px-6">
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl"
          style={{ aspectRatio: '21/9', display: 'block' }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3 px-6 py-4">
        {[
          { label: 'Mejor x', value: stats.bestX.toFixed(4), color: 'text-amber-400' },
          { label: 'Fitness máximo', value: (stats.best - 2.5).toFixed(4), color: 'text-green-400' },
          { label: 'Fitness promedio', value: (stats.avg - 2.5).toFixed(4), color: 'text-indigo-400' },
          { label: 'Diversidad', value: stats.diversity.toFixed(4), color: 'text-cyan-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card text-center">
            <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
            <div className="text-[11px] text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 pt-1 flex flex-wrap items-center gap-4">
        <button onClick={toggleRun}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            running
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'btn-gradient text-white'
          }`}>
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-ghost cursor-pointer">
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
        {converged && (
          <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            ⚡ Convergencia detectada
          </span>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-500 font-medium">Velocidad</span>
          <input type="range" min={1} max={20} value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))} className="w-24" />
          <span className="text-xs text-slate-400 font-mono w-8">{speed}x</span>
        </div>
      </div>
    </div>
  );
}

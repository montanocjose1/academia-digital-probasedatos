import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Dna, Trophy, Zap } from 'lucide-react';

const CONFIG = {
  POP_SIZE: 60,
  MUTATION_RATE: 0.1,
  CROSSOVER_RATE: 0.85,
  GENE_MIN: -5,
  GENE_MAX: 12,
  TOURNAMENT_SIZE: 3,
  ELITE_COUNT: 2,
};

function targetFn(x) {
  return Math.sin(x) + 0.5 * Math.sin(2.7 * x + 0.5) + 0.3 * Math.sin(5.1 * x + 1.2);
}

function initPop() {
  return Array.from({ length: CONFIG.POP_SIZE }, () => ({
    genes: [CONFIG.GENE_MIN + Math.random() * (CONFIG.GENE_MAX - CONFIG.GENE_MIN)],
  }));
}

function evalPop(pop) {
  pop.forEach(ind => { ind.fitness = targetFn(ind.genes[0]) + 2.5; });
  return pop;
}

function select(pop) {
  let best = null, bestF = -Infinity;
  for (let i = 0; i < CONFIG.TOURNAMENT_SIZE; i++) {
    const ind = pop[Math.floor(Math.random() * pop.length)];
    if (ind.fitness > bestF) { bestF = ind.fitness; best = ind; }
  }
  return { ...best };
}

function crossover(a, b) {
  if (Math.random() < CONFIG.CROSSOVER_RATE) {
    const t = Math.random();
    return [
      { genes: [t * a.genes[0] + (1 - t) * b.genes[0]] },
      { genes: [(1 - t) * a.genes[0] + t * b.genes[0]] },
    ];
  }
  return [{ ...a }, { ...b }];
}

function mutate(ind) {
  if (Math.random() < CONFIG.MUTATION_RATE) {
    const x = ind.genes[0] + (Math.random() - 0.5) * 1.0;
    return { genes: [Math.max(CONFIG.GENE_MIN, Math.min(CONFIG.GENE_MAX, x))] };
  }
  return ind;
}

function evolveOnce(pop) {
  evalPop(pop);
  pop.sort((a, b) => b.fitness - a.fitness);
  const next = pop.slice(0, CONFIG.ELITE_COUNT).map(e => ({ ...e, fitness: e.fitness }));
  while (next.length < CONFIG.POP_SIZE) {
    const [c1, c2] = crossover(select(pop), select(pop));
    next.push(mutate(c1));
    if (next.length < CONFIG.POP_SIZE) next.push(mutate(c2));
  }
  return evalPop(next.slice(0, CONFIG.POP_SIZE));
}

export default function GeneticAlgorithmDemo() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);

  const gaRef = useRef({
    population: evalPop(initPop()),
    generation: 0,
    running: false,
    history: [],
  });

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [genD, setGenD] = useState(0);

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

    const { GENE_MIN, GENE_MAX } = CONFIG;
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
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t + ph / 2); ctx.lineTo(pad.l + pw, pad.t + ph / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ph); ctx.stroke();

    // X labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 8; i++) {
      const x = GENE_MIN + (i / 8) * (GENE_MAX - GENE_MIN);
      ctx.fillText(x.toFixed(1), toX(x), pad.t + ph + 8);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText('x', pad.l + pw + 8, pad.t + ph + 8);

    // Y labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px Inter, sans-serif';
    for (let i = 0; i <= 6; i++) {
      const y = yMin + (i / 6) * (yMax - yMin);
      ctx.fillText(y.toFixed(1), pad.l - 8, toY(y));
    }
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('f(x)', pad.l, pad.t - 4);

    // Function curve
    ctx.beginPath();
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const x = GENE_MIN + (i / steps) * (GENE_MAX - GENE_MIN);
      const y = targetFn(x);
      if (i === 0) ctx.moveTo(toX(x), toY(y));
      else ctx.lineTo(toX(x), toY(y));
    }
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under curve
    const lastI = steps;
    const lastX = GENE_MIN + (lastI / steps) * (GENE_MAX - GENE_MIN);
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
      const b = Math.round(60 * (1 - ratio) + 30);
      ctx.beginPath();
      ctx.arc(cx, cy, 4 + ratio * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Best individual highlight
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
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Stats overlay
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
    ctx.fillText(`Población: ${CONFIG.POP_SIZE} individuos`, pad.l + pw - 8, pad.t + 8);
    ctx.fillText(`Fit promedio: ${(avg - 2.5).toFixed(4)}`, pad.l + pw - 8, pad.t + 24);

    // Draw fitness chart
    drawChart(ctx, w, h, pad);
  }, []);

  const drawChart = (ctx, w, h, pad) => {
    const history = gaRef.current.history;
    const chartH = 40;
    const chartY = h - chartH - 8;
    const chartW = w - pad.l - pad.r;
    const chartX = pad.l;

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.beginPath();
    ctx.roundRect(chartX, chartY, chartW, chartH, 6);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mejor fitness por generación', chartX + 6, chartY + 4);

    if (history.length < 2) return;

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

    const lastX = plotL + plotW;
    const lastY = plotT + ((maxF - history[history.length - 1]) / fR) * plotH;
    ctx.lineTo(lastX, plotB);
    ctx.lineTo(chartX + 6, plotB);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, plotT, 0, plotB);
    g.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
    g.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = g;
    ctx.fill();
  };

  const step = useCallback(() => {
    const ga = gaRef.current;
    if (!ga.running) return;
    ga.population = evolveOnce(ga.population);
    ga.generation++;
    const fits = ga.population.map(p => p.fitness);
    ga.history.push(Math.max(...fits));
    if (ga.history.length > 200) ga.history.shift();
    setGenD(ga.generation);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const toggleRun = useCallback(() => {
    const ga = gaRef.current;
    ga.running = !ga.running;
    setRunning(ga.running);
  }, []);

  const reset = useCallback(() => {
    const ga = gaRef.current;
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    ga.population = evalPop(initPop());
    ga.generation = 0;
    ga.running = false;
    ga.history = [];
    setRunning(false);
    setGenD(0);
    requestAnimationFrame(draw);
  }, [draw]);

  // Timer effect
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(step, 1000 / speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, speed, step]);

  // Init + resize
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
              Observa cómo la población evoluciona hacia el máximo global de la función
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl"
          style={{ aspectRatio: '21/9', display: 'block' }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3 px-6 py-4">
        {[
          { label: 'Mejor x', value: stats.bestX.toFixed(4), icon: Trophy, color: 'text-amber-400' },
          { label: 'Fitness máximo', value: (stats.best - 2.5).toFixed(4), icon: Zap, color: 'text-green-400' },
          { label: 'Fitness promedio', value: (stats.avg - 2.5).toFixed(4), icon: null, color: 'text-indigo-400' },
          { label: 'Diversidad', value: stats.diversity.toFixed(4), icon: null, color: 'text-cyan-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card text-center">
            {Icon && <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />}
            <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
            <div className="text-[11px] text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 pt-1 flex flex-wrap items-center gap-4">
        <button
          onClick={toggleRun}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            running
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              : 'btn-gradient text-white'
          }`}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pausar' : 'Iniciar'}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold btn-ghost cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-500 font-medium">Velocidad</span>
          <input
            type="range"
            min={1}
            max={20}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-400 font-mono w-8">{speed}x</span>
        </div>
      </div>
    </div>
  );
}

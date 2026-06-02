import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, PlayCircle, CheckCircle, Clock, Award,
  ChevronRight, ChevronDown, ChevronUp, Lock, BarChart2,
  GraduationCap, Star, Search
} from 'lucide-react';

// Mock enrolled courses with full curriculum
const ENROLLED = [
  {
    _id: '1',
    title: 'React & Node.js: Full Stack desde Cero',
    instructor: 'Carlos Méndez',
    progress: 68,
    color: 'from-indigo-900 to-purple-900',
    totalLessons: 12,
    completedLessons: 8,
    duration: '42h',
    lastLesson: 'useContext y useRef',
    rating: 4.9,
    modules: [
      { id: 1, title: 'Fundamentos de React', lessons: [
        { id: 1, title: 'Introducción al curso', duration: '5:20', done: true },
        { id: 2, title: '¿Qué es React?', duration: '8:15', done: true },
        { id: 3, title: 'JSX y componentes', duration: '12:40', done: true },
        { id: 4, title: 'Props y State', duration: '18:00', done: true },
      ]},
      { id: 2, title: 'Hooks modernos', lessons: [
        { id: 5, title: 'useState y useEffect', duration: '22:30', done: true },
        { id: 6, title: 'useContext y useRef', duration: '18:45', done: true },
        { id: 7, title: 'Custom Hooks', duration: '25:10', done: false },
      ]},
      { id: 3, title: 'Backend con Node.js', lessons: [
        { id: 8, title: 'Express y rutas', duration: '20:00', done: false },
        { id: 9, title: 'Middleware y auth', duration: '30:15', done: false },
      ]},
    ],
  },
  {
    _id: '2',
    title: 'Python para Data Science',
    instructor: 'Ana Rodríguez',
    progress: 32,
    color: 'from-cyan-900 to-blue-900',
    totalLessons: 8,
    completedLessons: 3,
    duration: '38h',
    lastLesson: 'NumPy básico',
    rating: 4.8,
    modules: [
      { id: 1, title: 'Python Fundamentals', lessons: [
        { id: 1, title: 'Intro a Python', duration: '6:00', done: true },
        { id: 2, title: 'Variables y tipos', duration: '10:00', done: true },
        { id: 3, title: 'Control de flujo', duration: '14:00', done: true },
        { id: 4, title: 'Funciones', duration: '18:00', done: false },
      ]},
      { id: 2, title: 'Data Science con NumPy', lessons: [
        { id: 5, title: 'NumPy básico', duration: '20:00', done: false },
        { id: 6, title: 'Pandas DataFrames', duration: '25:00', done: false },
      ]},
    ],
  },
  {
    _id: '6',
    title: 'JavaScript Moderno: ES6+',
    instructor: 'Daniel Cruz',
    progress: 100,
    color: 'from-yellow-900 to-orange-900',
    totalLessons: 10,
    completedLessons: 10,
    duration: '35h',
    lastLesson: 'TypeScript avanzado',
    rating: 4.8,
    modules: [
      { id: 1, title: 'ES6+ Moderno', lessons: [
        { id: 1, title: 'Arrow functions', duration: '8:00', done: true },
        { id: 2, title: 'Destructuring', duration: '10:00', done: true },
        { id: 3, title: 'Promises y Async/Await', duration: '15:00', done: true },
      ]},
    ],
  },
];

function ModuleAccordion({ module }) {
  const [open, setOpen] = useState(false);
  const done = module.lessons.filter((l) => l.done).length;

  return (
    <div className="accordion-item">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          {done === module.lessons.length
            ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            : <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex-shrink-0"></div>
          }
          <span className="text-sm font-semibold text-white">{module.title}</span>
          <span className="text-xs text-slate-600">{done}/{module.lessons.length}</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
      </button>

      {open && (
        <div className="border-t border-white/5 divide-y divide-white/5">
          {module.lessons.map((l) => (
            <div key={l.id} className="flex items-center gap-3 px-4 py-2.5">
              {l.done
                ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                : <PlayCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
              }
              <span className={`flex-1 text-xs ${l.done ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                {l.title}
              </span>
              <span className="text-xs text-slate-600">{l.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(course)}
      className={`glass-card rounded-2xl p-4 cursor-pointer transition-all ${selected ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}
    >
      <div className={`h-20 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-3 relative`}>
        <BookOpen className="w-7 h-7 text-white/30" />
        {course.progress === 100 && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <h3 className="font-display font-semibold text-white text-xs line-clamp-2 mb-1.5">{course.title}</h3>
      <div className="progress-bar mb-1">
        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
        <span className={course.progress === 100 ? 'text-green-400 font-bold' : 'font-bold text-white'}>
          {course.progress}%
        </span>
      </div>
    </div>
  );
}

export default function LearningDashboard() {
  const [selectedCourse, setSelectedCourse] = useState(ENROLLED[0]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = ENROLLED.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'completed' ? c.progress === 100 : c.progress < 100;
    return matchSearch && matchFilter;
  });

  const totalCompleted = ENROLLED.filter((c) => c.progress === 100).length;
  const avgProgress = Math.round(ENROLLED.reduce((s, c) => s + c.progress, 0) / ENROLLED.length);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="bg-[#050810] border-b border-white/5 py-10">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-1">Mi Aprendizaje</h1>
              <p className="text-slate-400 text-sm">{ENROLLED.length} cursos inscritos · {totalCompleted} completados</p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              {[
                { icon: GraduationCap, label: 'Completados', value: totalCompleted, color: 'text-green-400' },
                { icon: BarChart2, label: 'Progreso promedio', value: `${avgProgress}%`, color: 'text-indigo-400' },
                { icon: Award, label: 'Certificados', value: totalCompleted, color: 'text-amber-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="stat-card text-center min-w-[80px]">
                  <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                  <div className="font-display font-bold text-lg text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar — course list */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Search + filter */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar mis cursos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 text-sm py-2.5"
                />
              </div>
              <div className="flex gap-1 p-1 bg-white/4 rounded-xl">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'in-progress', label: 'En curso' },
                  { id: 'completed', label: '✓ Listos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`tab-btn flex-1 text-xs ${filter === f.id ? 'active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onSelect={setSelectedCourse}
                  selected={selectedCourse?._id === course._id}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No se encontraron cursos.
                </div>
              )}
            </div>

            <div className="mt-5">
              <Link
                to="/courses"
                className="btn-outline w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                Explorar más cursos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>

          {/* Main — course player & curriculum */}
          {selectedCourse ? (
            <div className="flex-1 min-w-0 animate-fade-in">
              {/* Video player */}
              <div className={`rounded-3xl bg-gradient-to-br ${selectedCourse.color} overflow-hidden mb-6 aspect-video flex flex-col items-center justify-center relative`}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 hover:bg-white/20 transition-all cursor-pointer">
                    <PlayCircle className="w-9 h-9 text-white" />
                  </div>
                  <p className="text-white/70 text-sm">Continuar: <span className="text-white font-medium">{selectedCourse.lastLesson}</span></p>
                </div>

                {/* Top info */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="badge-primary text-xs">{selectedCourse.instructor}</span>
                  {selectedCourse.progress === 100 && (
                    <span className="badge-success">✓ Completado</span>
                  )}
                </div>
              </div>

              {/* Course info */}
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-white mb-2">{selectedCourse.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> {selectedCourse.duration}</span>
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {selectedCourse.rating}</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> {selectedCourse.completedLessons}/{selectedCourse.totalLessons} completadas</span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Tu progreso</span>
                    <span className="font-bold text-white">{selectedCourse.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedCourse.progress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Curriculum accordion */}
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-4">Contenido del curso</h3>
                <div className="space-y-2">
                  {selectedCourse.modules.map((mod) => (
                    <ModuleAccordion key={mod.id} module={mod} />
                  ))}
                </div>
              </div>

              {/* Certificate */}
              {selectedCourse.progress === 100 && (
                <div className="mt-8 glass-panel rounded-3xl p-6 border border-green-500/20 text-center">
                  <Award className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-xl text-white mb-1">¡Curso completado!</h3>
                  <p className="text-slate-400 text-sm mb-5">Ya puedes descargar tu certificado verificado.</p>
                  <button className="btn-gradient text-white font-semibold px-8 py-3 rounded-2xl inline-flex items-center gap-2 cursor-pointer">
                    <Award className="w-4 h-4" /> Descargar certificado
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Selecciona un curso para continuar.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
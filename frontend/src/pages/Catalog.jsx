import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Search, Filter, BookOpen, Star, Users, X,
  ShoppingCart, CheckCircle, SlidersHorizontal, ChevronRight
} from 'lucide-react';
import StarRating from '../components/Common/StarRating';
import CourseCard from '../components/Course/CourseCard';

// — Mock courses for demo —
const ALL_COURSES = [
  { _id: '1', title: 'React & Node.js: Full Stack desde Cero', instructor: 'Carlos Méndez', price: 49.99, rating: 4.9, students: 3241, category: 'Desarrollo Web', level: 'Intermedio', color: 'from-indigo-900 to-purple-900', duration: '42h', lessons: 120 },
  { _id: '2', title: 'Python para Data Science e Inteligencia Artificial', instructor: 'Ana Rodríguez', price: 59.99, rating: 4.8, students: 2187, category: 'Data Science', level: 'Principiante', color: 'from-cyan-900 to-blue-900', duration: '38h', lessons: 95 },
  { _id: '3', title: 'UI/UX Design: De Wireframe a Prototipo', instructor: 'Luis García', price: 39.99, rating: 4.7, students: 1854, category: 'Diseño', level: 'Principiante', color: 'from-rose-900 to-pink-900', duration: '28h', lessons: 76 },
  { _id: '4', title: 'DevOps & Cloud con AWS y Docker', instructor: 'Miguel Torres', price: 69.99, rating: 4.9, students: 1122, category: 'DevOps', level: 'Avanzado', color: 'from-orange-900 to-amber-900', duration: '55h', lessons: 145 },
  { _id: '5', title: 'Marketing Digital y Growth Hacking', instructor: 'Sofía Lima', price: 34.99, rating: 4.6, students: 4320, category: 'Marketing', level: 'Principiante', color: 'from-green-900 to-emerald-900', duration: '22h', lessons: 58 },
  { _id: '6', title: 'JavaScript Moderno: ES6+ y TypeScript', instructor: 'Daniel Cruz', price: 44.99, rating: 4.8, students: 2890, category: 'Desarrollo Web', level: 'Intermedio', color: 'from-yellow-900 to-orange-900', duration: '35h', lessons: 88 },
  { _id: '7', title: 'Machine Learning con TensorFlow', instructor: 'Patricia Vargas', price: 74.99, rating: 4.9, students: 980, category: 'Data Science', level: 'Avanzado', color: 'from-teal-900 to-cyan-900', duration: '60h', lessons: 160 },
  { _id: '8', title: 'Finanzas Personales e Inversiones', instructor: 'Roberto Soto', price: 29.99, rating: 4.7, students: 5100, category: 'Finanzas', level: 'Principiante', color: 'from-lime-900 to-green-900', duration: '18h', lessons: 48 },
  { _id: '9', title: 'Fotografía Profesional con Smartphone', instructor: 'Elena Ruiz', price: 24.99, rating: 4.5, students: 3670, category: 'Arte y Creatividad', level: 'Principiante', color: 'from-fuchsia-900 to-purple-900', duration: '15h', lessons: 40 },
  { _id: '10', title: 'Kubernetes y Microservicios en Producción', instructor: 'Javier Mora', price: 79.99, rating: 4.9, students: 730, category: 'DevOps', level: 'Avanzado', color: 'from-sky-900 to-blue-900', duration: '50h', lessons: 130 },
  { _id: '11', title: 'Diseño Gráfico con Figma', instructor: 'Camila Flores', price: 32.99, rating: 4.6, students: 2200, category: 'Diseño', level: 'Principiante', color: 'from-pink-900 to-rose-900', duration: '24h', lessons: 65 },
  { _id: '12', title: 'SEO Avanzado: Domina Google en 2026', instructor: 'Andrés Leal', price: 44.99, rating: 4.7, students: 1890, category: 'Marketing', level: 'Intermedio', color: 'from-violet-900 to-indigo-900', duration: '30h', lessons: 80 },
];

const CATEGORIES = ['Todos', 'Desarrollo Web', 'Data Science', 'Diseño', 'DevOps', 'Marketing', 'Finanzas', 'Arte y Creatividad'];
const LEVELS = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Más populares' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más nuevos' },
];


export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(100);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filtered = ALL_COURSES
    .filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'Todos' || c.category === selectedCategory;
      const matchLevel = selectedLevel === 'Todos' || c.level === selectedLevel;
      const matchPrice = c.price <= priceRange;
      return matchSearch && matchCat && matchLevel && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.students - a.students;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('Todos');
    setSelectedLevel('Todos');
    setPriceRange(100);
    setSortBy('popular');
  };

  const hasFilters = search || selectedCategory !== 'Todos' || selectedLevel !== 'Todos' || priceRange < 100;

  return (
    <div className="page-wrapper">
      {/* Hero header */}
      <div className="bg-[#050810] border-b border-white/5 py-12">
        <div className="container-xl">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Catálogo de Cursos
          </h1>
          <p className="text-slate-400 mb-6">
            {ALL_COURSES.length} cursos disponibles · Aprende de los mejores expertos
          </p>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar cursos, instructores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${showFilters ? 'border-indigo-500/40 text-indigo-400' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filtros
              {hasFilters && <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="flex gap-8">

          {/* Sidebar filters — desktop */}
          <aside className={`w-64 flex-shrink-0 hidden lg:block`}>
            <div className="glass-panel rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-white text-sm">Filtros</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-indigo-400 hover:underline">
                    Limpiar
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Categoría</h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'text-indigo-400 bg-indigo-500/10 font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-white/4'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Nivel</h4>
                <div className="space-y-1">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        selectedLevel === lvl
                          ? 'text-indigo-400 bg-indigo-500/10 font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-white/4'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Precio máx: <span className="text-white">${priceRange}</span>
                </h4>
                <input
                  type="range" min="10" max="100" value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>$10</span><span>$100</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden glass-panel rounded-2xl p-5 mb-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Categoría</h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-field text-xs"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Nivel</h4>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="input-field text-xs"
                    >
                      {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-400">
                <span className="text-white font-semibold">{filtered.length}</span> cursos encontrados
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto text-sm py-2 px-3"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((course) => (
                  <CourseCard key={course._id} course={course} showAddToCart={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-white mb-2">No se encontraron cursos</h3>
                <p className="text-sm text-slate-500 mb-6">Intenta con otros filtros o términos de búsqueda.</p>
                <button onClick={clearFilters} className="btn-outline px-5 py-2.5 rounded-xl text-sm font-medium">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
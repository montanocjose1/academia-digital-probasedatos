import { Link } from 'react-router-dom';
import {
  BookOpen, ArrowRight, Star, Users, PlayCircle,
  Zap, Shield, Award, TrendingUp, ChevronRight
} from 'lucide-react';
import StarRating from '../components/Common/StarRating';
import Footer from '../components/Common/Footer';
import CourseCard from '../components/Course/CourseCard';

// — Mock data —
const FEATURED_COURSES = [
  {
    id: '1', title: 'React & Node.js: Full Stack desde Cero',
    instructor: 'Carlos Méndez', price: 49.99, rating: 4.9, students: 3241,
    category: 'Desarrollo Web', level: 'Intermedio',
    color: 'from-indigo-900 to-purple-900',
  },
  {
    id: '2', title: 'Python para Data Science e Inteligencia Artificial',
    instructor: 'Ana Rodríguez', price: 59.99, rating: 4.8, students: 2187,
    category: 'Data Science', level: 'Principiante',
    color: 'from-cyan-900 to-blue-900',
  },
  {
    id: '3', title: 'UI/UX Design: De Wireframe a Prototipo',
    instructor: 'Luis García', price: 39.99, rating: 4.7, students: 1854,
    category: 'Diseño', level: 'Principiante',
    color: 'from-rose-900 to-pink-900',
  },
  {
    id: '4', title: 'DevOps & Cloud con AWS y Docker',
    instructor: 'Miguel Torres', price: 69.99, rating: 4.9, students: 1122,
    category: 'DevOps', level: 'Avanzado',
    color: 'from-orange-900 to-amber-900',
  },
];

const STATS = [
  { label: 'Estudiantes', value: '50K+', icon: Users },
  { label: 'Cursos', value: '200+', icon: BookOpen },
  { label: 'Instructores', value: '80+', icon: Award },
  { label: 'Horas de contenido', value: '5,000+', icon: PlayCircle },
];

const FEATURES = [
  { icon: Zap, title: 'Aprende a tu ritmo', desc: 'Acceso de por vida a todos los cursos. Estudia cuando y donde quieras sin fechas límite.' },
  { icon: Shield, title: 'Garantía de calidad', desc: 'Todos los cursos son revisados por nuestro equipo editorial para asegurar el mejor contenido.' },
  { icon: Award, title: 'Certificados reales', desc: 'Obtén certificados verificables al completar tus cursos y compártelos en LinkedIn.' },
  { icon: TrendingUp, title: 'Contenido actualizado', desc: 'Los instructores actualizan continuamente el contenido para mantenerte al día con la industria.' },
];

const CATEGORIES = [
  { name: 'Desarrollo Web', icon: '💻', count: 45 },
  { name: 'Data Science', icon: '📊', count: 32 },
  { name: 'Diseño UI/UX', icon: '🎨', count: 28 },
  { name: 'Marketing Digital', icon: '📱', count: 24 },
  { name: 'Finanzas', icon: '💰', count: 19 },
  { name: 'DevOps & Cloud', icon: '☁️', count: 22 },
];



export default function Home() {
  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Background glows */}
        <div className="glow-orb w-[600px] h-[400px] bg-indigo-600/10 top-[-100px] left-[50%] translate-x-[-50%]" />
        <div className="glow-orb w-[300px] h-[300px] bg-purple-600/10 bottom-0 right-0" />

        <div className="container-xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 badge-primary mb-6 animate-fade-in-up">
            <Zap className="w-3 h-3" /> La plataforma educativa del futuro
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 animate-fade-in-up delay-100">
            Aprende las habilidades<br />
            <span className="gradient-text">que el mundo necesita</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Más de 200 cursos de alta calidad impartidos por expertos de la industria.
            Certificados verificables. Aprende a tu propio ritmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              to="/courses"
              className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 text-base"
            >
              Explorar Cursos <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="btn-ghost px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-base"
            >
              Empezar gratis <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 animate-fade-in-up delay-400">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="stat-card text-center">
                <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="font-display font-extrabold text-2xl text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="section">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="badge-primary mb-3">⭐ Más populares</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
                Cursos destacados
              </h2>
            </div>
            <Link to="/courses" className="btn-outline px-5 py-2.5 rounded-xl text-sm font-semibold hidden md:flex items-center gap-2">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/courses" className="btn-outline px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              Ver todos los cursos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section bg-[#050810]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="badge-primary mb-3">📚 Categorías</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Explora por área
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Encuentra el área que más te apasiona y domina las habilidades más demandadas del mercado laboral.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="glass-card rounded-2xl p-5 text-center group cursor-pointer"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-slate-500">{cat.count} cursos</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="badge-primary mb-4">¿Por qué elegirnos?</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">
                La mejor plataforma para impulsar tu carrera
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Diseñada por profesionales de la industria para profesionales del futuro.
                Ofrecemos la experiencia de aprendizaje más completa y efectiva.
              </p>

              <div className="space-y-6">
                {FEATURES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white mb-1">{title}</h3>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative hidden lg:block">
              <div className="glow-orb w-80 h-80 bg-indigo-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="glass-panel rounded-3xl p-8 relative z-10 animate-float">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">Certificado Digital</h3>
                  <p className="text-sm text-slate-400 mt-1">Verificado y compartible</p>
                </div>
                <div className="space-y-3">
                  {['React & Node.js Full Stack', 'Python Data Science', 'UI/UX Design Pro'].map((c, i) => (
                    <div key={c} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-slate-300 font-medium">{c}</span>
                      <span className="ml-auto badge-success">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-sm">
        <div className="container-xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-slate-900 border border-indigo-500/20 p-12 text-center">
            <div className="glow-orb w-64 h-64 bg-indigo-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg mx-auto">
                Únete a más de 50,000 estudiantes y transforma tu carrera profesional hoy mismo.
              </p>
              <Link
                to="/register"
                className="btn-gradient px-10 py-4 rounded-2xl text-white font-semibold text-base inline-flex items-center gap-2"
              >
                Comenzar ahora — es gratis <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

    </div>
  );
}
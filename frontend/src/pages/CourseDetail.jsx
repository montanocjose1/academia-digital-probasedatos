import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Star, Users, Clock, PlayCircle, ChevronDown,
  ChevronUp, ShoppingCart, CheckCircle, Award, Globe,
  Infinity, Download, Lock, ArrowLeft, Play, BarChart2
} from 'lucide-react';

// Mock data — in production this would be fetched from the API
const COURSE_DB = {
  '1': {
    _id: '1', title: 'React & Node.js: Full Stack desde Cero',
    instructor: 'Carlos Méndez', instructorBio: 'Ingeniero de Software con 10+ años de experiencia. Trabajó en startups y grandes empresas de Silicon Valley.',
    price: 49.99, rating: 4.9, students: 3241, category: 'Desarrollo Web', level: 'Intermedio',
    duration: '42h', lessons: 120, color: 'from-indigo-900 to-purple-900',
    description: 'Aprende a construir aplicaciones web completas usando React en el frontend y Node.js + Express en el backend. Desde las bases hasta deployment en producción con Docker.',
    whatYouLearn: [
      'Construir SPAs con React 19 y hooks modernos',
      'Crear APIs RESTful con Node.js y Express',
      'Conectar MongoDB con Mongoose',
      'Autenticación con JWT y sesiones',
      'Despliegue en AWS/Heroku con Docker',
      'Testing con Jest y React Testing Library',
    ],
    requirements: ['Conocimientos básicos de HTML, CSS y JavaScript', 'Computadora con Node.js instalado', 'Ganas de aprender'],
    modules: [
      { id: 1, title: 'Fundamentos de React', lessons: [
        { id: 1, title: 'Introducción al curso', duration: '5:20', free: true },
        { id: 2, title: '¿Qué es React?', duration: '8:15', free: true },
        { id: 3, title: 'JSX y componentes', duration: '12:40', free: false },
        { id: 4, title: 'Props y State', duration: '18:00', free: false },
      ]},
      { id: 2, title: 'Hooks modernos', lessons: [
        { id: 5, title: 'useState y useEffect', duration: '22:30', free: false },
        { id: 6, title: 'useContext y useRef', duration: '18:45', free: false },
        { id: 7, title: 'Custom Hooks', duration: '25:10', free: false },
      ]},
      { id: 3, title: 'Backend con Node.js', lessons: [
        { id: 8, title: 'Express y rutas', duration: '20:00', free: false },
        { id: 9, title: 'Middleware y autenticación', duration: '30:15', free: false },
        { id: 10, title: 'Base de datos con MongoDB', duration: '35:00', free: false },
      ]},
      { id: 4, title: 'Proyecto Final y Despliegue', lessons: [
        { id: 11, title: 'Construyendo el proyecto', duration: '45:00', free: false },
        { id: 12, title: 'Deploy con Docker', duration: '28:20', free: false },
      ]},
    ],
    reviews: [
      { id: 1, user: 'María González', avatar: 'M', rating: 5, comment: 'Excelente curso, muy completo y bien explicado. Carlos tiene una manera única de enseñar.', date: 'Hace 2 semanas' },
      { id: 2, user: 'Pedro Ramírez', avatar: 'P', rating: 5, comment: 'Pasé de saber solo HTML a construir aplicaciones full stack. Increíble.', date: 'Hace 1 mes' },
      { id: 3, user: 'Laura Díaz', avatar: 'L', rating: 4, comment: 'Muy bueno, aunque alguna sección podría tener más ejercicios prácticos.', date: 'Hace 2 meses' },
    ],
  },
};

// Default course data for routes not in mock DB
const DEFAULT_COURSE = {
  title: 'Curso Profesional', instructor: 'Instructor', price: 49.99, rating: 4.8,
  students: 1500, category: 'General', level: 'Principiante', duration: '30h', lessons: 80,
  color: 'from-indigo-900 to-purple-900',
  description: 'Un curso completo para dominar las habilidades más demandadas.',
  whatYouLearn: ['Conceptos fundamentales', 'Proyectos prácticos', 'Certificado al finalizar'],
  requirements: ['Ganas de aprender'],
  modules: [
    { id: 1, title: 'Introducción', lessons: [
      { id: 1, title: 'Bienvenida al curso', duration: '5:00', free: true },
      { id: 2, title: 'Configuración del entorno', duration: '10:00', free: false },
    ]},
  ],
  reviews: [],
};

function StarRating({ rating, size = 'sm' }) {
  const s = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <Star key={n} className={`${s} ${n <= Math.round(rating) ? 'star-filled fill-amber-400' : 'star-empty'}`} />
      ))}
    </div>
  );
}

function AccordionModule({ module, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-item">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h4 className="font-display font-semibold text-white text-sm">{module.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{module.lessons.length} lecciones</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-white/5 divide-y divide-white/5">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
              {lesson.free
                ? <Play className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                : <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
              }
              <span className={`flex-1 text-sm ${lesson.free ? 'text-slate-300' : 'text-slate-500'}`}>
                {lesson.title}
                {lesson.free && <span className="ml-2 badge-primary text-[10px]">Gratis</span>}
              </span>
              <span className="text-xs text-slate-600">{lesson.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const course = COURSE_DB[id] || { ...DEFAULT_COURSE, _id: id };
  const inCart = isInCart(course._id);

  const tabs = [
    { id: 'overview', label: 'Descripción' },
    { id: 'curriculum', label: 'Temario' },
    { id: 'reviews', label: `Reseñas (${course.reviews?.length ?? 0})` },
  ];

  return (
    <div className="page-wrapper">
      {/* Header hero */}
      <div className={`bg-gradient-to-br ${course.color} border-b border-white/5`}>
        <div className="container-xl py-12">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-primary">{course.category}</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                course.level === 'Principiante' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : course.level === 'Intermedio' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>{course.level}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-white/70 text-base mb-6 max-w-2xl">{course.description}</p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                <StarRating rating={course.rating} />
                <span className="font-bold text-amber-400">{course.rating}</span>
                <span className="text-white/40">({course.students.toLocaleString()} estudiantes)</span>
              </div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</div>
              <div className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> {course.lessons} lecciones</div>
              <div className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4" /> {course.level}</div>
            </div>

            <p className="text-sm text-white/50 mt-4">
              Instructor: <span className="text-white/80 font-medium">{course.instructor}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container-xl py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/4 rounded-xl mb-8 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in space-y-8">
                {/* What you'll learn */}
                <div className="glass-panel rounded-2xl p-6">
                  <h2 className="font-display font-bold text-xl text-white mb-5">Lo que aprenderás</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.whatYouLearn?.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-4">Requisitos</h2>
                  <ul className="space-y-2">
                    {course.requirements?.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-indigo-400 mt-0.5">•</span> {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-4">Tu instructor</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center font-bold text-xl text-white flex-shrink-0">
                      {course.instructor?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">{course.instructor}</h3>
                      <p className="text-xs text-indigo-400 mb-2">Experto en {course.category}</p>
                      <p className="text-sm text-slate-400">{course.instructorBio || 'Profesional con amplia experiencia en la industria.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="animate-fade-in space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-xl text-white">Contenido del curso</h2>
                  <span className="text-sm text-slate-500">{course.lessons} lecciones · {course.duration}</span>
                </div>
                {course.modules?.map((mod, i) => (
                  <AccordionModule key={mod.id} module={mod} defaultOpen={i === 0} />
                ))}
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="font-display font-extrabold text-6xl text-white">{course.rating}</div>
                    <StarRating rating={course.rating} size="lg" />
                    <div className="text-xs text-slate-500 mt-1">Calificación del curso</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.reviews?.length > 0 ? course.reviews.map((review) => (
                    <div key={review.id} className="glass-card rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-white flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">{review.user}</span>
                            <span className="text-xs text-slate-600">{review.date}</span>
                          </div>
                          <StarRating rating={review.rating} />
                          <p className="text-sm text-slate-400 mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-500">
                      <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>Aún no hay reseñas. ¡Sé el primero!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — purchase card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="glass-panel rounded-3xl overflow-hidden sticky top-24">
              {/* Preview thumb */}
              <div className={`course-thumb bg-gradient-to-br ${course.color} flex items-center justify-center`} style={{ borderRadius: 0 }}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm text-white/70">Vista previa disponible</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-display font-extrabold text-3xl text-white">${course.price}</span>
                  <span className="text-slate-500 line-through text-sm">${(course.price * 2).toFixed(0)}</span>
                  <span className="badge-success ml-auto">50% OFF</span>
                </div>

                <button
                  onClick={() => addToCart(course)}
                  disabled={inCart}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mb-3 transition-all cursor-pointer ${
                    inCart
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'btn-gradient text-white'
                  }`}
                >
                  {inCart
                    ? <><CheckCircle className="w-4 h-4" /> En el carrito</>
                    : <><ShoppingCart className="w-4 h-4" /> Agregar al carrito</>
                  }
                </button>

                {inCart && (
                  <Link to="/cart" className="block w-full py-3 rounded-2xl text-sm font-semibold text-center btn-outline mb-3">
                    Ir al carrito <ChevronDown className="inline w-3 h-3 rotate-[-90deg]" />
                  </Link>
                )}

                <p className="text-center text-xs text-slate-500 mb-6">Garantía de devolución de 30 días</p>

                {/* Includes */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Este curso incluye:</h4>
                  {[
                    { icon: PlayCircle, text: `${course.duration} de video a demanda` },
                    { icon: Download, text: 'Recursos descargables' },
                    { icon: Infinity, text: 'Acceso de por vida' },
                    { icon: Globe, text: 'Acceso en móvil y desktop' },
                    { icon: Award, text: 'Certificado al completar' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" /> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
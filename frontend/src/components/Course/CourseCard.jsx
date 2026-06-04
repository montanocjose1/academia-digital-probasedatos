import { Link } from 'react-router-dom';
import { BookOpen, Users, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StarRating from '../Common/StarRating';

export default function CourseCard({ course, showAddToCart = false }) {
  const { addToCart, isInCart } = useCart();
  const courseId = course._id || course.id;
  const inCart = isInCart(courseId);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      <Link to={`/courses/${courseId}`} className="block">
        <div className={`course-thumb bg-gradient-to-br ${course.color} flex items-center justify-center`}>
          <BookOpen className="w-10 h-10 text-white/20 group-hover:text-white/40 transition-all group-hover:scale-110" />
          <div className="absolute top-3 left-3">
            <span className="badge-primary">{course.category}</span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                course.level === 'Principiante'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : course.level === 'Intermedio'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {course.level}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/courses/${courseId}`}>
          <h3 className="font-display font-semibold text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mb-2">{course.instructor}</p>

        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={course.rating} />
          <span className="text-xs font-bold text-amber-400">{course.rating}</span>
          <span className="text-xs text-slate-650">({course.students?.toLocaleString()})</span>
        </div>

        {showAddToCart ? (
          <>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
              <span>{course.duration}</span>
              <span>·</span>
              <span>{course.lessons} lecciones</span>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <span className="text-xl font-bold text-white">${course.price}</span>
              <button
                onClick={() => addToCart(course)}
                disabled={inCart}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  inCart
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'btn-gradient text-white'
                }`}
              >
                {inCart ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> En carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Agregar
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-white">${course.price}</span>
            <span className="text-xs text-slate-550 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.students?.toLocaleString()} alumnos
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

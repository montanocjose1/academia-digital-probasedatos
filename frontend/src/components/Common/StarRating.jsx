import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sizeClass} ${
            s <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-700 fill-none'
          }`}
        />
      ))}
    </div>
  );
}

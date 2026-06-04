import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/6 py-12 mt-8">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-white">
              Academia<span className="text-indigo-400">Pro</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2026 AcademiaPro. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            {['Privacidad', 'Términos', 'Soporte'].map((l) => (
              <a key={l} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

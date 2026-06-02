import { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, ShoppingBag, Tag,
  TrendingUp, DollarSign, Star, Plus, Pencil, Trash2,
  Search, ChevronRight, BarChart2, Settings, Bell,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';

// — Mock Data —
const STATS = [
  { label: 'Ingresos totales', value: '$24,580', change: '+12.5%', up: true, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Estudiantes', value: '3,241', change: '+8.2%', up: true, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Cursos activos', value: '12', change: '+2', up: true, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { label: 'Ventas este mes', value: '148', change: '-3.1%', up: false, icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const RECENT_COURSES = [
  { id: '1', title: 'React & Node.js: Full Stack', students: 3241, rating: 4.9, revenue: '$8,420', status: 'Activo', color: 'from-indigo-900 to-purple-900' },
  { id: '2', title: 'Python para Data Science', students: 2187, rating: 4.8, revenue: '$6,100', status: 'Activo', color: 'from-cyan-900 to-blue-900' },
  { id: '3', title: 'UI/UX Design: Wireframe a Prototipo', students: 1854, rating: 4.7, revenue: '$4,280', status: 'Activo', color: 'from-rose-900 to-pink-900' },
  { id: '4', title: 'DevOps & Cloud con AWS', students: 1122, rating: 4.9, revenue: '$5,780', status: 'Borrador', color: 'from-orange-900 to-amber-900' },
];

const RECENT_USERS = [
  { id: 1, name: 'María González', email: 'maria@mail.com', role: 'student', joined: 'Hoy', courses: 3, avatar: 'M' },
  { id: 2, name: 'Pedro Ramírez', email: 'pedro@mail.com', role: 'instructor', joined: 'Ayer', courses: 2, avatar: 'P' },
  { id: 3, name: 'Laura Díaz', email: 'laura@mail.com', role: 'student', joined: 'Hace 3 días', courses: 1, avatar: 'L' },
  { id: 4, name: 'Carlos Méndez', email: 'carlos@mail.com', role: 'instructor', joined: 'Hace 1 sem.', courses: 5, avatar: 'C' },
];

const RECENT_ORDERS = [
  { id: '#0012', user: 'María González', course: 'React & Node.js', amount: '$49.99', status: 'Completado', date: 'Hoy 10:24' },
  { id: '#0011', user: 'Pedro Ramírez', course: 'Python Data Science', amount: '$59.99', status: 'Completado', date: 'Hoy 09:15' },
  { id: '#0010', user: 'Laura Díaz', course: 'UI/UX Design', amount: '$39.99', status: 'Pendiente', date: 'Ayer 18:30' },
  { id: '#0009', user: 'Andrés López', course: 'DevOps & Cloud', amount: '$69.99', status: 'Reembolsado', date: 'Ayer 14:00' },
];

const MENU = [
  { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
  { id: 'courses', icon: BookOpen, label: 'Cursos' },
  { id: 'users', icon: Users, label: 'Usuarios' },
  { id: 'orders', icon: ShoppingBag, label: 'Pedidos' },
  { id: 'coupons', icon: Tag, label: 'Cupones' },
  { id: 'settings', icon: Settings, label: 'Configuración' },
];

const COUPONS = [
  { code: 'ACADPRO15', discount: '15%', type: 'Porcentaje', uses: 42, maxUses: 100, expires: '2026-12-31', active: true },
  { code: 'WELCOME10', discount: '10%', type: 'Porcentaje', uses: 110, maxUses: 100, expires: '2026-06-30', active: false },
  { code: 'FLAT20', discount: '$20', type: 'Fijo', uses: 8, maxUses: 50, expires: '2026-09-01', active: true },
];

function StatusBadge({ status }) {
  const map = {
    'Completado': 'badge-success',
    'Activo': 'badge-success',
    'Pendiente': 'badge-warning',
    'Borrador': 'badge-warning',
    'Reembolsado': 'bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
  };
  return <span className={map[status] || 'badge-primary'}>{status}</span>;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const [showNewCoupon, setShowNewCoupon] = useState(false);

  const filteredUsers = RECENT_USERS.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="page-wrapper flex">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen flex-shrink-0 bg-[#050810] border-r border-white/5 pt-6 pb-8 px-4 sticky top-[72px]">
        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3">Panel Admin</span>
        </div>
        <nav className="space-y-0.5 flex-1">
          {MENU.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`sidebar-link w-full ${activeSection === id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-white mb-0.5">AcademiaPro</p>
            <p className="text-xs text-slate-500">Panel de Administración v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 md:p-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white capitalize">
              {MENU.find((m) => m.id === activeSection)?.label || 'Resumen'}
            </h1>
            <p className="text-sm text-slate-500">Bienvenido de vuelta, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white/4 border border-white/6 text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {STATS.map((s) => (
                <div key={s.label} className="stat-card flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
                    <p className="font-display font-bold text-xl text-white">{s.value}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${s.up ? 'text-green-400' : 'text-rose-400'}`}>
                      {s.change} este mes
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-white">Pedidos recientes</h2>
                <button onClick={() => setActiveSection('orders')} className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                  Ver todos <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['ID', 'Usuario', 'Curso', 'Monto', 'Estado', 'Fecha'].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {RECENT_ORDERS.map((o) => (
                      <tr key={o.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{o.id}</td>
                        <td className="px-5 py-3.5 text-white font-medium">{o.user}</td>
                        <td className="px-5 py-3.5 text-slate-400 max-w-[160px] truncate">{o.course}</td>
                        <td className="px-5 py-3.5 text-white font-bold">{o.amount}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── COURSES ── */}
        {activeSection === 'courses' && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">Todos los cursos</h2>
              <button className="btn-gradient text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Nuevo curso
              </button>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Curso', 'Estudiantes', 'Rating', 'Ingresos', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_COURSES.map((c) => (
                    <tr key={c.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="w-5 h-5 text-white/40" />
                          </div>
                          <span className="text-white font-medium text-xs line-clamp-1 max-w-[160px]">{c.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{c.students.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="text-amber-400 font-bold text-xs">★ {c.rating}</span>
                      </td>
                      <td className="px-5 py-4 text-white font-bold">{c.revenue}</td>
                      <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeSection === 'users' && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">Gestión de usuarios</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="input-field pl-9 text-sm py-2.5 w-56"
                />
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Usuario', 'Rol', 'Cursos', 'Registrado', 'Acciones'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center font-bold text-sm text-white">
                            {u.avatar}
                          </div>
                          <div>
                            <p className="text-white font-medium text-xs">{u.name}</p>
                            <p className="text-slate-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={u.role === 'instructor' ? 'badge-primary' : 'badge-warning'}>
                          {u.role === 'instructor' ? '🎓 Instructor' : '📚 Estudiante'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{u.courses}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{u.joined}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeSection === 'orders' && (
          <div className="animate-fade-in space-y-5">
            <h2 className="font-display font-semibold text-lg text-white">Todos los pedidos</h2>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['ID', 'Usuario', 'Curso', 'Monto', 'Estado', 'Fecha'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_ORDERS.map((o) => (
                    <tr key={o.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{o.id}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{o.user}</td>
                      <td className="px-5 py-3.5 text-slate-400 max-w-[160px] truncate">{o.course}</td>
                      <td className="px-5 py-3.5 text-white font-bold">{o.amount}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── COUPONS ── */}
        {activeSection === 'coupons' && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">Cupones de descuento</h2>
              <button
                onClick={() => setShowNewCoupon(!showNewCoupon)}
                className="btn-gradient text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nuevo cupón
              </button>
            </div>

            {showNewCoupon && (
              <div className="glass-panel rounded-2xl p-5 animate-fade-in">
                <h3 className="font-display font-semibold text-white mb-4 text-sm">Crear nuevo cupón</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Código</label>
                    <input type="text" placeholder="PROMO25" className="input-field text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Descuento</label>
                    <input type="text" placeholder="15%" className="input-field text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Usos máx.</label>
                    <input type="number" placeholder="100" className="input-field text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Expira</label>
                    <input type="date" className="input-field text-sm py-2.5" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer">Crear</button>
                  <button onClick={() => setShowNewCoupon(false)} className="btn-ghost px-5 py-2.5 rounded-xl text-sm cursor-pointer">Cancelar</button>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Código', 'Descuento', 'Usos', 'Expira', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COUPONS.map((c) => (
                    <tr key={c.code} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-indigo-400 text-xs bg-indigo-500/10 px-3 py-1 rounded-lg">{c.code}</span>
                      </td>
                      <td className="px-5 py-3.5 text-white font-bold">{c.discount}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">{c.uses}/{c.maxUses}</span>
                          <div className="progress-bar w-16">
                            <div className="progress-fill" style={{ width: `${Math.min(100, (c.uses/c.maxUses)*100)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{c.expires}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.active ? 'Activo' : 'Inactivo'} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-white/8 text-slate-400 hover:text-white transition-all cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeSection === 'settings' && (
          <div className="animate-fade-in max-w-2xl space-y-6">
            <h2 className="font-display font-semibold text-lg text-white">Configuración del sitio</h2>

            <div className="glass-panel rounded-2xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-white border-b border-white/6 pb-3">General</h3>
              {[
                { label: 'Nombre del sitio', placeholder: 'AcademiaPro', type: 'text' },
                { label: 'Correo de contacto', placeholder: 'admin@academiapro.com', type: 'email' },
                { label: 'URL del sitio', placeholder: 'https://academiapro.com', type: 'url' },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                  <input type={f.type} defaultValue={f.placeholder} className="input-field text-sm" />
                </div>
              ))}
              <button className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer">
                Guardar cambios
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-white border-b border-white/6 pb-3">Plataforma</h3>
              {[
                { label: 'Permitir nuevos registros', checked: true },
                { label: 'Modo mantenimiento', checked: false },
                { label: 'Activar reseñas de cursos', checked: true },
                { label: 'Certificados automáticos', checked: true },
              ].map((o) => (
                <div key={o.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{o.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={o.checked} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
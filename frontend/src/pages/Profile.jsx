import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Camera, ShieldAlert, CheckCircle,
  BookOpen, GraduationCap, Clock, Award, Edit2, Eye, EyeOff, LogOut
} from 'lucide-react';

// Mock enrolled courses
const ENROLLED_COURSES = [
  { _id: '1', title: 'React & Node.js: Full Stack desde Cero', progress: 68, color: 'from-indigo-900 to-purple-900', instructor: 'Carlos Méndez', totalLessons: 120, completedLessons: 82 },
  { _id: '2', title: 'Python para Data Science', progress: 32, color: 'from-cyan-900 to-blue-900', instructor: 'Ana Rodríguez', totalLessons: 95, completedLessons: 30 },
  { _id: '6', title: 'JavaScript Moderno: ES6+ y TypeScript', progress: 100, color: 'from-yellow-900 to-orange-900', instructor: 'Daniel Cruz', totalLessons: 88, completedLessons: 88 },
];

const ACHIEVEMENTS = [
  { icon: '🏆', title: 'Primer curso completado', desc: 'JS Moderno' },
  { icon: '🔥', title: 'Racha de 7 días', desc: 'Estudia todos los días' },
  { icon: '⭐', title: 'Estudiante destacado', desc: 'Top 10%' },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('courses');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || 'Usuario');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveMsg('Cambios guardados correctamente.');
    setEditMode(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const tabs = [
    { id: 'courses', label: 'Mis cursos' },
    { id: 'achievements', label: 'Logros' },
    { id: 'settings', label: 'Configuración' },
  ];

  const completedCount = ENROLLED_COURSES.filter((c) => c.progress === 100).length;
  const totalHours = 35; // mock

  if (!user) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-white mb-3">Acceso requerido</h2>
          <p className="text-slate-400 mb-6">Debes iniciar sesión para ver tu perfil.</p>
          <a href="/login" className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold inline-block">
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Profile Hero */}
      <div className="bg-[#050810] border-b border-white/5 py-12">
        <div className="container-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center font-display font-extrabold text-3xl text-white animate-pulse-glow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-500 rounded-xl flex items-center justify-center hover:bg-indigo-400 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display font-extrabold text-2xl text-white mb-0.5">{user.name}</h1>
              <p className="text-sm text-slate-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`badge-primary`}>
                  {user.role === 'instructor' ? '🎓 Instructor' : user.role === 'admin' ? '⚙️ Admin' : '📚 Estudiante'}
                </span>
                <span className="text-xs text-slate-600">Miembro desde 2026</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cursos', value: ENROLLED_COURSES.length, icon: BookOpen },
                { label: 'Completados', value: completedCount, icon: CheckCircle },
                { label: 'Horas', value: totalHours, icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="stat-card text-center min-w-[80px]">
                  <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <div className="font-display font-bold text-xl text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl py-10">
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

        {/* My Courses */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in space-y-4">
            <h2 className="font-display font-bold text-xl text-white mb-6">Mis cursos en progreso</h2>
            {ENROLLED_COURSES.map((course) => (
              <div key={course._id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
                {/* Thumb */}
                <div className={`w-full sm:w-28 h-20 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="w-8 h-8 text-white/30" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white text-sm mb-0.5 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{course.instructor}</p>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="progress-bar flex-1">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-white w-10 text-right">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-600">{course.completedLessons}/{course.totalLessons} lecciones</p>
                </div>

                {/* Action */}
                <div className="flex flex-col justify-center gap-2 sm:w-36">
                  {course.progress === 100 ? (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                      <Award className="w-4 h-4" /> Completado
                    </div>
                  ) : (
                    <a
                      href={`/learning?course=${course._id}`}
                      className="btn-gradient text-white text-xs font-semibold py-2.5 px-4 rounded-xl text-center"
                    >
                      Continuar →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-xl text-white mb-6">Tus logros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.title} className="glass-card rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">{a.icon}</div>
                  <h3 className="font-display font-semibold text-white mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-500">{a.desc}</p>
                </div>
              ))}
              {/* Locked ones */}
              {['Completar 5 cursos', 'Racha de 30 días', 'Recomendar a un amigo'].map((a) => (
                <div key={a} className="glass-card rounded-2xl p-6 text-center opacity-40">
                  <div className="text-4xl mb-3 grayscale">🔒</div>
                  <h3 className="font-display font-semibold text-slate-400 mb-1">{a}</h3>
                  <p className="text-xs text-slate-600">Bloqueado</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in max-w-xl">
            <h2 className="font-display font-bold text-xl text-white mb-6">Configuración de cuenta</h2>

            {saveMsg && (
              <div className="bg-green-950/20 border border-green-500/20 text-green-400 text-xs rounded-xl p-3.5 flex items-center gap-2 mb-6">
                <CheckCircle className="w-4 h-4" /> {saveMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Nombre completo</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                    className={`input-field pl-10 ${!editMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Correo electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field pl-10 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              {editMode && (
                <>
                  <div className="divider"></div>
                  <h3 className="text-sm font-semibold text-white">Cambiar contraseña</h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Contraseña actual</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="input-field pl-10 pr-10"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Nueva contraseña</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="mín. 6 caracteres"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                {editMode ? (
                  <>
                    <button type="submit" className="btn-gradient text-white font-semibold py-2.5 px-5 rounded-xl text-sm cursor-pointer">
                      Guardar cambios
                    </button>
                    <button type="button" onClick={() => setEditMode(false)} className="btn-ghost py-2.5 px-5 rounded-xl text-sm cursor-pointer">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="btn-outline py-2.5 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar perfil
                  </button>
                )}
              </div>
            </form>

            {/* Danger zone */}
            <div className="mt-6 glass-panel rounded-2xl p-5 border border-rose-500/10">
              <h3 className="font-display font-semibold text-white mb-1 text-sm">Zona de peligro</h3>
              <p className="text-xs text-slate-500 mb-4">Estas acciones son irreversibles.</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

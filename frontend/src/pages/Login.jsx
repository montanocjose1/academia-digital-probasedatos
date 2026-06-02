import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setSubmitting(false);
      return;
    }

    const res = await login(email, password);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Credenciales incorrectas.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#020409] flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="glow-orb w-96 h-96 bg-indigo-600/8 top-1/4 left-1/4" />
      <div className="glow-orb w-80 h-80 bg-purple-600/8 bottom-1/4 right-1/4" />

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 justify-center mb-6">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Academia<span className="text-indigo-400">Pro</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-white mb-1">Bienvenido de vuelta</h1>
            <p className="text-sm text-slate-400">Inicia sesión en tu cuenta</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3.5 flex items-center gap-2 mb-6">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400">Contraseña</label>
                <a href="#" className="text-xs text-indigo-400 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              id="login-submit"
              className="w-full btn-gradient text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Iniciando sesión...
                </span>
              ) : (
                <><span>Iniciar Sesión</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="divider"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 bg-[#0d1117] px-3 text-xs text-slate-600">
              ¿No tienes cuenta?
            </span>
          </div>

          <Link
            to="/register"
            className="block w-full btn-ghost py-3 rounded-2xl text-sm font-semibold text-center"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
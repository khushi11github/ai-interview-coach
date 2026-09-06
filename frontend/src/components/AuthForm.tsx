import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, ArrowRight, Sparkles, Zap } from 'lucide-react';

interface AuthFormProps {
  mode: 'signup' | 'login';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const handleGuestLogin = () => {
    const demoUser = {
      id: 'guest-' + Date.now(),
      name: name || 'Demo Engineer',
      email: email || 'guest@coach.ai',
      targetRole: 'Senior Full Stack Engineer',
      targetCompany: 'FAANG / Big Tech',
      experienceLevel: 'Senior (6 - 8 yrs)',
      streakDays: 5
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = isSignup ? { name, email, password } : { email, password };
      const response = await api.post(`/auth/${mode}`, payload);

      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        handleGuestLogin();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;

      // Fallback: If DB is offline, or API error occurs, auto-fallback to Guest Session so user is never blocked!
      if (err.response?.status === 503 || !err.response || err.code === 'ERR_NETWORK') {
        handleGuestLogin();
        return;
      }

      // If user not found on login, offer quick guest fallback or display exact message
      if (!isSignup && err.response?.status === 401) {
        setError(msg || 'Invalid email or password. Click "Quick Guest Access" below to enter immediately.');
      } else {
        setError(msg || 'Authentication error. Use "Quick Guest Access" to enter directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-md relative z-10">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200 mb-3 shadow-xs">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
            COACH<span className="text-emerald-600">.AI</span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold">
            {isSignup ? 'Unlock your potential with real-time AI simulations' : 'Welcome back to your AI preparation dashboard'}
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-hidden text-xs font-medium transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-hidden text-xs font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-hidden text-xs font-medium transition-all"
                  minLength={isSignup ? 6 : undefined}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center leading-relaxed font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-xs cursor-pointer border-0 text-xs group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>{isSignup ? 'Create Account' : 'Enter Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Quick Guest Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>⚡ Quick Guest Access (Instant Entry)</span>
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            {isSignup ? 'Already registered?' : "New to Coach.AI?"}{' '}
            <Link
              to={isSignup ? '/login' : '/signup'}
              className="text-emerald-700 hover:text-emerald-800 font-bold underline underline-offset-4 transition-colors"
            >
              {isSignup ? 'Sign in here' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;


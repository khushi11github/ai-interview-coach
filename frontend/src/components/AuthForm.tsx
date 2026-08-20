import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = isSignup ? { name, email, password } : { email, password };
      // Make authentication call
      const response = await api.post(`/auth/${mode}`, payload);
      
      if (isSignup) {
        navigate('/login');
      } else {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      // If backend reports DB unavailable, create a local demo account for dev
      if (isSignup && err.response?.status === 503) {
        const demoUser = { id: 'local-demo', name: name || 'Demo User', email: email || 'demo@local', createdAt: new Date().toISOString() };
        localStorage.setItem('user', JSON.stringify(demoUser));
        navigate('/home');
        return;
      }

      setError(msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-2xl border border-brand-orange/20 mb-4 animate-pulse-slow">
            <Sparkles className="w-8 h-8 text-brand-orange" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient-orange mb-2">
            AI Interview Coach
          </h1>
          <p className="text-zinc-400 text-sm">
            {isSignup ? 'Unlock your potential with real-time AI simulations' : 'Welcome back to your preparation chamber'}
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-panel p-8 rounded-3xl border border-brand-dark-border/80 shadow-2xl relative">
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-brand-black/50 text-zinc-100 placeholder-zinc-500 rounded-xl border border-brand-dark-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-brand-black/50 text-zinc-100 placeholder-zinc-500 rounded-xl border border-brand-dark-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 focus:outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-brand-black/50 text-zinc-100 placeholder-zinc-500 rounded-xl border border-brand-dark-border focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 focus:outline-none transition-all duration-300"
                  minLength={isSignup ? 8 : undefined}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-4 rounded-xl transition duration-300 disabled:bg-brand-orange/40 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {isSignup ? 'Get Started' : 'Enter Chamber'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Toggle option */}
        <div className="text-center mt-6">
          <p className="text-zinc-400 text-sm">
            {isSignup ? 'Already registered?' : "New to the system?"}{' '}
            <Link
              to={isSignup ? '/login' : '/signup'}
              className="text-brand-orange hover:text-brand-orange-hover font-semibold underline decoration-brand-orange/30 underline-offset-4 transition-colors"
            >
              {isSignup ? 'Login here' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

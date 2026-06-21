import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  LogOut, 
  Sparkles,
  User,
  Home
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  // Get user details from localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Interviewee', email: 'user@example.com' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Welcome Hub', path: '/home', icon: Home },
    { name: 'Workspace Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Practice Room (IR)', path: '/interview', icon: Video },
  ];

  return (
    <aside className="w-64 bg-brand-black/90 border-r border-brand-dark-border flex flex-col h-screen select-none z-20">
      {/* Brand logo area */}
      <div className="p-6 border-b border-brand-dark-border/60">
        <NavLink to="/home" className="flex items-center gap-3 group">
          <div className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/20 group-hover:border-brand-orange/40 transition-colors">
            <Sparkles className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gradient-orange-pure tracking-wide">
              Coach.AI
            </h2>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase">
              Chamber v1.2
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
              ${isActive 
                ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shadow-md shadow-brand-orange/5' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border border-transparent'
              }
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-105" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile card & Logout */}
      <div className="p-4 border-t border-brand-dark-border/60 bg-zinc-950/40">
        <div className="flex items-center gap-3 p-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-zinc-200 truncate">
              {user.name || 'Anonymous User'}
            </h4>
            <p className="text-xs text-zinc-500 truncate">
              {user.email || 'user@coach.ai'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

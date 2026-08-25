import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  LogOut, 
  Sparkles,
  User as UserIcon,
  Home
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Interviewee', email: 'user@coach.ai' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'AI Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'Simulation Room', path: '/interview', icon: Video },
    { name: 'Overview Hub', path: '/welcome-hub', icon: Home },
  ];

  return (
    <header className="workspace-header w-full bg-[#06120E]/90 backdrop-blur-md border-b border-emerald-500/20 flex items-center justify-between px-6 py-3.5 select-none z-20 shrink-0 relative overflow-hidden">
      {/* Subtle top emerald light line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      
      {/* Left: Brand logo area */}
      <div className="flex items-center gap-3">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-gradient-emerald-teal tracking-wide leading-none">
              COACH.AI
            </h2>
            <p className="text-[9px] text-emerald-400/70 font-semibold tracking-widest uppercase mt-0.5 leading-none">
              AI Cyber Cockpit
            </p>
          </div>
        </NavLink>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="workspace-nav flex items-center gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 group border
              ${isActive 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-emerald-950/40 border-transparent'
              }
            `}
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: User profile card & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-white leading-none">
              {user.name || 'Anonymous User'}
            </h4>
            <p className="text-[9px] text-emerald-400/60 mt-1 leading-none">
              {user.email || 'user@coach.ai'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300 cursor-pointer bg-transparent"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Sidebar;

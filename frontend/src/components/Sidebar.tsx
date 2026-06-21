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
    <header className="w-full bg-brand-black/95 border-b border-brand-dark-border/80 flex items-center justify-between px-8 py-4 select-none z-20 flex-shrink-0 relative overflow-hidden">
      {/* Background subtle light line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/15 to-transparent" />
      
      {/* Left: Brand logo area */}
      <div className="flex items-center gap-3">
        <NavLink to="/home" className="flex items-center gap-3 group">
          <div className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/20 group-hover:border-brand-orange/40 transition-colors">
            <Sparkles className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gradient-orange-pure tracking-wide leading-none">
              Coach.AI
            </h2>
            <p className="text-[9px] text-zinc-500 font-semibold tracking-widest uppercase mt-1 leading-none">
              Chamber v1.2
            </p>
          </div>
        </NavLink>
      </div>

      {/* Middle: Horizontal Navigation menu */}
      <nav className="flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 group border
              ${isActive 
                ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 shadow-md shadow-brand-orange/5' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-transparent'
              }
            `}
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:scale-105" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: User profile card & Logout */}
      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-semibold text-zinc-300 leading-none">
              {user.name || 'Anonymous User'}
            </h4>
            <p className="text-[9px] text-zinc-500 mt-1 leading-none">
              {user.email || 'user@coach.ai'}
            </p>
          </div>
        </div>

        {/* Terminate Session Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 cursor-pointer bg-transparent"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Terminate Session</span>
        </button>
      </div>
    </header>
  );
};

export default Sidebar;

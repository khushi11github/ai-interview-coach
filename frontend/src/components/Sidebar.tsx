import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  LogOut, 
  Sparkles,
  User as UserIcon,
  Home,
  ChevronDown,
  Calendar,
  Target,
  Bot,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Interviewee', email: 'user@coach.ai' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Mock Room', path: '/interview', icon: Video },
    { name: 'Resume Scanner', path: '/resume-analyzer', icon: FileText },
    { name: 'Overview Hub', path: '/welcome-hub', icon: Home },
  ];

  const quickNavTools = [
    { name: '7-Day AI Prep Sprint', icon: Calendar, tab: 'plan', desc: 'Customized daily study roadmap' },
    { name: 'Skill Matrix & Radar', icon: Target, tab: 'matrix', desc: 'Competency analytics & weakness map' },
    { name: 'Session Vault', icon: Video, tab: 'vault', desc: 'Past interview recordings & feedback' },
    { name: 'AI Copilot & Evaluator', icon: Bot, tab: 'ai', desc: 'Interactive AI practice assistant' },
  ];

  return (
    <header className="workspace-header w-full bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 py-3 select-none z-30 shrink-0 shadow-xs relative">
      
      {/* Left: Brand logo area */}
      <div className="flex items-center gap-6">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 group-hover:border-emerald-500 transition-colors shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
              COACH<span className="text-emerald-600">.AI</span>
            </h2>
            <p className="text-[9px] text-slate-600 font-semibold tracking-wider uppercase mt-0.5 leading-none">
              Interview Platform
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 group border
                ${isActive 
                  ? 'bg-slate-100 text-emerald-700 border-slate-200 shadow-2xs font-extrabold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }
              `}
            >
              <item.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Quick Tools Dropdown Menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            >
              <span>Quick Nav</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Navigation Menu
                </div>
                {quickNavTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => {
                        navigate('/dashboard');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                          {tool.name}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {tool.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800 leading-none">
              {user.name || 'User'}
            </h4>
            <p className="text-[9px] text-slate-500 mt-0.5 leading-none">
              {user.targetRole || 'Senior Engineer'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-xl space-y-2 z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all
                ${isActive ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-600 hover:bg-slate-50'}
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Sidebar;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, Sparkles, Flame, Target, Settings, ShieldCheck, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  targetRole: string;
  targetCompany: string;
  experienceLevel: string;
  streakDays: number;
  onOpenRoleModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  targetRole,
  targetCompany,
  experienceLevel,
  streakDays,
  onOpenRoleModal,
  onSelectTab
}) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative overflow-hidden glass-panel rounded-3xl p-6 md:p-8 mb-8 border border-emerald-500/20 shadow-2xl">
      {/* Background glowing ambient light orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Avatar + Greetings + Role Context */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#050D0A] rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-emerald-400">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            {/* Live Status indicator dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#050D0A] flex items-center justify-center shadow-md">
              <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{getGreeting()}</span>
              </span>
              
              {/* Streak Badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
                <span>{streakDays} Day Streak</span>
              </div>

              {/* AI Online Status */}
              <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> AI Engine Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="text-gradient-emerald-teal">{userName}</span>
            </h1>

            {/* Target Role Selector Pill */}
            <div className="flex items-center gap-2 mt-2">
              <div 
                onClick={onOpenRoleModal}
                className="flex items-center gap-2 px-3 py-1 bg-[#061410] hover:bg-[#0A1F19] border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl cursor-pointer transition-all text-xs text-slate-300 group"
                title="Click to change target role settings"
              >
                <Target className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span className="font-bold text-white">{targetRole}</span>
                <span className="text-emerald-500/50">•</span>
                <span className="text-slate-300">{targetCompany}</span>
                <span className="text-emerald-500/50">•</span>
                <span className="text-emerald-400 font-semibold">{experienceLevel}</span>
                <Settings className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Launch Live Chamber */}
          <button
            onClick={() => navigate('/interview')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-0 text-sm group"
          >
            <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>Launch AI Mock Room</span>
            <Zap className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Upload Resume */}
          <button
            onClick={() => navigate('/resume-analyzer')}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#061410] hover:bg-[#0A1F19] border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 font-bold rounded-2xl transition-all duration-300 cursor-pointer text-sm shadow-md"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Scan Resume</span>
          </button>

          {/* Study Plan tab jump */}
          <button
            onClick={() => onSelectTab('plan')}
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#061410] hover:bg-[#0A1F19] border border-teal-500/30 hover:border-teal-400 text-teal-300 font-bold rounded-2xl transition-all duration-300 cursor-pointer text-sm shadow-md"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">7-Day Plan</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardHeader;

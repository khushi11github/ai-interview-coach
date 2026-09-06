import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, Flame, Target, Settings, CheckCircle2 } from 'lucide-react';

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
  onOpenRoleModal
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/60 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Avatar + Greetings + Role Context */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-extrabold text-xl text-white shrink-0 shadow-2xs">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {userName} 👋
              </h1>
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streakDays} Day Streak</span>
              </div>
            </div>

            {/* Target Role Selector Pill */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={onOpenRoleModal}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-colors group"
                title="Click to edit target role settings"
              >
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800">{targetRole}</span>
                <span className="text-slate-300">•</span>
                <span>{targetCompany}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{experienceLevel}</span>
                <Settings className="w-3 h-3 text-slate-400 group-hover:text-slate-600 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/interview')}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer text-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Practice Session</span>
          </button>

          <button
            onClick={() => navigate('/resume-analyzer')}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer text-xs"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Scan Resume</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardHeader;



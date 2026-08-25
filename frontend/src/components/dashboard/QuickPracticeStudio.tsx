import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Cpu, Layers, UserCheck, Code, CheckCircle, ArrowRight } from 'lucide-react';

export const QuickPracticeStudio: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDrill, setSelectedDrill] = useState<string>('system-design');

  const drills = [
    {
      id: 'system-design',
      title: 'System Design & Scalability',
      desc: 'Microservices, Caching, DB Partitioning, Rate Limiters',
      difficulty: 'Hard',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-500',
      badge: 'badge-neon-emerald',
      params: { role: 'System Architect', difficulty: 'Hard', topic: 'System Design' }
    },
    {
      id: 'behavioral-star',
      title: 'Behavioral & Leadership STAR',
      desc: 'Conflict resolution, trade-offs, team impact scenarios',
      difficulty: 'Medium',
      icon: UserCheck,
      color: 'from-teal-500 to-cyan-500',
      badge: 'badge-neon-teal',
      params: { role: 'Behavioral & Leadership', difficulty: 'Medium', topic: 'STAR Method' }
    },
    {
      id: 'dsa-edge-cases',
      title: 'Coding & Algorithm Edge Cases',
      desc: 'Time complexity, space optimization, boundary conditions',
      difficulty: 'Hard',
      icon: Code,
      color: 'from-emerald-600 to-lime-500',
      badge: 'badge-neon-emerald',
      params: { role: 'Software Engineer', difficulty: 'Hard', topic: 'Algorithms' }
    },
    {
      id: 'frontend-arch',
      title: 'Frontend & UI Architecture',
      desc: 'State management, SSR, rendering optimization, DOM perf',
      difficulty: 'Medium',
      icon: Layers,
      color: 'from-cyan-500 to-teal-400',
      badge: 'badge-neon-teal',
      params: { role: 'Senior Frontend Engineer', difficulty: 'Medium', topic: 'Frontend Architecture' }
    }
  ];

  const handleLaunch = () => {
    const activeDrill = drills.find((d) => d.id === selectedDrill) || drills[0];
    localStorage.setItem('quickDrillConfig', JSON.stringify(activeDrill.params));
    navigate('/interview');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>5-Minute Quick Studio</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Instant AI Evaluation
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Targeted Skill Studio</h2>
        <p className="text-xs text-slate-300 mb-4">
          Select a micro-drill to practice key competencies in realistic short sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
        {drills.map((drill) => {
          const Icon = drill.icon;
          const isSelected = selectedDrill === drill.id;
          return (
            <div
              key={drill.id}
              onClick={() => setSelectedDrill(drill.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#061B14] border-emerald-400/70 shadow-lg shadow-emerald-500/15'
                  : 'bg-[#040D0A]/60 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-[#061410]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${drill.color} text-slate-950 shadow-xs font-black`}>
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight">{drill.title}</h3>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${drill.badge}`}>
                    {drill.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{drill.desc}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleLaunch}
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 group"
      >
        <Play className="w-3.5 h-3.5 fill-slate-950 group-hover:scale-110 transition-transform" />
        <span>Launch Selected 5-Min Drill</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default QuickPracticeStudio;

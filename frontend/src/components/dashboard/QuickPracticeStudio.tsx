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
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      params: { role: 'System Architect', difficulty: 'Hard', topic: 'System Design' }
    },
    {
      id: 'behavioral-star',
      title: 'Behavioral & Leadership STAR',
      desc: 'Conflict resolution, trade-offs, team impact scenarios',
      difficulty: 'Medium',
      icon: UserCheck,
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      params: { role: 'Behavioral & Leadership', difficulty: 'Medium', topic: 'STAR Method' }
    },
    {
      id: 'dsa-edge-cases',
      title: 'Coding & Algorithm Edge Cases',
      desc: 'Time complexity, space optimization, boundary conditions',
      difficulty: 'Hard',
      icon: Code,
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      params: { role: 'Software Engineer', difficulty: 'Hard', topic: 'Algorithms' }
    },
    {
      id: 'frontend-arch',
      title: 'Frontend & UI Architecture',
      desc: 'State management, SSR, rendering optimization, DOM perf',
      difficulty: 'Medium',
      icon: Layers,
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      params: { role: 'Senior Frontend Engineer', difficulty: 'Medium', topic: 'Frontend Architecture' }
    }
  ];

  const handleLaunch = () => {
    const activeDrill = drills.find((d) => d.id === selectedDrill) || drills[0];
    localStorage.setItem('quickDrillConfig', JSON.stringify(activeDrill.params));
    navigate('/interview');
  };

  return (
    <div className="bg-white rounded-3xl p-8 border-0 shadow-2xs relative overflow-hidden h-full flex flex-col justify-between w-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>5-Minute Quick Studio</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border-0 px-2 py-0.5 rounded-full">
            Instant AI Evaluation
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Targeted Skill Studio</h2>
        <p className="text-xs text-slate-500 mb-4">
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
              className={`p-3.5 rounded-2xl border-0 transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/80 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600">
                  <CheckCircle className="w-4 h-4 fill-emerald-100" />
                </div>
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-white text-slate-800 font-bold border-0 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{drill.title}</h3>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block border-0 ${drill.badge}`}>
                    {drill.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{drill.desc}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleLaunch}
        className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-0 group"
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        <span>Launch Selected 5-Min Drill</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

};

export default QuickPracticeStudio;


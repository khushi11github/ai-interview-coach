import React from 'react';
import { TrendingUp, Award, Zap, ChevronRight, Activity } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number;
  technical: number;
  communication: number;
  structure: number;
  confidence: number;
  momentum: number;
  onExploreSkillMatrix: () => void;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  technical,
  communication,
  structure,
  confidence,
  momentum,
  onExploreSkillMatrix
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatus = (val: number) => {
    if (val >= 85) return { label: 'FAANG / Tier-1 Ready', color: '#00F5A0', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/40' };
    if (val >= 70) return { label: 'Mid-Level Competitive', color: '#00D9F5', textClass: 'text-teal-300', borderClass: 'border-teal-500/40' };
    if (val >= 50) return { label: 'Building Foundation', color: '#FACC15', textClass: 'text-amber-400', borderClass: 'border-amber-500/40' };
    return { label: 'Needs Targeted Drill', color: '#FF5252', textClass: 'text-rose-400', borderClass: 'border-rose-500/40' };
  };

  const status = getStatus(score);

  const subMetrics = [
    { name: 'Technical Depth', value: technical, color: 'bg-emerald-400', text: 'text-emerald-400' },
    { name: 'STAR Structure', value: structure, color: 'bg-teal-400', text: 'text-teal-400' },
    { name: 'Communication', value: communication, color: 'bg-cyan-400', text: 'text-cyan-400' },
    { name: 'Confidence & Pitch', value: confidence, color: 'bg-lime-400', text: 'text-lime-400' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>AI Career Readiness Index</span>
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Overall Readiness Cockpit</h2>
        </div>

        {/* Benchmark Pill */}
        <div className={`px-3 py-1 rounded-xl bg-[#061410] border ${status.borderClass} flex items-center gap-1.5`}>
          <Award className={`w-3.5 h-3.5 ${status.textClass}`} />
          <span className={`text-xs font-bold ${status.textClass}`}>{status.label}</span>
        </div>
      </div>

      {/* Main Gauge Arc & Score Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        {/* SVG Circular Meter */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-[#0B2119]"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={status.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 10px ${status.color})` }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white tracking-tight">{score}%</span>
              <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mt-0.5">Readiness Score</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 bg-[#061410] px-3 py-1 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">+{momentum}% Momentum</span>
            <span className="text-[10px] text-slate-400">vs last 7 days</span>
          </div>
        </div>

        <div className="md:col-span-7 space-y-3.5">
          {subMetrics.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">{item.name}</span>
                <span className={item.text}>{item.value}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#061410] rounded-full overflow-hidden p-[1px] border border-emerald-500/20">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-xs`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-emerald-500/15 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Calculated live from mock sessions & ATS resume metrics</span>
        </span>
        <button
          onClick={onExploreSkillMatrix}
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Explore Skill Matrix</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReadinessGauge;

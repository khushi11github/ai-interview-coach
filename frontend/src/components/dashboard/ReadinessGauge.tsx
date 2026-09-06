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
    if (val >= 85) return { label: 'FAANG / Tier-1 Ready', color: '#059669', textClass: 'text-emerald-700', borderClass: 'border-emerald-200 bg-emerald-50' };
    if (val >= 70) return { label: 'Mid-Level Competitive', color: '#0284C7', textClass: 'text-sky-700', borderClass: 'border-sky-200 bg-sky-50' };
    if (val >= 50) return { label: 'Building Foundation', color: '#D97706', textClass: 'text-amber-700', borderClass: 'border-amber-200 bg-amber-50' };
    return { label: 'Needs Targeted Drill', color: '#E11D48', textClass: 'text-rose-700', borderClass: 'border-rose-200 bg-rose-50' };
  };

  const status = getStatus(score);

  const subMetrics = [
    { name: 'Technical Depth', value: technical, color: 'bg-emerald-600', text: 'text-emerald-700' },
    { name: 'STAR Structure', value: structure, color: 'bg-teal-600', text: 'text-teal-700' },
    { name: 'Communication', value: communication, color: 'bg-sky-600', text: 'text-sky-700' },
    { name: 'Confidence & Pitch', value: confidence, color: 'bg-indigo-600', text: 'text-indigo-700' }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 border-0 shadow-2xs relative overflow-hidden h-full flex flex-col justify-between w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Career Readiness Index</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">Overall Readiness Cockpit</h2>
        </div>

        {/* Benchmark Pill */}
        <div className={`px-3.5 py-1.5 rounded-xl border-0 ${status.borderClass} flex items-center gap-1.5`}>
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
                className="stroke-slate-100"
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
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{score}%</span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">Readiness Score</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 px-3 py-1 rounded-full border-0">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">+{momentum}% Momentum</span>
            <span className="text-[10px] text-slate-500">vs last 7 days</span>
          </div>
        </div>

        <div className="md:col-span-7 space-y-3.5">
          {subMetrics.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{item.name}</span>
                <span className={item.text}>{item.value}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border-0">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-2xs`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Calculated live from mock sessions & ATS resume metrics</span>
        </span>
        <button
          onClick={onExploreSkillMatrix}
          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Explore Skill Matrix</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

};

export default ReadinessGauge;


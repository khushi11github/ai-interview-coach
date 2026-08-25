import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ShieldCheck, Target, AlertTriangle, Play, Sparkles, Award } from 'lucide-react';

interface SkillMatrixTabProps {
  history: any[];
}

export const SkillMatrixTab: React.FC<SkillMatrixTabProps> = ({ history }) => {
  const navigate = useNavigate();

  const hasHistory = history.length > 0;
  
  const techScore = hasHistory
    ? Math.round(history.reduce((acc, curr) => acc + (curr.technical || 70), 0) / history.length)
    : 75;

  const commScore = hasHistory
    ? Math.round(history.reduce((acc, curr) => acc + (curr.communication || 70), 0) / history.length)
    : 80;

  const structScore = hasHistory
    ? Math.round(history.reduce((acc, curr) => acc + (curr.structure || 70), 0) / history.length)
    : 68;

  const confScore = hasHistory
    ? Math.round(history.reduce((acc, curr) => acc + (curr.confidence || 70), 0) / history.length)
    : 72;

  const sysDesignScore = hasHistory ? Math.round((techScore + structScore) / 2) : 70;
  const problemSolvingScore = hasHistory ? Math.round((techScore + confScore) / 2) : 78;

  const radarData = [
    { subject: 'Technical Depth', score: techScore, fullMark: 100 },
    { subject: 'STAR Structure', score: structScore, fullMark: 100 },
    { subject: 'Communication', score: commScore, fullMark: 100 },
    { subject: 'Confidence', score: confScore, fullMark: 100 },
    { subject: 'System Design', score: sysDesignScore, fullMark: 100 },
    { subject: 'Problem Solving', score: problemSolvingScore, fullMark: 100 },
  ];

  const barData = [
    { name: 'Technical', score: techScore, benchmark: 85 },
    { name: 'STAR Method', score: structScore, benchmark: 80 },
    { name: 'Communication', score: commScore, benchmark: 85 },
    { name: 'Confidence', score: confScore, benchmark: 75 },
    { name: 'System Design', score: sysDesignScore, benchmark: 85 },
    { name: 'Problem Solving', score: problemSolvingScore, benchmark: 90 },
  ];

  const weaknesses = [
    {
      title: 'STAR Structure Compliance',
      score: structScore,
      description: 'Your answers tend to jump directly into the technical solution without establishing clear Situation & Task metrics.',
      recommendation: 'Spend 30 seconds explicitly framing the business problem before explaining your code.',
      drillRole: 'Behavioral & Leadership'
    },
    {
      title: 'System Scalability Trade-offs',
      score: sysDesignScore,
      description: 'When proposing database solutions, explicitly compare Relational vs NoSQL trade-offs under write heavy workloads.',
      recommendation: 'Practice explaining CAP Theorem and eventual consistency in 2 minutes.',
      drillRole: 'System Architect'
    }
  ];

  const strengths = [
    { title: 'Verbal Pitch & Tone', score: commScore, note: 'Exhibits fluent articulation and clear pacing during technical delivery.' },
    { title: 'Problem Solving Logic', score: problemSolvingScore, note: 'Strong breakdown of edge cases and algorithmic time complexity.' }
  ];

  const launchDrill = (role: string) => {
    localStorage.setItem(
      'quickDrillConfig',
      JSON.stringify({ role, difficulty: 'Hard', topic: 'Weakness Drill' })
    );
    navigate('/interview');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold badge-neon-emerald px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-emerald-400" />
            <span>Competency Radar</span>
          </span>
          <h2 className="text-2xl font-black text-white">Skill Matrix & Benchmark Analytics</h2>
          <p className="text-xs text-slate-300 mt-1">
            Comprehensive multi-dimensional evaluation of your technical, behavioral, and structural performance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#061410] px-4 py-2.5 rounded-2xl border border-emerald-500/20">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Overall Level</span>
            <span className="text-sm font-extrabold text-white">Senior Tier (82% Target)</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Competency Skill Radar</span>
            </h3>
            <span className="text-[11px] text-slate-400">Target vs Actual</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#0F2D23" />
                <PolarAngleAxis dataKey="subject" stroke="#6EE7B7" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#065F46" fontSize={10} />
                <Radar name="User Score" dataKey="score" stroke="#00F5A0" fill="#00F5A0" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Comparison Chart */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Score vs FAANG Target Benchmark</span>
            </h3>
            <span className="text-[11px] text-slate-400">0 - 100% Index</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0F2D23" vertical={false} />
                <XAxis dataKey="name" stroke="#6EE7B7" fontSize={11} tickLine={false} />
                <YAxis stroke="#6EE7B7" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#061410',
                    borderColor: '#00F5A0',
                    borderRadius: '12px',
                    color: '#F0FDF4'
                  }}
                />
                <Bar dataKey="score" fill="#00F5A0" radius={[6, 6, 0, 0]} maxBarSize={32} name="Your Score" />
                <Bar dataKey="benchmark" fill="#0F2D23" radius={[6, 6, 0, 0]} maxBarSize={32} name="FAANG Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weakness Mitigation & Strengths Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Weaknesses */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-emerald-500/20">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>AI Detected Weakness & Mitigation Strategy</span>
          </h3>

          <div className="space-y-4">
            {weaknesses.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#040D0A]/70 rounded-2xl border border-rose-500/20">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {item.score}% Score
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{item.description}</p>
                <div className="bg-[#061410] p-2.5 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 mb-3">
                  <strong>Action Plan:</strong> {item.recommendation}
                </div>
                <button
                  onClick={() => launchDrill(item.drillRole)}
                  className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-rose-300" />
                  <span>Launch Focused Drill for {item.drillRole}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Strengths */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-emerald-500/20">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Top Identified Strengths</span>
          </h3>

          <div className="space-y-4">
            {strengths.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#040D0A]/70 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {item.score}% Score
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrixTab;

import React from 'react';
import { X, Award, CheckCircle2, AlertCircle, FileText, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionDetailModalProps {
  session: any | null;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
  const navigate = useNavigate();

  if (!session) return null;

  const handleRetake = () => {
    localStorage.setItem(
      'quickDrillConfig',
      JSON.stringify({
        role: session.role,
        difficulty: session.difficulty || 'Medium',
        topic: 'Re-take Session'
      })
    );
    onClose();
    navigate('/interview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050D0A]/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between bg-[#061410]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold badge-neon-emerald">
                {session.difficulty || 'Medium'} Difficulty
              </span>
              <span className="text-xs text-slate-400">{session.date}</span>
            </div>
            <h2 className="text-xl font-black text-white">{session.role} - AI Session Audit</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#0B2119] hover:bg-[#0F2D23] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Overall Score</span>
              <span className="text-2xl font-black text-emerald-400">{session.score}%</span>
            </div>
            <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Technical Depth</span>
              <span className="text-2xl font-black text-teal-300">{session.technical || 75}%</span>
            </div>
            <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Communication</span>
              <span className="text-2xl font-black text-cyan-300">{session.communication || 80}%</span>
            </div>
            <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">STAR Structure</span>
              <span className="text-2xl font-black text-lime-400">{session.structure || 70}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Strong Performance Highlights
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Articulated clear system architecture components.</li>
                <li>Good vocal clarity and deliberate speech pacing.</li>
              </ul>
            </div>

            <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" /> Priority Areas for Improvement
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {session.weaknesses && session.weaknesses.length > 0 ? (
                  session.weaknesses.map((w: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 text-[10px] font-bold rounded">
                      {w}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">STAR Structure, Technical Terminology</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Questions & AI Evaluation Summary</span>
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">Question 1: Technical System Design</span>
                <p className="text-xs text-slate-300 italic">"How would you design a rate limiter for an API with millions of users?"</p>
                <div className="p-2.5 bg-[#040D0A] rounded-xl text-[11px] text-slate-300">
                  <strong className="text-emerald-400">AI Feedback:</strong> Excellent mention of Token Bucket algorithm and Redis counter storage. Recommend explicitly mentioning fallback handling when Redis is unreachable.
                </div>
              </div>

              <div className="p-4 bg-[#061410] rounded-2xl border border-emerald-500/15 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">Question 2: Behavioral STAR Scenario</span>
                <p className="text-xs text-slate-300 italic">"Describe a situation where you had to push back on a product requirement due to technical constraints."</p>
                <div className="p-2.5 bg-[#040D0A] rounded-xl text-[11px] text-slate-300">
                  <strong className="text-teal-300">AI Feedback:</strong> Good explanation of the Situation and Action. Make sure to quantify the final Outcome (e.g. saved 20% latency).
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-emerald-500/20 bg-[#061410] flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Award className="w-4 h-4 text-emerald-400" /> Session ID: {session.identifier || 'SESSION-108'}
          </span>
          <button
            onClick={handleRetake}
            className="py-2 px-5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Re-Take This Role Mock</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;

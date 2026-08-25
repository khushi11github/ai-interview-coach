import React, { useState } from 'react';
import { X, Target, Building2, Briefcase, Award, Check } from 'lucide-react';

interface TargetRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  currentCompany: string;
  currentLevel: string;
  onSave: (role: string, company: string, level: string) => void;
}

export const TargetRoleModal: React.FC<TargetRoleModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentCompany,
  currentLevel,
  onSave
}) => {
  const [role, setRole] = useState(currentRole);
  const [company, setCompany] = useState(currentCompany);
  const [level, setLevel] = useState(currentLevel);

  if (!isOpen) return null;

  const roleOptions = [
    'Senior Full Stack Engineer',
    'System Architect',
    'Senior Frontend Engineer',
    'Backend Engineer',
    'AI / ML Engineer',
    'Product Manager',
    'DevOps & Infrastructure Lead'
  ];

  const companyOptions = [
    'FAANG / Big Tech',
    'High Growth Unicorn Startup',
    'Enterprise Fintech / Banking',
    'Web3 / Crypto Protocol',
    'General Tech Companies'
  ];

  const levelOptions = [
    'Junior (0 - 2 yrs)',
    'Mid-Level (3 - 5 yrs)',
    'Senior (6 - 8 yrs)',
    'Staff / Lead (9+ yrs)'
  ];

  const handleSave = () => {
    onSave(role, company, level);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Target Career Settings</h2>
              <p className="text-xs text-slate-400">Configure evaluation benchmarks & AI persona</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Target Role */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Role Title</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-cyan-500/50"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r} className="bg-slate-950 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Target Company Tier */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Company Benchmark</span>
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500/50"
            >
              {companyOptions.map((c) => (
                <option key={c} value={c} className="bg-slate-950 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Target Level */}
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Experience Level</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levelOptions.map((l) => {
                const isSelected = level === l;
                return (
                  <div
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-xs'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{l}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Save Target Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetRoleModal;

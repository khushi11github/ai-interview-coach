import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Target, Video, FileText, Sparkles, CheckCircle2, ArrowUpRight, Play, Award, Bot } from 'lucide-react';

import DashboardHeader from './dashboard/DashboardHeader';
import ReadinessGauge from './dashboard/ReadinessGauge';
import QuickPracticeStudio from './dashboard/QuickPracticeStudio';
import StudyPlanTab from './dashboard/StudyPlanTab';
import SkillMatrixTab from './dashboard/SkillMatrixTab';
import SessionVaultTab from './dashboard/SessionVaultTab';
import AICopilotTab from './dashboard/AICopilotTab';
import AICoachWidget from './dashboard/AICoachWidget';
import TargetRoleModal from './dashboard/TargetRoleModal';

interface HistorySession {
  identifier: string;
  date: string;
  role: string;
  difficulty: string;
  score: number;
  technical: number;
  communication: number;
  structure: number;
  confidence: number;
  qaCount: number;
  weaknesses: string[];
}

interface ResumeData {
  score: number;
  role: string;
  filename: string;
  foundKeywords: string[];
  missingKeywords: string[];
  improvements: any[];
}

const initialDemoHistory: HistorySession[] = [
  {
    identifier: 'SESSION-101',
    date: '2026-08-24',
    role: 'Senior Full Stack Engineer',
    difficulty: 'Hard',
    score: 84,
    technical: 88,
    communication: 82,
    structure: 78,
    confidence: 85,
    qaCount: 4,
    weaknesses: ['STAR Structure', 'System Scaling Bottlenecks']
  },
  {
    identifier: 'SESSION-102',
    date: '2026-08-22',
    role: 'System Architect',
    difficulty: 'Hard',
    score: 79,
    technical: 82,
    communication: 76,
    structure: 74,
    confidence: 80,
    qaCount: 4,
    weaknesses: ['Database Partitioning', 'Elaborate Answers']
  },
  {
    identifier: 'SESSION-103',
    date: '2026-08-19',
    role: 'Behavioral & Leadership',
    difficulty: 'Medium',
    score: 88,
    technical: 85,
    communication: 92,
    structure: 86,
    confidence: 90,
    qaCount: 5,
    weaknesses: ['Quantifying Impact Metrics']
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'matrix' | 'vault' | 'ai'>('overview');
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [userState, setUserState] = useState(() => {
    try {
      const userJson = localStorage.getItem('user');
      const u = userJson ? JSON.parse(userJson) : {};
      return {
        name: u.name || 'Interviewee',
        email: u.email || 'user@coach.ai',
        targetRole: u.targetRole || 'Senior Full Stack Engineer',
        targetCompany: u.targetCompany || 'FAANG / Big Tech',
        experienceLevel: u.experienceLevel || 'Senior (6 - 8 yrs)',
        streakDays: u.streakDays || 5
      };
    } catch (e) {
      return {
        name: 'Interviewee',
        email: 'user@coach.ai',
        targetRole: 'Senior Full Stack Engineer',
        targetCompany: 'FAANG / Big Tech',
        experienceLevel: 'Senior (6 - 8 yrs)',
        streakDays: 5
      };
    }
  });

  useEffect(() => {
    try {
      const historyData = localStorage.getItem('interviewHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      } else {
        setHistory(initialDemoHistory);
      }

      const resumeData = localStorage.getItem('resumeAnalysis');
      if (resumeData) {
        setResume(JSON.parse(resumeData));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  }, []);

  const handleSaveRoleSettings = (newRole: string, newCompany: string, newLevel: string) => {
    const updatedUser = {
      ...userState,
      targetRole: newRole,
      targetCompany: newCompany,
      experienceLevel: newLevel
    };
    setUserState(updatedUser);

    try {
      const existing = localStorage.getItem('user');
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem('user', JSON.stringify({ ...parsed, ...updatedUser }));
    } catch (e) {
      console.error('Error saving user target settings:', e);
    }
  };

  const sessionsCount = history.length;
  const avgScore = sessionsCount > 0
    ? Math.round(history.reduce((sum, s) => sum + s.score, 0) / sessionsCount)
    : 78;

  const avgTechnical = sessionsCount > 0
    ? Math.round(history.reduce((sum, s) => sum + s.technical, 0) / sessionsCount)
    : 80;

  const avgCommunication = sessionsCount > 0
    ? Math.round(history.reduce((sum, s) => sum + s.communication, 0) / sessionsCount)
    : 84;

  const avgStructure = sessionsCount > 0
    ? Math.round(history.reduce((sum, s) => sum + s.structure, 0) / sessionsCount)
    : 75;

  const avgConfidence = sessionsCount > 0
    ? Math.round(history.reduce((sum, s) => sum + s.confidence, 0) / sessionsCount)
    : 82;

  const momentum = 6;

  const tabs = [
    { id: 'overview', label: 'Overview & Cockpit', icon: LayoutDashboard, badge: null },
    { id: 'ai', label: 'AI Assistant & Evaluator', icon: Bot, badge: 'AI Live' },
    { id: 'plan', label: '7-Day AI Prep Plan', icon: Calendar, badge: 'Sprint' },
    { id: 'matrix', label: 'Skill Matrix & Radar', icon: Target, badge: 'Analytics' },
    { id: 'vault', label: 'Session History Vault', icon: Video, badge: `${sessionsCount}` }
  ];

  return (
    <div className="dashboard-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      
      {/* Executive Command Header */}
      <DashboardHeader
        userName={userState.name}
        targetRole={userState.targetRole}
        targetCompany={userState.targetCompany}
        experienceLevel={userState.experienceLevel}
        streakDays={userState.streakDays}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onSelectTab={(t) => setActiveTab(t as any)}
      />

      {/* Main Tab Switcher Bar */}
      <div className="glass-panel rounded-2xl p-1.5 border border-emerald-500/20 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-[#061410] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-[#040D0A] text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/interview')}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-300" />
          <span>Quick Chamber</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ReadinessGauge
                score={avgScore}
                technical={avgTechnical}
                communication={avgCommunication}
                structure={avgStructure}
                confidence={avgConfidence}
                momentum={momentum}
                onExploreSkillMatrix={() => setActiveTab('matrix')}
              />
            </div>

            <div className="lg:col-span-5">
              <QuickPracticeStudio />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Resume ATS Audit</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-[#061410] px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {resume ? resume.filename : 'Default Resume'}
                  </span>
                </div>

                <div className="flex items-center gap-4 my-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl font-black text-emerald-400">
                    {resume ? `${resume.score}%` : '86%'}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">ATS Target Compatibility</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Matched against <strong className="text-white">{userState.targetRole}</strong> requirements.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Scanned Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-md">
                      ✓ React 19
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-md">
                      ✓ TypeScript
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-md">
                      ✓ System Design
                    </span>
                    <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md">
                      ! Redis Caching
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/resume-analyzer')}
                className="mt-6 w-full py-2.5 px-4 bg-[#061410] hover:bg-[#0A211B] border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Full Resume Scanner</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Recommended Action Plan</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    High Priority
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">Strengthen STAR Method Quantification</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Based on your latest 3 mock interview evaluations, your technical depth is high (88%), but your behavioral responses lack specific percentage metrics when explaining project outcomes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#040D0A]/70 rounded-2xl border border-emerald-500/15 flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Step 1: Metric Prep</strong>
                      <span className="text-slate-400 text-[11px]">List 3 quantified achievements (e.g. "reduced latency by 35%").</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#040D0A]/70 rounded-2xl border border-emerald-500/15 flex items-start gap-2 text-xs">
                    <Award className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Step 2: 7-Day Sprint</strong>
                      <span className="text-slate-400 text-[11px]">Complete Day 4 Behavioral STAR exercises.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('plan')}
                  className="flex-1 py-2.5 px-4 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View 7-Day Roadmap</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-md"
                >
                  <Bot className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Open AI Assistant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && <AICopilotTab targetRole={userState.targetRole} />}

      {activeTab === 'plan' && <StudyPlanTab targetRole={userState.targetRole} />}

      {activeTab === 'matrix' && <SkillMatrixTab history={history} />}

      {activeTab === 'vault' && <SessionVaultTab history={history} />}

      <AICoachWidget targetRole={userState.targetRole} />

      <TargetRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={userState.targetRole}
        currentCompany={userState.targetCompany}
        currentLevel={userState.experienceLevel}
        onSave={handleSaveRoleSettings}
      />
    </div>
  );
};

export default Dashboard;

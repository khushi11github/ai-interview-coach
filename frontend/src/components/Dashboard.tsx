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
import WhyChooseSection from './dashboard/WhyChooseSection';

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
    <div className="dashboard-container w-full px-4 sm:px-8 lg:px-10 py-6 space-y-8 select-none">
      
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
      <div className="bg-white rounded-2xl p-2 border-0 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-0'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-100 text-slate-500'
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
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs border-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Quick Chamber</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-8 w-full">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
            <div className="lg:col-span-7 flex flex-col">
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

            <div className="lg:col-span-5 flex flex-col">
              <QuickPracticeStudio />
            </div>
          </div>

          {/* Open Section: ATS Audit & Recommended Action Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
            {/* ATS Section */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border-0 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Resume ATS Audit</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {resume ? resume.filename : 'Default Resume'}
                  </span>
                </div>

                <div className="flex items-center gap-5 my-4">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-0 flex items-center justify-center text-3xl font-black text-emerald-700 shrink-0">
                    {resume ? `${resume.score}%` : '86%'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">ATS Target Compatibility</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Matched against <strong className="text-slate-800">{userState.targetRole}</strong> job description keywords.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Detected Keyword Match</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border-0">
                      ✓ React 19
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border-0">
                      ✓ TypeScript
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border-0">
                      ✓ System Design
                    </span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border-0">
                      ! Redis Caching
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/resume-analyzer')}
                className="mt-8 w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border-0 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open Full Resume Scanner</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Action Plan Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border-0 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>AI Recommended Action Plan</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border-0">
                    High Priority
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Strengthen STAR Method Quantification</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Based on your latest 3 mock interview evaluations, your technical depth is high (88%), but your behavioral responses lack specific percentage metrics when explaining project outcomes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border-0 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Step 1: Metric Prep</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      List 3 quantified achievements (e.g. "reduced latency by 35%").
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border-0 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>Step 2: 7-Day Sprint</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Complete Day 4 Behavioral STAR exercises in study roadmap.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('plan')}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border-0"
                >
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>View 7-Day Roadmap</span>
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-xs"
                >
                  <Bot className="w-4 h-4 fill-white" />
                  <span>Open AI Assistant</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Why Choose Us Section ── */}
          <WhyChooseSection />
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

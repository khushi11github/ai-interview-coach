import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Video, FileText, CheckCircle, TrendingUp, AlertCircle, ArrowUpRight, Play, Sparkles } from 'lucide-react';

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
  isBinaryFallback: boolean;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);

  // Load user data and history from localStorage
  useEffect(() => {
    try {
      const historyData = localStorage.getItem('interviewHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }

      const resumeData = localStorage.getItem('resumeAnalysis');
      if (resumeData) {
        setResume(JSON.parse(resumeData));
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const gsapLib = (window as any).gsap;
    if (gsapLib) {
      const tl = gsapLib.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo('.dash-title', 
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
      .fromTo('.metric-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.4'
      )
      .fromTo('.content-panel',
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo('.history-table',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }
  }, [history, resume]);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Interviewee' };

  // Calculate aggregated stats
  const sessionsCount = history.length;
  const hasSessions = sessionsCount > 0;
  
  const avgScore = hasSessions
    ? Math.round(history.reduce((sum, s) => sum + s.score, 0) / sessionsCount)
    : 0;

  const avgTechnical = hasSessions
    ? Math.round(history.reduce((sum, s) => sum + s.technical, 0) / sessionsCount)
    : 0;

  const avgCommunication = hasSessions
    ? Math.round(history.reduce((sum, s) => sum + s.communication, 0) / sessionsCount)
    : 0;

  const avgStructure = hasSessions
    ? Math.round(history.reduce((sum, s) => sum + s.structure, 0) / sessionsCount)
    : 0;

  const avgConfidence = hasSessions
    ? Math.round(history.reduce((sum, s) => sum + s.confidence, 0) / sessionsCount)
    : 0;

  // Extract unique weak areas from history
  const weakAreas: string[] = [];
  history.forEach((s) => {
    if (s.weaknesses) {
      s.weaknesses.forEach((w) => {
        // Clean up weaknesses from report and extract keywords
        if (w.toLowerCase().includes('star')) {
          if (!weakAreas.includes('STAR Structure')) weakAreas.push('STAR Structure');
        } else if (w.toLowerCase().includes('technical') || w.toLowerCase().includes('terminology')) {
          if (!weakAreas.includes('Technical Terms')) weakAreas.push('Technical Terms');
        } else if (w.toLowerCase().includes('brief') || w.toLowerCase().includes('expand')) {
          if (!weakAreas.includes('Elaborate Answers')) weakAreas.push('Elaborate Answers');
        }
      });
    }
  });

  // Default weak areas if none detected
  if (weakAreas.length === 0 && hasSessions) {
    weakAreas.push('General Formatting', 'STAR Practice');
  }

  // Chart data configuration
  const chartData = hasSessions
    ? [
        { name: 'Technical', score: avgTechnical },
        { name: 'Communication', score: avgCommunication },
        { name: 'Structure', score: avgStructure },
        { name: 'Confidence', score: avgConfidence },
        { name: 'Overall', score: avgScore }
      ]
    : [
        { name: 'Technical', score: 70 },
        { name: 'Communication', score: 70 },
        { name: 'Structure', score: 70 },
        { name: 'Confidence', score: 70 },
        { name: 'Overall', score: 70 }
      ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 dash-title">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Welcome back, <span className="text-gradient-orange-pure">{user.name}</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze your resume, select your target role, and enter the active simulation chamber.
          </p>
        </div>

        <button 
          onClick={() => navigate('/interview')}
          className="flex items-center gap-2 px-5 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/35 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer border-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Live Mock</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Metrics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sessions Card */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 relative overflow-hidden group metric-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-orange group-hover:scale-110 transition-transform">
            <Video className="w-12 h-12" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Sessions Conducted</span>
          <span className="text-3xl font-extrabold text-zinc-100 block mt-2">{sessionsCount}</span>
          <span className="text-xs text-brand-orange font-medium flex items-center gap-1 mt-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{hasSessions ? 'Active tracking session' : 'Awaiting first mock session'}</span>
          </span>
        </div>

        {/* Avg Match Score Card */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 relative overflow-hidden group metric-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-orange group-hover:scale-110 transition-transform">
            <CheckCircle className="w-12 h-12" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Average Match Score</span>
          <span className="text-3xl font-extrabold text-zinc-100 block mt-2">
            {hasSessions ? `${avgScore}%` : '--'}
          </span>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{hasSessions ? 'Real evaluation feedback' : 'No evaluations logged'}</span>
          </span>
        </div>

        {/* ATS Score Card */}
        <div 
          onClick={() => navigate('/resume-analyzer')}
          className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 relative overflow-hidden group cursor-pointer hover:border-brand-orange/20 transition-all duration-300 metric-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-orange group-hover:scale-110 transition-transform">
            <FileText className="w-12 h-12" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Resume ATS Score</span>
          <span className="text-3xl font-extrabold text-zinc-100 block mt-2">
            {resume ? `${resume.score}%` : 'N/A'}
          </span>
          <span className="text-xs text-brand-orange font-medium flex items-center gap-1 mt-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate max-w-[180px]">{resume ? `File: ${resume.filename}` : 'Scan your resume now'}</span>
          </span>
        </div>

        {/* Weak Areas Card */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 relative overflow-hidden group metric-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-orange group-hover:scale-110 transition-transform">
            <AlertCircle className="w-12 h-12" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Identified Weak Areas</span>
          <div className="flex gap-1.5 flex-wrap mt-3">
            {weakAreas.length > 0 ? (
              weakAreas.map((area) => (
                <span key={area} className="px-2 py-0.5 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-bold rounded-md">
                  {area}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-zinc-500 font-semibold block mt-1">
                Chamber session pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Onboarding or Dashboard Analytics */}
      {!hasSessions ? (
        /* Onboarding Roadmap for New Users */
        <div className="glass-panel p-8 rounded-3xl border border-brand-dark-border relative overflow-hidden content-panel">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <span>Launch Your Preparation Roadmap</span>
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Follow this optimized path to master your target role and maximize your compatibility score.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-5 bg-brand-black border border-brand-dark-border/60 rounded-2xl relative group hover:border-brand-orange/20 transition-all duration-300">
              <span className="text-3xl font-extrabold text-brand-orange/20 group-hover:text-brand-orange/35 transition-colors absolute top-4 right-4">01</span>
              <FileText className="w-6 h-6 text-brand-orange mb-3" />
              <h3 className="text-sm font-bold text-zinc-200">Upload & Scan Resume</h3>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Scan your profile against target industry roles to discover skill gaps, key terms, and structural recommendations.
              </p>
              <button 
                onClick={() => navigate('/resume-analyzer')}
                className="mt-4 text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
              >
                <span>Upload Resume</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 bg-brand-black border border-brand-dark-border/60 rounded-2xl relative group hover:border-brand-orange/20 transition-all duration-300">
              <span className="text-3xl font-extrabold text-brand-orange/20 group-hover:text-brand-orange/35 transition-colors absolute top-4 right-4">02</span>
              <Video className="w-6 h-6 text-brand-orange mb-3" />
              <h3 className="text-sm font-bold text-zinc-200">Practice Live Chamber</h3>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Enter the live room with simulated audio-visual indicators. Practice responding using speech-to-text integration.
              </p>
              <button 
                onClick={() => navigate('/interview')}
                className="mt-4 text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
              >
                <span>Launch Chamber</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 bg-brand-black border border-brand-dark-border/60 rounded-2xl relative group hover:border-brand-orange/20 transition-all duration-300">
              <span className="text-3xl font-extrabold text-brand-orange/20 group-hover:text-brand-orange/35 transition-colors absolute top-4 right-4">03</span>
              <TrendingUp className="w-6 h-6 text-brand-orange mb-3" />
              <h3 className="text-sm font-bold text-zinc-200">Analyze Feedback Report</h3>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Inspect your verbal alignment score, structure ratings (STAR method), and view AI-curated sample answers.
              </p>
              <span className="text-[10px] font-bold text-zinc-600 uppercase block mt-5">Automatic Reporting</span>
            </div>
          </div>
        </div>
      ) : (
        /* Grid: Charts + Quick Start (When history exists) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recharts Skill Performance */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 lg:col-span-2 content-panel">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Competency Performance</h3>
                <p className="text-xs text-zinc-400">Score metrics across core software domains</p>
              </div>
              <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-lg">
                Calculated Live
              </span>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#282830" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#121214', 
                      borderColor: '#282830', 
                      borderRadius: '12px',
                      color: '#F4F4F5' 
                    }} 
                    cursor={{ fill: 'rgba(255, 107, 0, 0.05)' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#FF6B00" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Launch Cards */}
          <div className="space-y-5">
            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/20 transition-all duration-300 flex flex-col justify-between h-[180px] group relative overflow-hidden content-panel">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="p-3 bg-brand-orange/10 rounded-xl border border-brand-orange/20">
                  <FileText className="w-5 h-5 text-brand-orange" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-brand-orange transition-colors">
                  Resume Analyzer
                </h4>
                <p className="text-xs text-zinc-400">
                  Upload resume to receive ATS scores and customize interview questions.
                </p>
              </div>
              <button 
                onClick={() => navigate('/resume-analyzer')}
                className="mt-3 text-xs font-bold text-brand-orange hover:underline text-left"
              >
                Analyze Resume →
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/20 transition-all duration-300 flex flex-col justify-between h-[180px] group relative overflow-hidden content-panel">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="p-3 bg-brand-orange/10 rounded-xl border border-brand-orange/20">
                  <Video className="w-5 h-5 text-brand-orange" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-100 mb-1 group-hover:text-brand-orange transition-colors">
                  Interview Simulator (IR)
                </h4>
                <p className="text-xs text-zinc-400">
                  Start a live screen session with real voice-recognition answers.
                </p>
              </div>
              <button 
                onClick={() => navigate('/interview')}
                className="mt-3 text-xs font-bold text-brand-orange hover:underline text-left"
              >
                Configure Chamber →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent History Table */}
      {hasSessions && (
        <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 history-table">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-100">Recent Sessions</h3>
            <span className="text-xs text-zinc-400 font-semibold">Showing past evaluations</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-dark-border text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pt-2">Role</th>
                  <th className="pb-3 pt-2">Date</th>
                  <th className="pb-3 pt-2">Difficulty</th>
                  <th className="pb-3 pt-2">Questions</th>
                  <th className="pb-3 pt-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark-border/40 text-zinc-300 font-medium">
                {history.map((session, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-3 font-semibold text-zinc-200">{session.role}</td>
                    <td className="py-3 text-zinc-400">{session.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        session.difficulty === 'Easy' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/10' :
                        session.difficulty === 'Hard' ? 'bg-red-950/30 text-red-400 border border-red-500/10' :
                        'bg-brand-orange/10 text-brand-orange border border-brand-orange/10'
                      }`}>
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-400">{session.qaCount} items</td>
                    <td className="py-3 text-right font-extrabold text-brand-orange">{session.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

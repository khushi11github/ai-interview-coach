import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Sparkles, Play, Award, Lightbulb, RefreshCw } from 'lucide-react';

interface StudyPlanTabProps {
  targetRole: string;
}

interface DayPlan {
  day: number;
  title: string;
  focus: string;
  tasks: { id: string; text: string; completed: boolean }[];
  starTip: string;
  drillRole: string;
}

export const StudyPlanTab: React.FC<StudyPlanTabProps> = ({ targetRole }) => {
  const navigate = useNavigate();

  const defaultPlans: DayPlan[] = [
    {
      day: 1,
      title: 'Day 1: Resume Deep-Dive & Elevator Pitch',
      focus: 'Elevator pitch, key architecture decisions, resume alignment',
      starTip: 'Refine your 90-second "Tell me about yourself" pitch using: Hook -> Core Strengths -> Recent Major Win -> Why this role.',
      drillRole: 'Elevator Pitch & Background',
      tasks: [
        { id: 'd1-1', text: 'Craft 90-second structured introduction', completed: true },
        { id: 'd1-2', text: 'Scan resume in Resume Analyzer for ATS keyword gaps', completed: true },
        { id: 'd1-3', text: 'Prepare metric-driven story for top 2 listed projects', completed: false }
      ]
    },
    {
      day: 2,
      title: 'Day 2: System Architecture & Distributed Systems',
      focus: 'Caching, Load Balancing, Microservices, API Design',
      starTip: 'Always clarify scale first: Write down QPS, Read/Write ratio, and latency SLAs before drawing boxes.',
      drillRole: 'System Architect',
      tasks: [
        { id: 'd2-1', text: 'Review database partitioning & index strategies (B-Tree vs LSM)', completed: false },
        { id: 'd2-2', text: 'Practice 15-min mock on designing a Distributed Rate Limiter', completed: false },
        { id: 'd2-3', text: 'Review Redis caching strategies (Cache-Aside, Write-Through)', completed: false }
      ]
    },
    {
      day: 3,
      title: 'Day 3: Data Structures & High-Frequency Algorithms',
      focus: 'Trees, Graphs, Dynamic Programming, Two Pointers',
      starTip: 'Verbalize edge cases before writing code: Null inputs, duplicates, empty arrays, integer overflows.',
      drillRole: 'Software Engineer',
      tasks: [
        { id: 'd3-1', text: 'Solve 2 medium graph traversal problems (BFS/DFS)', completed: false },
        { id: 'd3-2', text: 'Practice explaining Time & Space complexity out loud', completed: false },
        { id: 'd3-3', text: 'Review Sliding Window and Monotonic Stack patterns', completed: false }
      ]
    },
    {
      day: 4,
      title: 'Day 4: Behavioral & STAR Method Mastery',
      focus: 'Conflict resolution, failure & recovery, leadership',
      starTip: 'Use STAR method: Situation (15%), Task (10%), Action (60%), Result with quantifiable metrics (15%).',
      drillRole: 'Behavioral & Leadership',
      tasks: [
        { id: 'd4-1', text: 'Prepare 3 STAR stories for "A time you disagreed with a decision"', completed: false },
        { id: 'd4-2', text: 'Prepare 2 STAR stories for "A project that failed or missed deadline"', completed: false },
        { id: 'd4-3', text: 'Run 1 Behavioral mock session in AI Chamber', completed: false }
      ]
    },
    {
      day: 5,
      title: 'Day 5: Frontend Architecture & Web Performance',
      focus: 'State management, SSR/SSG, bundle optimization, Web Vitals',
      starTip: 'Focus on user-centric performance metrics: LCP, CLS, INP, and memory leak prevention.',
      drillRole: 'Senior Frontend Engineer',
      tasks: [
        { id: 'd5-1', text: 'Review React 19 concurrent features and state colocation', completed: false },
        { id: 'd5-2', text: 'Practice explaining micro-frontend vs monolith trade-offs', completed: false },
        { id: 'd5-3', text: 'Review WebSockets vs Server-Sent Events vs Polling', completed: false }
      ]
    },
    {
      day: 6,
      title: 'Day 6: Full Simulation Mock Chamber',
      focus: 'Full-length 4-question timed interview simulation under pressure',
      starTip: 'Pace yourself: Spend 1 min outlining your response structure before diving into detailed answers.',
      drillRole: targetRole,
      tasks: [
        { id: 'd6-1', text: 'Complete 1 full live voice simulation chamber session', completed: false },
        { id: 'd6-2', text: 'Review detailed feedback report and score analysis', completed: false },
        { id: 'd6-3', text: 'Re-record weak answers until score hits 80%+', completed: false }
      ]
    },
    {
      day: 7,
      title: 'Day 7: Final Polish & Reverse Interview Strategy',
      focus: 'Questions for interviewer, confidence building, final review',
      starTip: 'Ask thoughtful questions: "What does success look like for this role in the first 90 days?"',
      drillRole: targetRole,
      tasks: [
        { id: 'd7-1', text: 'Prepare 4 high-impact questions for hiring manager', completed: false },
        { id: 'd7-2', text: 'Final review of key framework architecture diagrams', completed: false },
        { id: 'd7-3', text: 'Rest and mental preparation before real interview day', completed: false }
      ]
    }
  ];

  const [plans, setPlans] = useState<DayPlan[]>(() => {
    try {
      const saved = localStorage.getItem('studyPlanState');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading study plan state:', e);
    }
    return defaultPlans;
  });

  useEffect(() => {
    try {
      localStorage.setItem('studyPlanState', JSON.stringify(plans));
    } catch (e) {
      console.error('Error saving study plan state:', e);
    }
  }, [plans]);

  const toggleTask = (dayNum: number, taskId: string) => {
    setPlans((prev) =>
      prev.map((day) => {
        if (day.day !== dayNum) return day;
        return {
          ...day,
          tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      })
    );
  };

  const resetPlan = () => {
    setPlans(defaultPlans);
    localStorage.removeItem('studyPlanState');
  };

  const totalTasks = plans.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = plans.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const startDrill = (role: string) => {
    localStorage.setItem(
      'quickDrillConfig',
      JSON.stringify({ role, difficulty: 'Medium', topic: 'Sprint Drill' })
    );
    navigate('/interview');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold badge-neon-emerald flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI 7-Day Sprint Plan</span>
              </span>
              <span className="text-xs text-slate-300">Tailored for: <strong className="text-white">{targetRole}</strong></span>
            </div>
            <h2 className="text-2xl font-black text-white">Interview Preparation Sprint</h2>
            <p className="text-xs text-slate-400 mt-1">
              Follow this structured day-by-day roadmap to ensure 100% coverage of target competencies.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-4 bg-[#061410] px-5 py-3 rounded-2xl border border-emerald-500/20">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block">Sprint Progress</span>
              <span className="text-xl font-black text-emerald-400">{progressPercent}%</span>
              <span className="text-[10px] text-slate-400 block">({completedTasks}/{totalTasks} Tasks)</span>
            </div>
            <div className="w-20 h-2 bg-[#0A211B] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <button
              onClick={resetPlan}
              title="Reset Sprint Progress"
              className="p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((day) => {
          const dayCompleted = day.tasks.every((t) => t.completed);
          return (
            <div
              key={day.day}
              className={`glass-panel rounded-3xl p-6 border transition-all duration-300 relative ${
                dayCompleted
                  ? 'border-emerald-400/60 bg-[#061C15]'
                  : 'border-emerald-500/20 hover:border-emerald-400/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                    dayCompleted ? 'bg-emerald-400 text-slate-950 shadow-xs' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    D{day.day}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{day.title}</h3>
                    <p className="text-[11px] text-slate-300 font-medium">{day.focus}</p>
                  </div>
                </div>

                {dayCompleted && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3" /> Complete
                  </span>
                )}
              </div>

              <div className="space-y-2 my-4 bg-[#040D0A]/60 p-3.5 rounded-2xl border border-emerald-500/10">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(day.day, task.id)}
                    className="flex items-center gap-2.5 text-xs cursor-pointer select-none group"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 shrink-0 transition-colors" />
                    )}
                    <span className={`leading-tight transition-all ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#051A14] border border-teal-500/30 p-3 rounded-xl mb-4 flex items-start gap-2 text-[11px]">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-teal-200 leading-relaxed"><strong className="text-teal-100">Pro Tip:</strong> {day.starTip}</p>
              </div>

              <button
                onClick={() => startDrill(day.drillRole)}
                className="w-full py-2.5 px-4 bg-[#061410] hover:bg-[#0A211B] border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>Practice {day.drillRole} Drill</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyPlanTab;

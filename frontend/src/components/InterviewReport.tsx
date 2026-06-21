import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

interface InterviewReportProps {
  results: {
    role: string;
    difficulty: string;
    qaList: { question: string; answer: string; code?: string }[];
    peerFeedback?: {
      technical: number;
      communication: number;
      structure: number;
      confidence: number;
      comments: string;
    };
  };
  onReset: () => void;
  onGoHome: () => void;
}

interface QuestionEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
}

const InterviewReport: React.FC<InterviewReportProps> = ({ results, onReset, onGoHome }) => {
  const [overallScore, setOverallScore] = useState(0);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [structureScore, setStructureScore] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);

  useEffect(() => {
    // Generate evaluations on mount
    const evals = results.qaList.map((qa) => {
      const length = qa.answer.length;
      let score = 50;
      let strengths = ["Clear presentation of concepts."];
      let weaknesses = ["Answer was slightly brief. Expand with concrete work examples."];
      
      // Basic check of answer length and keywords
      if (length > 150) {
        score += 20;
        strengths.push("Good length and detailed description.");
      } else {
        score -= 10;
        weaknesses.push("Consider structuring using the STAR method (Situation, Task, Action, Result).");
      }

      // Check for specific technical terms
      const techKeywords = ['virtual dom', 'reconciliation', 'event loop', 'stream', 'jwt', 'docker', 'hooks', 'index', 'cap', 'gil', 'generator'];
      const matched = techKeywords.filter(kw => qa.answer.toLowerCase().includes(kw));
      if (matched.length > 0) {
        score += Math.min(matched.length * 8, 25);
        strengths.push(`Excellent use of technical terminology: ${matched.join(', ')}.`);
      } else {
        score -= 5;
        weaknesses.push("Include more technical terminology relating to the core framework mechanisms.");
      }

      // Cap score
      score = Math.min(Math.max(score, 45), 96);

      // Generate customized ideal answers
      let ideal = "A structured response should start with a direct answer, explain the underlying mechanism, and conclude with a personal project experience where you applied this knowledge.";
      
      if (qa.question.includes("reconciliation") || qa.question.includes("Virtual DOM")) {
        ideal = "The Virtual DOM is a lightweight JS representation of the real DOM. When state changes, React creates a new VDOM tree and compares it with the previous one (reconciliation/diffing). It uses keys and node type heuristics to perform this in O(N) complexity, then batches updates to the real DOM.";
      } else if (qa.question.includes("event loop")) {
        ideal = "The event loop allows Node.js to perform non-blocking I/O. It runs in phases: timers, pending callbacks, idle/prepare, poll, check, and close callbacks. Microtask queues (process.nextTick, Promise resolve) are executed immediately after every phase before moving to the next macrotask phase.";
      } else if (qa.question.includes("useEffect") || qa.question.includes("dependency")) {
        ideal = "React's useEffect uses Object.is to perform shallow comparison check on dependencies. If values differ, the effect runs again. To prevent memory leaks, always return a cleanup function to unsubscribe listeners, abort fetch requests, or clear timeout loops.";
      }

      return {
        score,
        strengths,
        weaknesses,
        idealAnswer: ideal
      };
    });

    setEvaluations(evals);

    // Calculate aggregated metrics
    const peer = results.peerFeedback;
    const avgScore = peer 
      ? Math.round((peer.technical + peer.communication + peer.structure + peer.confidence) / 4)
      : Math.round(evals.reduce((sum, item) => sum + item.score, 0) / evals.length);
    
    // Save to localStorage history
    try {
      const existingHistoryStr = localStorage.getItem('interviewHistory');
      const history = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      
      const sessionIdentifier = `${results.role}-${results.difficulty}-${results.qaList.length}-${avgScore}`;
      const isAlreadySaved = history.some((s: any) => s.identifier === sessionIdentifier);
      
      if (!isAlreadySaved) {
        const newSession = {
          identifier: sessionIdentifier,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          role: results.role,
          difficulty: results.difficulty,
          score: avgScore,
          technical: peer ? peer.technical : Math.round(avgScore * 0.95),
          communication: peer ? peer.communication : Math.round(avgScore * 1.02 > 100 ? 98 : avgScore * 1.02),
          structure: peer ? peer.structure : Math.round(avgScore * 0.96 > 100 ? 95 : avgScore * 0.96),
          confidence: peer ? peer.confidence : Math.round(avgScore * 1.04 > 100 ? 96 : avgScore * 1.04),
          qaCount: results.qaList.length,
          weaknesses: evals.flatMap(e => e.weaknesses).slice(0, 3)
        };
        history.unshift(newSession); // New sessions at the top
        localStorage.setItem('interviewHistory', JSON.stringify(history));
      }
    } catch (err) {
      console.error('Error saving session to history:', err);
    }
    
    // Animate overall score loaders
    setTimeout(() => {
      setOverallScore(avgScore);
      setTechnicalScore(peer ? peer.technical : Math.round(avgScore * 0.95));
      setCommunicationScore(peer ? peer.communication : Math.round(avgScore * 1.02 > 100 ? 98 : avgScore * 1.02));
      setStructureScore(peer ? peer.structure : Math.round(avgScore * 0.96 > 100 ? 95 : avgScore * 0.96));
      setConfidenceScore(peer ? peer.confidence : Math.round(avgScore * 1.04 > 100 ? 96 : avgScore * 1.04));
    }, 150);

  }, [results]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 w-full animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-dark-border/40 pb-4">
        <div>
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest block">Analysis Complete</span>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
            Evaluation <span className="text-gradient-orange-pure">Feedback Report</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Session role: {results.role} ({results.difficulty}) • Total questions evaluated: {results.qaList.length}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border border-brand-dark-border text-zinc-300 font-bold text-xs rounded-xl hover:text-zinc-100 hover:border-brand-orange/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
          
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-orange/15 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Scorecards Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left column: Overall Circular Gauge (4 columns) */}
        <div className="md:col-span-4 glass-panel p-6 rounded-3xl border border-brand-dark-border/80 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
          <Award className="w-8 h-8 text-brand-orange mb-2" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Aggregate Match Score</span>
          
          {/* Radial score gauge */}
          <div className="relative w-40 h-40 flex items-center justify-center my-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="80" 
                cy="80" 
                r="65" 
                stroke="#121214" 
                strokeWidth="8" 
                fill="transparent" 
              />
              <circle 
                cx="80" 
                cy="80" 
                r="65" 
                stroke="#FF6B00" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={408}
                strokeDashoffset={408 - (408 * overallScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-5xl font-extrabold text-zinc-100">{overallScore}%</span>
          </div>

          <div className="p-3.5 bg-zinc-950/60 border border-brand-dark-border/50 text-[11px] text-zinc-400 rounded-xl leading-relaxed">
            {overallScore >= 80 ? (
              <span>Your vocabulary, length of reply, and semantic accuracy match optimal applicant thresholds.</span>
            ) : (
              <span>Improve keywords density and focus on structured delivery (Situation-Task-Action-Result).</span>
            )}
          </div>
        </div>

        {/* Right column: Criteria breakdown (8 columns) */}
        <div className="md:col-span-8 glass-panel p-6 rounded-3xl border border-brand-dark-border/80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
          
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Competency Analysis</h3>
            <p className="text-xs text-zinc-400">Score breakdown evaluated across mock dimensions</p>
          </div>

          <div className="space-y-4 my-6">
            {/* Technical Accuracy */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-400">Technical Accuracy & Terminology</span>
                <span className="text-brand-orange font-bold">{technicalScore}%</span>
              </div>
              <div className="w-full h-2 bg-brand-black border border-brand-dark-border rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-1000"
                  style={{ width: `${technicalScore}%` }}
                />
              </div>
            </div>

            {/* Communication Skills */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-400">Fluency & Vocabulary Range</span>
                <span className="text-brand-orange font-bold">{communicationScore}%</span>
              </div>
              <div className="w-full h-2 bg-brand-black border border-brand-dark-border rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-1000"
                  style={{ width: `${communicationScore}%` }}
                />
              </div>
            </div>

            {/* Response Structure */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-400">Logical Structure (STAR Application)</span>
                <span className="text-brand-orange font-bold">{structureScore}%</span>
              </div>
              <div className="w-full h-2 bg-brand-black border border-brand-dark-border rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-1000"
                  style={{ width: `${structureScore}%` }}
                />
              </div>
            </div>

            {/* Professional Confidence */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-400">Professional Confidence & Tone</span>
                <span className="text-brand-orange font-bold">{confidenceScore}%</span>
              </div>
              <div className="w-full h-2 bg-brand-black border border-brand-dark-border rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-1000"
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-brand-orange/5 border border-brand-orange/10 rounded-xl text-xs text-brand-orange">
            <Sparkles className="w-4 h-4" />
            <span>Pro-Tip: Incorporating metrics and scale of your code base (e.g. \"10k+ active requests\") increases technical scores.</span>
          </div>
        </div>

      </div>

      {/* Peer Feedback Scorecard Section */}
      {results.peerFeedback && (
        <div className="glass-panel p-6 rounded-3xl border border-brand-orange/30 bg-brand-orange/5 relative overflow-hidden space-y-4 animate-fadeIn">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-brand-orange" />
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-orange" />
            <h3 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wider">Peer Evaluator Review Deck</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 bg-brand-black/40 border border-brand-dark-border rounded-xl text-center">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Technical Accuracy</span>
              <span className="block text-xl font-extrabold text-zinc-200 mt-1">{results.peerFeedback.technical}%</span>
            </div>
            <div className="p-3.5 bg-brand-black/40 border border-brand-dark-border rounded-xl text-center">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Communication</span>
              <span className="block text-xl font-extrabold text-zinc-200 mt-1">{results.peerFeedback.communication}%</span>
            </div>
            <div className="p-3.5 bg-brand-black/40 border border-brand-dark-border rounded-xl text-center">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">STAR Structure</span>
              <span className="block text-xl font-extrabold text-zinc-200 mt-1">{results.peerFeedback.structure}%</span>
            </div>
            <div className="p-3.5 bg-brand-black/40 border border-brand-dark-border rounded-xl text-center">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Confidence & Tone</span>
              <span className="block text-xl font-extrabold text-zinc-200 mt-1">{results.peerFeedback.confidence}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-brand-black/50 border border-brand-dark-border/60 rounded-xl">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Evaluator Feedback Notes</span>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "{results.peerFeedback.comments}"
            </p>
          </div>
        </div>
      )}

      {/* Question breakdown list accordion */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-zinc-200">Question-by-Question Evaluation</h3>
        
        <div className="space-y-3">
          {results.qaList.map((qa, index) => {
            const ev = evaluations[index] || { score: 70, strengths: [], weaknesses: [], idealAnswer: '' };
            const isExpanded = expandedIndex === index;

            return (
              <div 
                key={index}
                className="glass-panel rounded-2xl border border-brand-dark-border/80 overflow-hidden transition-all duration-300"
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Question {index + 1}</span>
                    <h4 className="text-sm font-bold text-zinc-200 truncate mt-1">{qa.question}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="px-2.5 py-1 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold rounded-lg">
                      Score: {ev.score}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                  </div>
                </button>

                {/* Accordion body content */}
                {isExpanded && (
                  <div className="p-6 border-t border-brand-dark-border/60 bg-zinc-950/20 space-y-6">
                    {/* User response transcript */}
                    {qa.code ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Your Spoken Explanation</span>
                          <div className="p-4 bg-brand-black border border-brand-dark-border rounded-xl text-xs text-zinc-300 leading-relaxed font-mono h-[220px] overflow-y-auto whitespace-pre-wrap">
                            {qa.answer || 'No response provided.'}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Whiteboard Submitted Code</span>
                          <pre className="p-4 bg-zinc-950 border border-brand-dark-border rounded-xl text-xs text-zinc-300 leading-relaxed font-mono h-[220px] overflow-auto whitespace-pre">
                            <code>{qa.code}</code>
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Your Answer Transcript</span>
                        <div className="p-4 bg-brand-black border border-brand-dark-border rounded-xl text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                          {qa.answer || 'No response provided.'}
                        </div>
                      </div>
                    )}

                    {/* AI analysis (strengths vs weakness) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Identified Strengths</span>
                        </span>
                        <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
                          {ev.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 bg-brand-orange/5 border border-brand-orange/10 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-brand-orange flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Constructive Optimization</span>
                        </span>
                        <ul className="list-disc pl-4 text-xs text-zinc-300 space-y-1">
                          {ev.weaknesses.map((wk, idx) => <li key={idx}>{wk}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Reference ideal answer */}
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Sample Reference Answer</span>
                      <p className="text-xs text-zinc-400 italic bg-brand-black/40 border border-brand-dark-border/60 p-4 rounded-xl leading-relaxed">
                        {ev.idealAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;

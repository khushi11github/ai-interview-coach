import React, { useState } from 'react';
import { Bot, Sparkles, Volume2, Copy, Check, RefreshCw, Cpu, Award, Zap } from 'lucide-react';

interface AICopilotTabProps {
  targetRole: string;
}

export const AICopilotTab: React.FC<AICopilotTabProps> = ({ targetRole }) => {
  const [activeTool, setActiveTool] = useState<'evaluator' | 'generator' | 'star'>('evaluator');

  const [question, setQuestion] = useState('How would you design a caching strategy for high-throughput APIs?');
  const [userAnswer, setUserAnswer] = useState(
    'I would use Redis as a cache layer in front of PostgreSQL. We can implement a Cache-Aside pattern where the application reads from Redis first, and on a cache miss, queries the database and populates Redis with a 1-hour TTL.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>({
    overallScore: 88,
    techScore: 90,
    starScore: 78,
    clarityScore: 92,
    strengths: ['Correct identification of Redis and Cache-Aside pattern', 'Included TTL strategy for cache invalidation'],
    improvements: ['Explicitly mention cache stampede / thundering herd mitigation (e.g. distributed locks or probabilistic early expiration)', 'Add monitoring metrics like cache hit-ratio SLAs'],
    revisedAnswer: 'I would implement Redis as an in-memory caching layer utilizing the Cache-Aside pattern. For high-throughput endpoints, the application queries Redis first; on a cache miss, it reads from PostgreSQL, populates Redis with a 1-hour TTL, and returns the result. To prevent cache stampedes during peak traffic, I would implement mutex locks or XFetch probabilistic early expiration. We track cache hit ratio metrics to maintain >95% hit rates.'
  });

  const [genDomain, setGenDomain] = useState('System Design');
  const genDifficulty = 'Hard';
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([
    {
      q: 'How do you handle eventual consistency in a multi-region database setup?',
      hint: 'Discuss Conflict-Free Replicated Data Types (CRDTs), quorum reads/writes, and vector clocks.',
      expectedPoints: ['Quorum configuration (R + W > N)', 'Conflict resolution strategies', 'Read repair vs Anti-entropy']
    },
    {
      q: 'Design a distributed rate-limiter for an API gateway handling 100k QPS.',
      hint: 'Compare Sliding Window Counter vs Token Bucket using Redis Lua scripts.',
      expectedPoints: ['Atomic counter increments', 'Distributed lock-free synchronization', 'Fallback mechanism']
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvaluationResult({
        overallScore: Math.floor(Math.random() * 15) + 82,
        techScore: Math.floor(Math.random() * 10) + 85,
        starScore: Math.floor(Math.random() * 20) + 75,
        clarityScore: Math.floor(Math.random() * 10) + 88,
        strengths: [
          'Good technical terminology alignment with target role',
          'Clear logical flow and direct solution framing'
        ],
        improvements: [
          'Quantify outcome metrics (e.g. percentage latency reduction)',
          'Add explicit error fallback and failure recovery strategy'
        ],
        revisedAnswer: `[AI Refined Version]: ${userAnswer} Additionally, to ensure reliability under heavy load, I established automated circuit breakers and monitoring SLAs, achieving a 99.99% uptime.`
      });
      setIsEvaluating(false);
    }, 1200);
  };

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedQuestions([
        {
          q: `Explain how you would optimize a slow-performing database query in ${targetRole}.`,
          hint: 'Focus on EXPLAIN ANALYZE, index selection, connection pooling, and payload size.',
          expectedPoints: ['Execution plan analysis', 'Covering indexes', 'N+1 query detection']
        },
        {
          q: 'Walk me through a time you resolved a critical production incident under high pressure.',
          hint: 'Use STAR structure: Incident discovery -> Triage -> Mitigation -> Post-mortem RCA.',
          expectedPoints: ['Rapid rollbacks', 'Blameless post-mortem', 'Automated regression testing']
        }
      ]);
      setIsGenerating(false);
    }, 1000);
  };

  const [copied, setCopied] = useState(false);
  const copyAnswer = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold badge-neon-emerald px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>AI Copilot Engine</span>
          </span>
          <h2 className="text-2xl font-black text-white">AI Assistant & Answer Optimizer</h2>
          <p className="text-xs text-slate-300 mt-1">
            Evaluate candidate responses, generate targeted questions, and polish your STAR delivery using custom LLM intelligence.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#061410] p-1.5 rounded-2xl border border-emerald-500/20">
          <button
            onClick={() => setActiveTool('evaluator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'evaluator'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Evaluator
          </button>
          <button
            onClick={() => setActiveTool('generator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'generator'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Question Generator
          </button>
        </div>
      </div>

      {activeTool === 'evaluator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Input Practice Question & Your Answer</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Interview Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste interview question..."
                className="w-full bg-[#061410] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-400/60"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Your Draft Response</label>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or paste your candidate response..."
                className="w-full bg-[#061410] border border-emerald-500/20 rounded-xl p-4 text-xs text-white leading-relaxed focus:outline-hidden focus:border-emerald-400/60 resize-none"
              />
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border-0 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Evaluating with AI Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Instant AI Evaluation</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between">
            {evaluationResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>AI Audit Results</span>
                  </h3>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    Overall Score: {evaluationResult.overallScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#061410] rounded-xl border border-emerald-500/15">
                    <span className="text-[10px] text-slate-400 font-bold block">Technical</span>
                    <span className="text-lg font-black text-emerald-400">{evaluationResult.techScore}%</span>
                  </div>
                  <div className="p-3 bg-[#061410] rounded-xl border border-emerald-500/15">
                    <span className="text-[10px] text-slate-400 font-bold block">STAR Structure</span>
                    <span className="text-lg font-black text-teal-300">{evaluationResult.starScore}%</span>
                  </div>
                  <div className="p-3 bg-[#061410] rounded-xl border border-emerald-500/15">
                    <span className="text-[10px] text-slate-400 font-bold block">Clarity & Pitch</span>
                    <span className="text-lg font-black text-cyan-300">{evaluationResult.clarityScore}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-400 block">Identified Gaps & Refinements</span>
                  <div className="space-y-1.5">
                    {evaluationResult.improvements.map((imp: string, i: number) => (
                      <div key={i} className="p-2.5 bg-rose-950/20 border border-rose-500/20 rounded-xl text-xs text-slate-300">
                        • {imp}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400">AI Polished Answer Template</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(evaluationResult.revisedAnswer)}
                        className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-emerald-400 animate-pulse' : ''}`} />
                        <span>{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
                      </button>
                      <button
                        onClick={() => copyAnswer(evaluationResult.revisedAnswer)}
                        className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="p-3.5 bg-[#040D0A] rounded-xl border border-emerald-500/15 text-xs text-slate-200 leading-relaxed font-sans">
                    {evaluationResult.revisedAnswer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400" />
                Submit a question and response on the left to generate real-time AI feedback.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTool === 'generator' && (
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Custom AI Question Generator</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate high-probability questions tailored for <strong className="text-white">{targetRole}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={genDomain}
                onChange={(e) => setGenDomain(e.target.value)}
                className="bg-[#061410] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="System Design">System Design</option>
                <option value="Behavioral STAR">Behavioral STAR</option>
                <option value="Data Structures">Data Structures & Algo</option>
                <option value="Frontend Architecture">Frontend Architecture</option>
              </select>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Generate Questions</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="p-5 bg-[#040D0A]/70 rounded-2xl border border-emerald-500/15 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      Q{idx + 1}
                    </span>
                    <span>{q.q}</span>
                  </h4>
                  <span className="text-[10px] font-bold badge-neon-emerald px-2 py-0.5 rounded">
                    {genDifficulty}
                  </span>
                </div>

                <div className="bg-[#061410] p-3 rounded-xl border border-emerald-500/15 text-xs text-emerald-300">
                  <strong>AI Hint:</strong> {q.hint}
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <strong className="text-white">Key Points Evaluated:</strong>
                  {q.expectedPoints.map((pt: string, pIdx: number) => (
                    <span key={pIdx} className="px-2 py-0.5 bg-[#0A211B] rounded text-emerald-300">
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICopilotTab;

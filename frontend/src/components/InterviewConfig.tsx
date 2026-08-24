import React, { useState, useEffect, useRef } from 'react';
import { Video, AlertCircle, FileText, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { WebRTCSync } from '../utils/p2pSync';

interface InterviewConfigProps {
  onStart: (config: {
    role: string;
    difficulty: string;
    questionsCount: number;
    useResumeQuestions: boolean;
    sessionType: 'verbal' | 'coding';
    mode: 'ai' | 'peer';
    peerRole: 'candidate' | 'interviewer';
    syncMethod: 'localtab' | 'webrtc';
    generatedQuestions?: string[];
    webrtcInstance?: any;
  }) => void;
}

const InterviewConfig: React.FC<InterviewConfigProps> = ({ onStart }) => {
  const [role, setRole] = useState('React Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionsCount, setQuestionsCount] = useState(3);
  const [hasResumeQuestions, setHasResumeQuestions] = useState(false);
  const [useResumeQuestions, setUseResumeQuestions] = useState(false);
  const [resumeRole, setResumeRole] = useState('');
  const [sessionType, setSessionType] = useState<'verbal' | 'coding'>('verbal');
  const [topic, setTopic] = useState('Core concepts');
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);

  // Multiplayer / P2P Configuration states
  const [mode, setMode] = useState<'ai' | 'peer'>('ai');
  const [peerRole, setPeerRole] = useState<'candidate' | 'interviewer'>('candidate');
  const [syncMethod, setSyncMethod] = useState<'localtab' | 'webrtc'>('localtab');

  // WebRTC Handshake states
  const [localOffer, setLocalOffer] = useState('');
  const [remoteAnswer, setRemoteAnswer] = useState('');
  const [remoteOffer, setRemoteOffer] = useState('');
  const [localAnswer, setLocalAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  const webrtcRef = useRef<any>(null);

  useEffect(() => {
    // Check if custom questions exist in localStorage
    const savedQuestions = localStorage.getItem('customQuestions');
    const savedRole = localStorage.getItem('customRole');
    if (savedQuestions && savedRole) {
      setHasResumeQuestions(true);
      setUseResumeQuestions(true);
      setRole(savedRole);
      setResumeRole(savedRole);
    }
  }, []);

  const startWebRTCHost = async () => {
    try {
      setIsGenerating(true);
      const sync = new WebRTCSync();
      webrtcRef.current = sync;
      sync.onConnectionChangeCallback = (status) => {
        setConnectionStatus(status);
      };
      const offer = await sync.createOffer();
      setLocalOffer(offer);
      setConnectionStatus('offer-generated');
    } catch (e) {
      console.error(e);
      alert('Failed to initialize WebRTC connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const connectWebRTCHost = async () => {
    if (!remoteAnswer) {
      alert('Please paste the Interviewer Answer SDP token first.');
      return;
    }
    try {
      await webrtcRef.current.setAnswer(remoteAnswer);
    } catch (e) {
      alert('Connection failed. Make sure the SDP Answer token is valid.');
    }
  };

  const generateAnswerForHost = async () => {
    if (!remoteOffer) {
      alert('Please paste the Candidate Offer SDP token first.');
      return;
    }
    try {
      setIsGenerating(true);
      const sync = new WebRTCSync();
      webrtcRef.current = sync;
      sync.onConnectionChangeCallback = (status) => {
        setConnectionStatus(status);
      };
      const answer = await sync.acceptOfferAndCreateAnswer(remoteOffer);
      setLocalAnswer(answer);
      setConnectionStatus('answer-generated');
    } catch (e) {
      alert('Failed to parse offer or generate answer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = () => {
    onStart({
      role: useResumeQuestions ? resumeRole : role,
      difficulty,
      questionsCount,
      useResumeQuestions,
      sessionType,
      mode,
      peerRole,
      syncMethod,
      generatedQuestions: generatedQuestions.length > 0 ? generatedQuestions : undefined,
      webrtcInstance: webrtcRef.current
    });
  };

  const generateQuestions = () => {
    const focus = topic === 'Core concepts' ? 'core concepts' : topic.toLowerCase();
    const questionTemplates = [
      `Explain how you would approach ${focus} as a ${role}, and describe the tradeoffs you would evaluate.`,
      `Describe a production problem involving ${focus}. How would you investigate it and measure your fix?`,
      `Design a practical ${role} solution centered on ${focus}. What would you build first, and why?`,
      `What is a common mistake engineers make with ${focus}? Give an example and explain how you would prevent it.`
    ];
    setGeneratedQuestions(questionTemplates.slice(0, questionsCount));
  };

  const clearResumeQuestions = () => {
    localStorage.removeItem('customQuestions');
    localStorage.removeItem('customRole');
    setHasResumeQuestions(false);
    setUseResumeQuestions(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Configure <span className="text-gradient-orange-pure">Mock Session</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Adjust the settings for your simulated board interview. Ensure your microphone and webcam are ready.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-brand-dark-border/80 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />

        {/* Resume tailored banner if present */}
        {hasResumeQuestions && (
          <div className="p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Resume Tailoring Active</span>
                <p className="text-xs text-zinc-300 mt-1">
                  Custom questions generated from your **{resumeRole}** resume will be loaded into the chamber.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseResumeQuestions(!useResumeQuestions)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  useResumeQuestions 
                    ? 'bg-brand-orange text-white' 
                    : 'bg-zinc-900 border border-brand-dark-border text-zinc-400'
                }`}
              >
                {useResumeQuestions ? 'Enabled' : 'Disabled'}
              </button>
              <button 
                onClick={clearResumeQuestions}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Configuration settings form */}
        <div className="space-y-5">
          {/* Simulation Mode selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Simulation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-[72px] ${
                  mode === 'ai' 
                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                    : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block font-bold">AI Evaluator (Solo)</span>
                <span className="text-[10px] text-zinc-500 font-medium block leading-snug mt-1">Practice with Agent Nova scoring your response metrics</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('peer')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-[72px] ${
                  mode === 'peer' 
                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                    : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block font-bold">Collaborative Peer (Multiplayer)</span>
                <span className="text-[10px] text-zinc-500 font-medium block leading-snug mt-1">Interview with a friend in a live synced room</span>
              </button>
            </div>
          </div>

          {mode === 'peer' && (
            <div className="p-5 bg-zinc-950/40 border border-brand-dark-border rounded-2xl space-y-4">
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">Peer Connection Settings</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Peer Role selector */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Your Role in Session
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPeerRole('candidate')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        peerRole === 'candidate'
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                          : 'bg-brand-black border-brand-dark-border text-zinc-400'
                      }`}
                    >
                      Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeerRole('interviewer')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        peerRole === 'interviewer'
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                          : 'bg-brand-black border-brand-dark-border text-zinc-400'
                      }`}
                    >
                      Interviewer
                    </button>
                  </div>
                </div>

                {/* Connection method selector */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Connection Protocol
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSyncMethod('localtab')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        syncMethod === 'localtab'
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                          : 'bg-brand-black border-brand-dark-border text-zinc-400'
                      }`}
                    >
                      Local Dual-Tab
                    </button>
                    <button
                      type="button"
                      onClick={() => setSyncMethod('webrtc')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        syncMethod === 'webrtc'
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                          : 'bg-brand-black border-brand-dark-border text-zinc-400'
                      }`}
                    >
                      Remote WebRTC
                    </button>
                  </div>
                </div>
              </div>

              {/* Protocol UI content */}
              {syncMethod === 'localtab' ? (
                <div className="p-3.5 bg-brand-black border border-brand-dark-border/60 rounded-xl space-y-2">
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    <strong>Local Dual-Tab Sync</strong> uses shared browser storage events to synchronize two windows on your computer in real-time. Excellent for self-testing or showing the dashboard side-by-side!
                  </p>
                  <button
                    type="button"
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="text-[9px] font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                  >
                    <span>Open another tab in a new window →</span>
                  </button>
                </div>
              ) : (
                /* WebRTC connection exchange string textareas */
                <div className="space-y-3 p-3.5 bg-brand-black border border-brand-dark-border/60 rounded-xl text-xs">
                  {peerRole === 'candidate' ? (
                    /* Candidate is the HOST */
                    <div className="space-y-2">
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">1. Generate & Share Offer Code</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={startWebRTCHost}
                            disabled={isGenerating}
                            className="px-2.5 py-1.5 bg-brand-orange text-white text-[10px] font-bold rounded-lg hover:bg-brand-orange-hover disabled:opacity-50 border-0 cursor-pointer"
                          >
                            {localOffer ? 'Regenerate Code' : 'Generate Connection Offer'}
                          </button>
                          {localOffer && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(localOffer);
                                alert('Offer code copied to clipboard!');
                              }}
                              className="px-2.5 py-1.5 bg-zinc-950 border border-brand-dark-border text-zinc-300 text-[10px] font-bold rounded-lg hover:text-white cursor-pointer"
                            >
                              Copy Code
                            </button>
                          )}
                        </div>
                        {localOffer && (
                          <textarea
                            readOnly
                            value={localOffer}
                            className="w-full h-12 bg-zinc-950 text-[9px] text-zinc-500 font-mono p-1 border border-zinc-900 rounded-lg mt-1 focus:outline-none resize-none select-all"
                          />
                        )}
                      </div>
                      
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">2. Paste Interviewer's Response Answer</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste the Base64 response code here..."
                            value={remoteAnswer}
                            onChange={(e) => setRemoteAnswer(e.target.value)}
                            className="flex-1 bg-zinc-950 text-[10px] text-zinc-300 border border-zinc-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-orange"
                          />
                          <button
                            type="button"
                            onClick={connectWebRTCHost}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-500 border-0 cursor-pointer"
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Interviewer is the GUEST */
                    <div className="space-y-2">
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">1. Paste Candidate's Offer Code</span>
                        <input
                          type="text"
                          placeholder="Paste Candidate's Base64 code here..."
                          value={remoteOffer}
                          onChange={(e) => setRemoteOffer(e.target.value)}
                          className="w-full bg-zinc-950 text-[10px] text-zinc-300 border border-zinc-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      
                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">2. Generate & Copy Response Answer</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={generateAnswerForHost}
                            disabled={isGenerating || !remoteOffer}
                            className="px-2.5 py-1.5 bg-brand-orange text-white text-[10px] font-bold rounded-lg hover:bg-brand-orange-hover disabled:opacity-50 border-0 cursor-pointer"
                          >
                            {localAnswer ? 'Regenerate Response' : 'Generate Response Code'}
                          </button>
                          {localAnswer && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(localAnswer);
                                alert('Response Answer copied to clipboard!');
                              }}
                              className="px-2.5 py-1.5 bg-zinc-950 border border-brand-dark-border text-zinc-300 text-[10px] font-bold rounded-lg hover:text-white cursor-pointer"
                            >
                              Copy Response
                            </button>
                          )}
                        </div>
                        {localAnswer && (
                          <textarea
                            readOnly
                            value={localAnswer}
                            className="w-full h-12 bg-zinc-950 text-[9px] text-zinc-500 font-mono p-1 border border-zinc-900 rounded-lg mt-1 focus:outline-none resize-none select-all"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Handshake Connection State */}
                  {connectionStatus && (
                    <div className="text-[10px] font-mono text-zinc-400 mt-2 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-brand-orange animate-pulse'
                      }`} />
                      <span>Status: {connectionStatus === 'connected' ? 'Connected!' : connectionStatus}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Target Role selection (Disabled if using resume questions) */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Target Interview Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={useResumeQuestions}
              className="w-full bg-brand-black text-sm text-zinc-200 border border-brand-dark-border/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <option value="React Developer">React Developer</option>
              <option value="Node.js Developer">Node.js Developer</option>
              <option value="Fullstack Engineer">Fullstack Engineer</option>
              <option value="Python Developer">Python Developer</option>
              <option value="System Design Engineer">System Design Engineer</option>
              <option value="Behavioral / HR">Behavioral / HR Interview</option>
            </select>
          </div>

          {/* Session format selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Interview format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSessionType('verbal')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-[72px] ${
                  sessionType === 'verbal' 
                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                    : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block font-bold">Verbal Q&A</span>
                <span className="text-[10px] text-zinc-500 font-medium block leading-snug mt-1">Audio synthesis & speech transcription</span>
              </button>
              <button
                type="button"
                onClick={() => setSessionType('coding')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between h-[72px] ${
                  sessionType === 'coding' 
                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                    : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="block font-bold">Coder Chamber (Whiteboard)</span>
                <span className="text-[10px] text-zinc-500 font-medium block leading-snug mt-1">Split-screen code editor next to feed</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Difficulty selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Complexity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      difficulty === diff 
                        ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                        : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionsCount(num)}
                    disabled={useResumeQuestions && num !== 3}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      questionsCount === num 
                        ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                        : 'bg-brand-black border-brand-dark-border text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-brand-orange/20 bg-brand-orange/5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-brand-orange mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Question generator</span>
                  <p className="text-xs text-zinc-400 mt-1">Create a fresh, focused question set for this session.</p>
                </div>
              </div>
              {generatedQuestions.length > 0 && <span className="text-[10px] text-emerald-400 font-bold">{generatedQuestions.length} ready</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="w-full bg-brand-black text-sm text-zinc-200 border border-brand-dark-border/80 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-orange"
              >
                <option>Core concepts</option>
                <option>Architecture and design</option>
                <option>Debugging and performance</option>
                <option>Communication and leadership</option>
              </select>
              <button
                type="button"
                onClick={generateQuestions}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors border-0 cursor-pointer"
              >
                {generatedQuestions.length > 0 ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {generatedQuestions.length > 0 ? 'Regenerate' : 'Generate set'}
              </button>
            </div>
            {generatedQuestions.length > 0 && (
              <ol className="space-y-2 text-xs text-zinc-300 list-decimal pl-5">
                {generatedQuestions.map((question) => <li key={question}>{question}</li>)}
              </ol>
            )}
          </div>
        </div>

        {/* hardware notes */}
        <div className="p-4 bg-zinc-950/60 rounded-2xl border border-brand-dark-border/40 flex gap-3 text-xs text-zinc-400">
          <AlertCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-zinc-300">Device Preparation Checklist</span>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
              <li>Allow browser camera & microphone permissions when requested.</li>
              <li>Position your webcam at eye level in a well-lit environment.</li>
              <li>A speech-to-text synthesizer is active; speak clearly into your mic.</li>
            </ul>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={mode === 'peer' && syncMethod === 'webrtc' && connectionStatus !== 'connected'}
          className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 group disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
        >
          <Video className="w-5 h-5 fill-white" />
          <span>{mode === 'peer' && syncMethod === 'webrtc' && connectionStatus !== 'connected' ? 'Awaiting P2P Connection' : 'Initialize Simulation Chamber'}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default InterviewConfig;

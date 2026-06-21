import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Send,
  Flag,
  Award
} from 'lucide-react';
import { LocalStorageSync } from '../utils/p2pSync';

interface LivePeerInterviewerProps {
  config: {
    role: string;
    difficulty: string;
    questionsCount: number;
    useResumeQuestions: boolean;
    sessionType: 'verbal' | 'coding';
    mode: 'ai' | 'peer';
    peerRole: 'candidate' | 'interviewer';
    syncMethod: 'localtab' | 'webrtc';
    webrtcInstance?: any;
  };
  onFinish: (results: {
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
  }) => void;
  onCancel: () => void;
}

const defaultQuestions: Record<string, string[]> = {
  'React Developer': [
    "What is the difference between Virtual DOM and Shadow DOM, and how does React's reconciliation algorithm work?",
    "Can you explain how React's useEffect dependency array performs comparison checks, and how you prevent memory leaks?",
    "What are React Server Components (RSC), and how do they differ from traditional client-side rendering?"
  ],
  'Node.js Developer': [
    "How does the Node.js event loop work, and how does it execute microtasks vs macrotasks?",
    "What are the common strategies to handle backpressure in Node.js streams?",
    "How would you secure a Node Express REST API from common vulnerabilities like SQL injection and XSS?"
  ],
  'Fullstack Engineer': [
    "How do you decide between Client-Side Rendering, Server-Side Rendering, and Static Site Generation for a new fullstack project?",
    "Explain the difference between JWTs and sessions for authentication. Where should JWTs be stored securely on the client?",
    "How do you handle database migration versioning across developer environments and production databases?"
  ],
  'Python Developer': [
    "What is the global interpreter lock (GIL) in Python, and how does it affect multi-threaded applications?",
    "Can you explain the difference between a generator and a standard list in terms of memory utilization and execution flow?",
    "How do decorators work in Python? Write a mock scenario where you would use one."
  ],
  'System Design Engineer': [
    "How would you design a rate limiter for a distributed API gateway? What databases or caching layers would you use?",
    "Explain the CAP theorem. In a highly distributed chat application, would you prioritize consistency or availability?",
    "How do you handle database sharding, and what are the primary challenges when joining data across shards?"
  ],
  'Behavioral / HR': [
    "Tell me about a challenging technical project you worked on and how you resolved its constraints.",
    "How do you handle disagreements with team members or product managers regarding technical architecture choices?",
    "What is your approach to system monitoring and error logging in a high-traffic production environment?"
  ]
};

const codingQuestions: Record<string, string[]> = {
  'React Developer': [
    "Write a custom React hook `useLocalStorage(key, initialValue)` that synchronizes state with the browser's localStorage.",
    "Write a memoized React component that renders a list of items and includes an optimization check to prevent unnecessary re-renders.",
    "Write a toggle component using React Context that manages global theme state (dark/light) without triggering page-wide re-renders."
  ],
  'Node.js Developer': [
    "Write an Express middleware function to rate-limit requests to 100 requests per minute per IP address using a cache object map.",
    "Write a Node.js helper function using Streams that reads a large file and pipes it to a compressed gzip output stream while handling backpressure.",
    "Write an authentication check middleware in Node.js that extracts a JWT token from authorization headers and verifies it."
  ],
  'Fullstack Engineer': [
    "Write a function `deepClone(obj)` in JavaScript/TypeScript that performs a deep copy of a nested object, handling arrays, dates, and circular references.",
    "Write an API endpoint controller in Express to perform a paginated MongoDB search query with filter arguments, returning count metrics.",
    "Write a script that matches items across two relational arrays of objects on an ID key and groups children into a nested architecture (Parent-Child joins)."
  ],
  'Python Developer': [
    "Write a Python decorator `@timer` that measures the execution time of any function and prints the result.",
    "Write a Python generator function `fibonacci_sequence(limit)` that yields Fibonacci numbers up to a specified limit.",
    "Write a Python script that takes a list of dictionary items and groups them by a specific key, returning a nested dictionary map."
  ],
  'System Design Engineer': [
    "Write a mock sliding-window rate-limiting algorithm code in your language of choice. Track window timestamps in an array.",
    "Write a distributed lock manager check function using redis commands or simulation blocks in your language of choice.",
    "Write a function that calculates a consistent hashing ring mapping node keys to request server server-side endpoints."
  ],
  'Behavioral / HR': [
    "Identify a coding pattern or architectural decision from a past project. Write a mock snippet demonstrating that design pattern.",
    "Write a mock helper library module demonstrating clean code practices (e.g. error handling, type guards).",
    "Write a mock API client integration module that handles network retries, timeout constraints, and fallback defaults."
  ]
};

const LivePeerInterviewer: React.FC<LivePeerInterviewerProps> = ({ config, onFinish, onCancel }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Real-time Candidate synchronized states
  const [candidateCode, setCandidateCode] = useState('');
  const [candidateLanguage, setCandidateLanguage] = useState('javascript');
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [candidateWebcamOn, setCandidateWebcamOn] = useState(true);
  const [voiceVol, setVoiceVol] = useState(0);

  // Scorecards inputs
  const [techScore, setTechScore] = useState(70);
  const [commScore, setCommScore] = useState(70);
  const [structureScore, setStructureScore] = useState(70);
  const [confidenceScore, setConfidenceScore] = useState(70);
  const [evalComments, setEvalComments] = useState('');
  
  // Hints
  const [hintText, setHintText] = useState('');
  
  // Media streams for Interviewer
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Sync
  const syncRef = useRef<any>(null);

  // Track all candidate questions responses
  const [candidateCodes, setCandidateCodes] = useState<string[]>([]);
  const [candidateAnswers, setCandidateAnswers] = useState<string[]>([]);

  // Load questions
  useEffect(() => {
    let activeQuestions: string[] = [];
    if (config.useResumeQuestions) {
      const saved = localStorage.getItem('customQuestions');
      if (saved) {
        try { activeQuestions = JSON.parse(saved); } catch (e) {}
      }
    }
    if (activeQuestions.length === 0) {
      activeQuestions = config.sessionType === 'coding'
        ? codingQuestions[config.role] || codingQuestions['Behavioral / HR']
        : defaultQuestions[config.role] || defaultQuestions['Behavioral / HR'];
    }

    const sliced = activeQuestions.slice(0, config.questionsCount);
    setQuestions(sliced);
    setCandidateCodes(new Array(sliced.length).fill(''));
    setCandidateAnswers(new Array(sliced.length).fill(''));
  }, [config]);

  // Setup Peer Sync Connection
  useEffect(() => {
    if (questions.length === 0) return;

    if (config.syncMethod === 'localtab') {
      syncRef.current = new LocalStorageSync('interviewer');
    } else {
      syncRef.current = config.webrtcInstance;
    }

    if (!syncRef.current) return;

    // Handle updates from candidate
    syncRef.current.onMessageCallback = (msg: any) => {
      if (msg.type === 'candidate_update') {
        if (msg.index !== undefined) {
          if (msg.code !== undefined) {
            setCandidateCode(msg.code);
            setCandidateCodes((prev) => {
              const updated = [...prev];
              updated[msg.index] = msg.code;
              return updated;
            });
          }
          if (msg.answer !== undefined) {
            setCandidateAnswer(msg.answer);
            setCandidateAnswers((prev) => {
              const updated = [...prev];
              updated[msg.index] = msg.answer;
              return updated;
            });
          }
        }
        if (msg.language !== undefined) setCandidateLanguage(msg.language);
        if (msg.micVol !== undefined) setVoiceVol(msg.micVol);
        if (msg.webcamOn !== undefined) setCandidateWebcamOn(msg.webcamOn);
      }
    };

    // Broadcast session config to candidate
    syncRef.current.send({
      type: 'setup_session',
      questions,
      role: config.role,
      difficulty: config.difficulty,
      sessionType: config.sessionType
    });

    return () => {
      if (config.syncMethod === 'localtab' && syncRef.current) {
        syncRef.current.close();
      }
    };
  }, [questions]);

  // Sync active question change to Candidate
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCandidateCode(candidateCodes[nextIndex] || '');
      setCandidateAnswer(candidateAnswers[nextIndex] || '');
      
      if (syncRef.current) {
        syncRef.current.send({
          type: 'interviewer_update',
          questionIndex: nextIndex
        });
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCandidateCode(candidateCodes[prevIndex] || '');
      setCandidateAnswer(candidateAnswers[prevIndex] || '');

      if (syncRef.current) {
        syncRef.current.send({
          type: 'interviewer_update',
          questionIndex: prevIndex
        });
      }
    }
  };

  // Send Hint
  const sendHint = () => {
    if (!hintText.trim() || !syncRef.current) return;
    syncRef.current.send({
      type: 'interviewer_update',
      hint: hintText.trim()
    });
    setHintText('');
    alert('Hint broadcasted to candidate!');
  };

  // Submit Evaluation
  const handleSubmitEvaluation = () => {
    const qaList = questions.map((q, idx) => ({
      question: q,
      answer: candidateAnswers[idx] || 'No response provided.',
      code: config.sessionType === 'coding' ? candidateCodes[idx] || '' : undefined
    }));

    const resultsPayload = {
      role: config.role,
      difficulty: config.difficulty,
      qaList,
      peerFeedback: {
        technical: techScore,
        communication: commScore,
        structure: structureScore,
        confidence: confidenceScore,
        comments: evalComments || 'Excellent collaborative coding performance.'
      }
    };

    // Sync finish payload to Candidate so they also transition
    if (syncRef.current) {
      syncRef.current.send({
        type: 'interviewer_update',
        evaluationFinished: true,
        results: resultsPayload
      });
    }

    onFinish(resultsPayload);
  };

  // Interviewer camera stream
  useEffect(() => {
    async function startCamera() {
      try {
        if (isCameraOn) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          setStream(mediaStream);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } else {
          stopStream();
        }
      } catch (err) {
        console.warn('Webcam failed to load:', err);
        setIsCameraOn(false);
      }
    }
    startCamera();
    return () => stopStream();
  }, [isCameraOn]);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const isCoding = config.sessionType === 'coding';

  return (
    <div className="space-y-6 w-full h-[calc(100vh-120px)] flex flex-col pb-6">
      {/* Top Status bar */}
      <div className="flex items-center justify-between border-b border-brand-dark-border/40 pb-4 flex-shrink-0">
        <div>
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest block">
            P2P Interview Cockpit (Interviewer View)
          </span>
          <h2 className="text-xl font-bold text-zinc-200 mt-0.5">
            Spectating: {config.role} <span className="text-zinc-500 font-normal">({config.difficulty})</span>
          </h2>
        </div>

        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl transition cursor-pointer border-0"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Exit Session</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left column: Video monitors (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Candidate Webcam feed */}
          <div className="glass-panel p-4 rounded-3xl border border-brand-dark-border/80 bg-zinc-950/80 relative flex-1 flex flex-col items-center justify-center text-center overflow-hidden">
            {candidateWebcamOn ? (
              <div className="space-y-3">
                <div className="relative w-20 h-20 bg-brand-orange/10 border-2 border-brand-orange/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-orange/10 animate-pulse">
                  <Video className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Candidate Feed Live</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Connected via WebRTC Data channel</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-zinc-600">
                <Video className="w-8 h-8 mx-auto" />
                <h4 className="text-xs font-bold">Candidate Camera Off</h4>
              </div>
            )}
            
            {/* Live voice indicator */}
            <div className="absolute bottom-3 right-3 bg-zinc-900 border border-zinc-700/50 px-2 py-1 rounded-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
              <div className="w-10 h-1 bg-brand-black rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-100"
                  style={{ width: `${voiceVol}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interviewer Webcam Preview */}
          <div className="h-40 glass-panel rounded-3xl border border-brand-dark-border/80 relative overflow-hidden bg-zinc-950">
            {isCameraOn ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600">
                <span className="text-xs font-bold">Your Camera Paused</span>
              </div>
            )}
            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-zinc-900/80 text-[8px] font-bold text-zinc-400 rounded-md">
              You (Interviewer)
            </span>
          </div>
        </div>

        {/* Middle column: Code/Transcript spectator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
          {isCoding ? (
            <div className="glass-panel p-5 rounded-3xl border border-brand-dark-border/80 flex-1 flex flex-col min-h-0 bg-brand-black/20">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Candidate Code (Live)</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-brand-dark-border text-[9px] font-mono text-zinc-300 rounded-md">
                  {candidateLanguage.toUpperCase()}
                </span>
              </div>

              <pre className="flex-1 bg-zinc-950 border border-brand-dark-border/60 rounded-2xl p-4 font-mono text-xs text-zinc-300 overflow-auto whitespace-pre leading-relaxed select-none">
                <code>{candidateCode || '// Candidate has not started coding yet...'}</code>
              </pre>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-3xl border border-brand-dark-border/80 flex-1 flex items-center justify-center text-center min-h-0 bg-brand-black/20">
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Verbal Simulation format</span>
                <p className="text-[10px] text-zinc-600 max-w-[80%] mx-auto">No code whiteboard active for this session type. Spectate the transcript feedback below.</p>
              </div>
            </div>
          )}

          {/* Transcript box */}
          <div className="h-44 glass-panel p-5 rounded-3xl border border-brand-dark-border/80 flex flex-col min-h-0 bg-brand-black/20">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block flex-shrink-0">Candidate Spoken Response (Live)</span>
            <div className="flex-1 bg-brand-black/40 border border-brand-dark-border/60 p-3 rounded-xl text-xs text-zinc-300 leading-relaxed font-mono overflow-y-auto whitespace-pre-wrap">
              {candidateAnswer || 'Awaiting candidate speech response...'}
            </div>
          </div>
        </div>

        {/* Right column: Cockpit controller & scorecard (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Active Question helper panel */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-dark-border/80 space-y-3 relative overflow-hidden bg-brand-black/40">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Interviewer Deck</span>
              <span className="text-[9px] font-bold text-zinc-600 font-mono">Q{currentIndex + 1} of {questions.length}</span>
            </div>
            <p className="text-xs font-bold text-zinc-200 leading-relaxed">
              {questions[currentIndex] || 'Loading active question...'}
            </p>
            
            <div className="flex items-center justify-between pt-1 border-t border-brand-dark-border/40">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="px-2.5 py-1 bg-zinc-900 border border-brand-dark-border text-zinc-400 text-[10px] font-bold rounded-lg hover:text-white disabled:opacity-30 border-0 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentIndex + 1 === questions.length}
                  className="px-2.5 py-1 bg-zinc-900 border border-brand-dark-border text-zinc-400 text-[10px] font-bold rounded-lg hover:text-white disabled:opacity-30 border-0 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Hint pad */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-dark-border/80 space-y-3 bg-brand-black/20">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Send Interviewer Hint</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Try using a sliding window..."
                value={hintText}
                onChange={(e) => setHintText(e.target.value)}
                className="flex-1 bg-brand-black text-xs text-zinc-300 border border-brand-dark-border rounded-xl px-3 py-2 focus:outline-none focus:border-brand-orange"
              />
              <button
                onClick={sendHint}
                className="p-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl transition border-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live grading sliders */}
          <div className="glass-panel p-5 rounded-3xl border border-brand-dark-border/80 space-y-4 bg-brand-black/20 flex-1 flex flex-col justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Candidate Evaluation Scorecard</span>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 py-1">
              {/* Technical Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
                  <span>Technical Accuracy</span>
                  <span className="text-brand-orange">{techScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={techScore}
                  onChange={(e) => setTechScore(Number(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>

              {/* Comm Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
                  <span>Communication & Pacing</span>
                  <span className="text-brand-orange">{commScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={commScore}
                  onChange={(e) => setCommScore(Number(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>

              {/* STAR Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
                  <span>Logical Structure (STAR)</span>
                  <span className="text-brand-orange">{structureScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={structureScore}
                  onChange={(e) => setStructureScore(Number(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>

              {/* Tone Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
                  <span>Confidence & Tone</span>
                  <span className="text-brand-orange">{confidenceScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>

              {/* Comments */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Feedback Comments</label>
                <textarea
                  placeholder="Type constructive evaluation remarks here..."
                  value={evalComments}
                  onChange={(e) => setEvalComments(e.target.value)}
                  className="w-full h-16 p-2 bg-brand-black text-xs text-zinc-200 border border-brand-dark-border rounded-xl focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitEvaluation}
              className="w-full flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl transition shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 cursor-pointer border-0 mt-3 flex-shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Submit Session Evaluation</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LivePeerInterviewer;

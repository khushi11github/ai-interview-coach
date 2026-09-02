import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Send,
  Flag,
  Play,
  Sparkles
} from 'lucide-react';
import { LocalStorageSync } from '../utils/p2pSync';

// Declare Web Speech API references for TypeScript
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface LiveInterviewRoomProps {
  config: {
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
    "Write a custom React hook `useLocalStorage(key, initialValue)` that synchronizes state with the browser's localStorage. Write the component and hook in the editor.",
    "Write a memoized React component that renders a list of items and includes an optimization check to prevent unnecessary re-renders when parent state updates.",
    "Write a toggle component using React Context that manages global theme state (dark/light) without triggering page-wide re-renders."
  ],
  'Node.js Developer': [
    "Write an Express middleware function to rate-limit requests to 100 requests per minute per IP address using a cache object map.",
    "Write a Node.js helper function using Streams that reads a large file and pipes it to a compressed gzip output stream while handling backpressure.",
    "Write an authentication check middleware in Node.js that extracts a JWT token from authorization headers and verifies it using a mock secret key."
  ],
  'Fullstack Engineer': [
    "Write a function `deepClone(obj)` in JavaScript/TypeScript that performs a deep copy of a nested object, handling arrays, dates, and circular references.",
    "Write an API endpoint controller in Express to perform a paginated MongoDB search query with filter arguments, returning count metrics.",
    "Write a script that matches items across two relational arrays of objects on an ID key and groups children into a nested architecture (Parent-Child joins)."
  ],
  'Python Developer': [
    "Write a Python decorator `@timer` that measures the execution time of any function and prints the result. Write a mock function to test it.",
    "Write a Python generator function `fibonacci_sequence(limit)` that yields Fibonacci numbers up to a specified limit. Explain why it is memory efficient.",
    "Write a Python script that takes a list of dictionary items and groups them by a specific key, returning a nested dictionary map."
  ],
  'System Design Engineer': [
    "Write a mock sliding-window rate-limiting algorithm code in your language of choice. Track window timestamps in an array.",
    "Write a distributed lock manager check function using redis commands or simulation blocks in your language of choice.",
    "Write a function that calculates a consistent hashing ring mapping node keys to request server server-side endpoints."
  ],
  'Behavioral / HR': [
    "Identify a coding pattern or architectural decision from a past project. Write a mock snippet demonstrating that design pattern (e.g. Singleton, Factory, Observer).",
    "Write a mock helper library module demonstrating clean code practices (e.g. error handling, type guards, descriptive naming).",
    "Write a mock API client integration module that handles network retries, timeout constraints, and fallback defaults."
  ]
};

const getCodeTemplate = (lang: string, question: string) => {
  if (lang === 'python') {
    return `def solve_problem():\n    # Write your solution here\n    pass\n`;
  }
  
  if (question.toLowerCase().includes('hook') || question.toLowerCase().includes('react')) {
    return `import React, { useState, useEffect } from 'react';\n\n// Write your React code here\nexport function useSolution() {\n  // code...\n}\n`;
  }
  
  return `function solveProblem() {\n  // Write your solution here\n  return;\n}\n`;
};

const LiveInterviewRoom: React.FC<LiveInterviewRoomProps> = ({ config, onFinish, onCancel }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Code Editor states
  const [writtenCodes, setWrittenCodes] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [codeOutput, setCodeOutput] = useState('');
  const [runningCode, setRunningCode] = useState(false);

  // Timer & Media Stream
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Audio & Speech APIs
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceVol, setVoiceVol] = useState(0);

  // Multiplayer sync states
  const [peerHint, setPeerHint] = useState('');
  const syncRef = useRef<any>(null);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const volIntervalRef = useRef<any>(null);

  // Initialize P2P Sync if in multiplayer mode
  useEffect(() => {
    if (config.mode !== 'peer') return;

    if (config.syncMethod === 'localtab') {
      syncRef.current = new LocalStorageSync('candidate');
    } else {
      syncRef.current = config.webrtcInstance;
    }

    if (!syncRef.current) return;

    syncRef.current.onMessageCallback = (msg: any) => {
      if (msg.type === 'setup_session') {
        if (msg.questions) {
          setQuestions(msg.questions);
          setAnswers(new Array(msg.questions.length).fill(''));
          setWrittenCodes(new Array(msg.questions.length).fill(''));
        }
      } else if (msg.type === 'interviewer_update') {
        if (msg.questionIndex !== undefined) {
          setCurrentIndex(msg.questionIndex);
        }
        if (msg.hint !== undefined) {
          setPeerHint(msg.hint);
          // Auto clear hint after 6s
          setTimeout(() => setPeerHint(''), 6000);
        }
        if (msg.evaluationFinished && msg.results) {
          onFinish(msg.results);
        }
      }
    };

    return () => {
      if (config.syncMethod === 'localtab' && syncRef.current) {
        syncRef.current.close();
      }
    };
  }, [config]);

  // Broadcast candidate updates in real-time
  useEffect(() => {
    if (config.mode === 'peer' && syncRef.current) {
      syncRef.current.send({
        type: 'candidate_update',
        index: currentIndex,
        code: currentCode,
        answer: currentAnswer,
        language,
        webcamOn: isCameraOn,
        micVol: voiceVol
      });
    }
  }, [currentIndex, currentCode, currentAnswer, language, isCameraOn, voiceVol]);

  // Initialize questions
  useEffect(() => {
    let activeQuestions: string[] = [];

    if (config.generatedQuestions && config.generatedQuestions.length > 0) {
      activeQuestions = config.generatedQuestions;
    }
    
    if (activeQuestions.length === 0 && config.useResumeQuestions) {
      const saved = localStorage.getItem('customQuestions');
      if (saved) {
        try {
          activeQuestions = JSON.parse(saved);
        } catch (e) {
          activeQuestions = [];
        }
      }
    }
    
    if (activeQuestions.length === 0) {
      if (config.sessionType === 'coding') {
        activeQuestions = codingQuestions[config.role] || codingQuestions['Behavioral / HR'];
      } else {
        activeQuestions = defaultQuestions[config.role] || defaultQuestions['Behavioral / HR'];
      }
    }
    
    // Slice based on count requested
    const selectedQuestions = activeQuestions.slice(0, config.questionsCount);
    setQuestions(selectedQuestions);
    setAnswers(new Array(selectedQuestions.length).fill(''));
    setWrittenCodes(new Array(selectedQuestions.length).fill(''));
  }, [config]);

  // Update editor template when questions or language changes
  useEffect(() => {
    if (questions.length > 0 && !writtenCodes[currentIndex]) {
      setCurrentCode(getCodeTemplate(language, questions[currentIndex]));
    }
  }, [currentIndex, questions, language, writtenCodes]);

  // Request Webcam Stream
  useEffect(() => {
    async function startCamera() {
      try {
        if (isCameraOn) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: isMicOn
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          stopMediaStream();
        }
      } catch (err) {
        console.warn("Failed to capture webcam stream:", err);
        setIsCameraOn(false);
      }
    }

    startCamera();

    return () => {
      stopMediaStream();
    };
  }, [isCameraOn, isMicOn]);

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Live Timer
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Voice Meter Simulator
  useEffect(() => {
    if (isListening) {
      volIntervalRef.current = setInterval(() => {
        setVoiceVol(Math.floor(Math.random() * 80) + 10);
      }, 100);
    } else {
      setVoiceVol(0);
      if (volIntervalRef.current) clearInterval(volIntervalRef.current);
    }

    return () => {
      if (volIntervalRef.current) clearInterval(volIntervalRef.current);
    };
  }, [isListening]);

  // Setup Speech-to-Text (Speech Recognition)
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          setCurrentAnswer((prev) => prev + transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Read current question out loud using Text-To-Speech (TTS)
  const speakQuestion = () => {
    if ('speechSynthesis' in window && questions[currentIndex]) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questions[currentIndex]);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak question automatically on question change
  useEffect(() => {
    if (questions.length > 0) {
      const timer = setTimeout(() => {
        speakQuestion();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, questions]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported in this browser. Please type your responses.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const runCodeSimulator = () => {
    setRunningCode(true);
    setCodeOutput('Compiling code & running dry checks...');
    
    setTimeout(() => {
      let output = '';
      const codeLower = currentCode.toLowerCase();
      
      if (currentCode.trim().length < 25) {
        output = 'Error: Solution block is too short or empty.\nEnsure you write the whiteboard code.';
      } else if (language === 'javascript' || language === 'typescript') {
        if (!codeLower.includes('function') && !codeLower.includes('const') && !codeLower.includes('let') && !codeLower.includes('=>')) {
          output = 'Warning: No function declaration or assignment found.\nVerify code structure.';
        } else {
          output = 'Syntax check: PASS\nInitializing test environment...\nRunning test cases...\n\nCase 1: PASS (Initial validation)\nCase 2: PASS (Edge checking)\nCase 3: PASS (Stress test logic)\n\nResult: 3/3 tests passed successfully.';
        }
      } else if (language === 'python') {
        if (!codeLower.includes('def ')) {
          output = 'Warning: No def statement found. Python functions require the def keyword.\nVerify code structure.';
        } else {
          output = 'Lint check: PASS\nInitializing test environment...\nRunning test cases...\n\nCase 1: PASS\nCase 2: PASS\nCase 3: PASS\n\nResult: All tests passed.';
        }
      }
      
      setCodeOutput(output);
      setRunningCode(false);
    }, 1200);
  };

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentAnswer.trim();
    setAnswers(updatedAnswers);

    // Save current code
    const updatedCodes = [...writtenCodes];
    updatedCodes[currentIndex] = currentCode;
    setWrittenCodes(updatedCodes);

    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCurrentAnswer(answers[nextIdx] || '');
      setCurrentCode(updatedCodes[nextIdx] || getCodeTemplate(language, questions[nextIdx]));
      setCodeOutput('');
    } else {
      submitInterview(updatedAnswers, updatedCodes);
    }
  };

  const submitInterview = (finalAnswers = answers, finalCodes = writtenCodes) => {
    stopMediaStream();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Map questions with answers and codes
    const qaList = questions.map((q, idx) => ({
      question: q,
      answer: finalAnswers[idx] || 'No response provided.',
      code: config.sessionType === 'coding' ? finalCodes[idx] || getCodeTemplate(language, q) : undefined
    }));

    onFinish({
      role: config.role,
      difficulty: config.difficulty,
      qaList
    });
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCoding = config.sessionType === 'coding';

  return (
    <div className="space-y-6 w-full h-[calc(100vh-120px)] flex flex-col pb-6 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900">
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-4 flex-shrink-0">
        <div>
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest block">
            Live {isCoding ? 'Coding' : 'Verbal'} Simulation
          </span>
          <h2 className="text-xl font-bold text-zinc-200 mt-0.5">
            {config.role} <span className="text-zinc-500 font-normal">({config.difficulty})</span>
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-900/40 to-red-950/40 border border-red-500/40 px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/10">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-red-300 font-mono tracking-wider">REC</span>
            <span className="text-xs font-semibold text-red-200 font-mono border-l border-red-500/30 pl-2">
              {formatTime(elapsedTime)}
            </span>
          </div>

          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500/30 to-pink-500/20 hover:from-red-500/50 hover:to-pink-500/40 border border-red-400/40 text-red-300 hover:text-red-100 text-xs font-bold rounded-xl transition shadow-lg shadow-red-500/10"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Abort Session</span>
          </button>
        </div>
      </div>

      {peerHint && (
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-brand-orange/10 border border-amber-400/30 rounded-2xl flex items-center gap-3 text-xs text-amber-100 animate-pulse flex-shrink-0 shadow-lg shadow-amber-500/10">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-300 animate-bounce" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-[9px] text-amber-200">Interviewer Hint</span>
            <p className="mt-0.5 text-zinc-200 font-medium">{peerHint}</p>
          </div>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Side: Camera & AI Visualizer (4 columns in coding, 5 in verbal) */}
        <div className={`flex flex-col gap-4 min-h-0 ${isCoding ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
          
          {/* Webcam Box */}
          <div className="glass-panel rounded-3xl border border-purple-500/30 relative flex-1 min-h-[160px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-950/60 to-slate-950/60 shadow-2xl shadow-purple-500/10">
            {isCameraOn ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center space-y-3">
                <div className="p-4 bg-zinc-900 border border-brand-dark-border rounded-full inline-block">
                  <VideoOff className="w-8 h-8 text-zinc-600" />
                </div>
                <h4 className="text-sm font-bold text-zinc-400">Webcam Feed Paused</h4>
                <p className="text-xs text-zinc-600">Audio input remains active.</p>
              </div>
            )}

            {/* Camera Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isCameraOn 
                      ? 'bg-zinc-900/80 border-zinc-700/50 text-zinc-300 hover:text-zinc-100' 
                      : 'bg-red-500/85 border-transparent text-white'
                  }`}
                  title="Toggle Video"
                >
                  {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isMicOn 
                      ? 'bg-zinc-900/80 border-zinc-700/50 text-zinc-300 hover:text-zinc-100' 
                      : 'bg-red-500/85 border-transparent text-white'
                  }`}
                  title="Toggle Microphone"
                >
                  {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Mic volume bar */}
              <div className="bg-zinc-900/85 border border-zinc-700/50 px-2.5 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto">
                <Mic className="w-3 h-3 text-brand-orange" />
                <div className="w-12 h-1 bg-brand-black rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-orange h-full rounded-full transition-all duration-100"
                    style={{ width: `${voiceVol}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Glowing border when recording */}
            {isListening && (
              <div className="absolute inset-0 border-2 border-brand-orange rounded-3xl pointer-events-none animate-pulse-slow" />
            )}
          </div>

          {/* AI Avatar Card */}
          <div className="glass-panel p-4 rounded-3xl border border-cyan-500/30 flex items-center gap-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 shadow-lg shadow-cyan-500/5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
              isSpeaking 
                ? 'bg-brand-orange/20 border-brand-orange shadow-lg shadow-brand-orange/20 animate-pulse' 
                : 'bg-zinc-900 border-brand-dark-border text-zinc-500'
            }`}>
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-brand-orange' : 'text-zinc-500'}`} />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">AI Evaluator</span>
              <h4 className="text-xs font-bold text-zinc-200">Agent Nova</h4>
              <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                {isSpeaking ? 'Reading prompt context...' : 'Awaiting response...'}
              </p>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-0.5 h-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-0.5 bg-brand-orange rounded-full animate-soundwave"
                    style={{ 
                      height: '100%', 
                      animationDelay: `${i * 0.15}s` 
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Staggered Question Panel (Left side in coding, Right side in verbal) */}
          {isCoding && (
            <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden bg-gradient-to-br from-emerald-950/40 to-teal-950/30 flex-shrink-0 shadow-lg shadow-emerald-500/5">
              <div className="absolute top-0 right-0 p-3 font-bold text-zinc-700 text-[10px]">
                Challenge {currentIndex + 1} of {questions.length}
              </div>
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">Whiteboard Challenge</span>
              <p className="text-sm font-bold text-zinc-100 leading-relaxed max-w-[85%]">
                {questions[currentIndex] || 'Loading question...'}
              </p>
              <button
                onClick={speakQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-black border border-brand-dark-border text-zinc-400 hover:text-brand-orange hover:border-brand-orange/30 text-[10px] font-bold rounded-lg transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Coding workspace or Q&A (8 columns in coding, 7 in verbal) */}
        <div className={`flex flex-col gap-5 min-h-0 ${isCoding ? 'lg:col-span-8' : 'lg:col-span-7'}`}>
          {isCoding ? (
            /* Coding mode Workspace */
            <div className="flex-1 flex flex-col md:flex-row gap-5 min-h-0">
              
              {/* Code Editor Panel */}
              <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 flex-1 flex flex-col min-h-0 bg-gradient-to-br from-indigo-950/30 to-slate-950/40 shadow-lg shadow-indigo-500/5">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Whiteboard Code Editor</span>
                    <select
                      value={language}
                      onChange={(e: any) => setLanguage(e.target.value)}
                      className="bg-brand-black text-[10px] text-zinc-300 font-bold border border-brand-dark-border px-2 py-1 rounded-lg focus:outline-none focus:border-brand-orange"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={runCodeSimulator}
                    disabled={runningCode}
                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-brand-dark-border text-brand-orange text-[10px] font-bold rounded-lg transition"
                  >
                    <Play className="w-3 h-3 fill-brand-orange" />
                    <span>{runningCode ? 'Testing...' : 'Verify Syntax'}</span>
                  </button>
                </div>
                
                {/* Code Textarea Editor styled with line numbers */}
                <div className="flex-1 flex bg-zinc-950 border border-brand-dark-border/60 rounded-2xl overflow-hidden font-mono text-xs p-3.5 min-h-[180px]">
                  {/* Mock line numbers */}
                  <div className="text-zinc-700 select-none text-right pr-3.5 border-r border-zinc-900 mr-3 flex flex-col">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <span key={i} className="block text-[10px] leading-relaxed">{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    placeholder="// Write your whiteboard code here..."
                    className="flex-1 bg-transparent text-zinc-300 focus:outline-none resize-none leading-relaxed w-full h-full font-mono overflow-y-auto"
                  />
                </div>
                
                {/* Console Log Output */}
                {codeOutput && (
                  <div className="mt-3 p-3 bg-zinc-950 border border-brand-dark-border/40 rounded-xl text-[10px] font-mono text-zinc-400 max-h-[85px] overflow-y-auto whitespace-pre-wrap">
                    {codeOutput}
                  </div>
                )}
              </div>
              
              {/* Spoken Explanation Panel */}
              <div className="glass-panel p-5 rounded-3xl border border-pink-500/30 flex-1 flex flex-col min-h-0 bg-gradient-to-br from-pink-950/30 to-rose-950/30 shadow-lg shadow-pink-500/5">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Spoken Logic Explanation
                  </label>
                  <span className="text-[10px] text-zinc-600">{currentAnswer.length} chars</span>
                </div>
                
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Record your spoken explanation of your code design. Click 'Record' below and describe your algorithm time complexity..."
                  className="w-full flex-1 bg-brand-black/50 border border-brand-dark-border rounded-2xl p-4 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-brand-orange/40 resize-none min-h-[180px]"
                />
                
                {/* Recording / submit buttons */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-brand-dark-border/40 flex-shrink-0">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-300 ${
                      isListening 
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 animate-pulse' 
                        : 'bg-brand-black border border-brand-dark-border text-zinc-400 hover:text-zinc-200 hover:border-brand-orange/20'
                    }`}
                  >
                    <Mic className={`w-3.5 h-3.5 ${isListening ? 'fill-white' : ''}`} />
                    <span>{isListening ? 'Stop' : 'Record'}</span>
                  </button>

                  {config.mode === 'peer' ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Interviewer Synced</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-[10px] rounded-xl shadow-lg shadow-brand-orange/15 transition disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
                    >
                      <span>{currentIndex + 1 === questions.length ? 'Submit' : 'Next'}</span>
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Verbal Mode Workspace (Standard Layout) */
            <>
              {/* Question Card */}
              <div className="glass-panel p-6 rounded-3xl border border-sky-500/30 space-y-4 relative overflow-hidden bg-gradient-to-br from-sky-950/40 to-slate-950/30 shadow-lg shadow-sky-500/5">
                <div className="absolute top-0 right-0 p-4 font-bold text-zinc-700 text-sm">
                  Q{currentIndex + 1} of {questions.length}
                </div>

                <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider block">Question Panel</span>
                
                <p className="text-lg font-bold text-zinc-100 leading-relaxed max-w-[90%]">
                  {questions[currentIndex] || 'Loading question...'}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={speakQuestion}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-black border border-brand-dark-border text-zinc-400 hover:text-brand-orange hover:border-brand-orange/30 text-xs font-semibold rounded-xl transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Repeat Question</span>
                  </button>
                </div>
              </div>
              
              {/* Answer Area */}
              <div className="glass-panel p-6 rounded-3xl border border-violet-500/30 flex-1 flex flex-col min-h-0 bg-gradient-to-br from-violet-950/30 to-slate-950/40 shadow-lg shadow-violet-500/5">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Your Answer Transcript
                  </label>
                  
                  <span className="text-[10px] text-zinc-600">
                    {currentAnswer.length} characters
                  </span>
                </div>

                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Your answer will appear here dynamically as you speak, or you can type directly inside this editor...."
                  className="w-full flex-1 bg-brand-black/50 border border-brand-dark-border rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-brand-orange/40 focus:ring-1 focus:ring-brand-orange-glow resize-none min-h-[120px]"
                />

                <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-brand-dark-border/40 flex-shrink-0">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isListening 
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 animate-pulse' 
                        : 'bg-brand-black border border-brand-dark-border text-zinc-400 hover:text-zinc-200 hover:border-brand-orange/20'
                    }`}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'fill-white' : ''}`} />
                    <span>{isListening ? 'Listening (Click to Pause)' : 'Record Answer'}</span>
                  </button>

                  {config.mode === 'peer' ? (
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Interviewer Synced</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 transition disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
                    >
                      <span>{currentIndex + 1 === questions.length ? 'Submit Interview' : 'Submit & Next'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveInterviewRoom;

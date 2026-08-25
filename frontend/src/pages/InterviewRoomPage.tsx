import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InterviewConfig from '../components/InterviewConfig';
import LiveInterviewRoom from '../components/LiveInterviewRoom';
import InterviewReport from '../components/InterviewReport';
import LivePeerInterviewer from '../components/LivePeerInterviewer';

type RoomMode = 'config' | 'active' | 'report';

const InterviewRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RoomMode>('config');
  const [config, setConfig] = useState<{
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
  } | null>(null);

  const [results, setResults] = useState<{
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
  } | null>(null);

  useEffect(() => {
    // Route guarding
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleStartInterview = (selectedConfig: typeof config) => {
    setConfig(selectedConfig);
    setMode('active');
  };

  const handleFinishInterview = (interviewResults: typeof results) => {
    setResults(interviewResults);
    setMode('report');
  };

  return (
    <div className="workspace-shell flex flex-col h-screen bg-brand-black text-zinc-100 overflow-hidden relative">
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-brand-orange/3 rounded-full blur-[140px] pointer-events-none" />
      <Sidebar />
      <main className="workspace-main flex-1 overflow-y-auto relative z-10">
        <div className="workspace-content workspace-content--room">
          {mode === 'config' && (
            <InterviewConfig onStart={handleStartInterview} />
          )}
        
        {mode === 'active' && config && (
          config.mode === 'peer' && config.peerRole === 'interviewer' ? (
            <LivePeerInterviewer 
              config={config} 
              onCancel={() => setMode('config')} 
              onFinish={handleFinishInterview} 
            />
          ) : (
            <LiveInterviewRoom 
              config={config} 
              onCancel={() => setMode('config')} 
              onFinish={handleFinishInterview} 
            />
          )
        )}

          {mode === 'report' && results && (
            <InterviewReport 
              results={results} 
              onReset={() => setMode('config')} 
              onGoHome={() => navigate('/dashboard')} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewRoomPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const ResumeAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Route guarding
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-brand-black text-zinc-100 overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-orange/3 rounded-full blur-[150px] pointer-events-none" />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <ResumeAnalyzer />
      </main>
    </div>
  );
};

export default ResumeAnalyzerPage;

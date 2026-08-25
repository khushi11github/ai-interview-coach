import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="workspace-shell flex flex-col h-screen bg-[#050D0A] text-slate-100 overflow-hidden relative">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/8 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      {/* Header Navigation */}
      <Sidebar />

      {/* Main Dashboard Canvas */}
      <main className="workspace-main flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="workspace-content pb-16">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

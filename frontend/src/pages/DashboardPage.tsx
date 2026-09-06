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
    <div className="workspace-shell flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
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


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic route guarding
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-brand-black text-zinc-100 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/3 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Layout components */}
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative z-10">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;

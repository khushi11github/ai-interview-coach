import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Video, Eye, Play, Sparkles, Calendar } from 'lucide-react';
import SessionDetailModal from './SessionDetailModal';

interface SessionVaultTabProps {
  history: any[];
}

export const SessionVaultTab: React.FC<SessionVaultTabProps> = ({ history }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeSession, setActiveSession] = useState<any | null>(null);

  const filteredHistory = history.filter((session) => {
    const matchesSearch = session.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || session.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleRetake = (sessionRole: string, difficulty: string) => {
    localStorage.setItem(
      'quickDrillConfig',
      JSON.stringify({ role: sessionRole, difficulty, topic: 'Vault Re-take' })
    );
    navigate('/interview');
  };

  const totalSessions = history.length;
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((sum, s) => sum + s.score, 0) / totalSessions)
    : 0;

  const highestScore = totalSessions > 0
    ? Math.max(...history.map((s) => s.score))
    : 0;

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold badge-neon-emerald px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
            <Video className="w-3 h-3 text-emerald-400" />
            <span>Interview Records Vault</span>
          </span>
          <h2 className="text-2xl font-black text-white">Evaluation History & Performance Logs</h2>
          <p className="text-xs text-slate-300 mt-1">
            Browse complete audit logs, AI transcripts, and score breakdowns for past simulation sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#061410] px-4 py-2 rounded-2xl border border-emerald-500/20 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Mocks</span>
            <span className="text-lg font-black text-white">{totalSessions}</span>
          </div>
          <div className="bg-[#061410] px-4 py-2 rounded-2xl border border-emerald-500/20 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Avg Score</span>
            <span className="text-lg font-black text-emerald-400">{avgScore}%</span>
          </div>
          <div className="bg-[#061410] px-4 py-2 rounded-2xl border border-emerald-500/20 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Peak Score</span>
            <span className="text-lg font-black text-teal-300">{highestScore}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by target role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#061410] border border-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-400/60 hidden sm:inline" />
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'bg-[#061410] text-slate-400 border border-emerald-500/10 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 border border-emerald-500/20 text-center">
          <Sparkles className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Simulation Logs Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {totalSessions === 0
              ? 'You have not conducted any AI interview simulations yet. Launch your first mock session to start tracking performance metrics.'
              : 'No sessions match your search filter criteria. Try resetting the search input or difficulty filters.'}
          </p>
          <button
            onClick={() => navigate('/interview')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer border-0"
          >
            Launch First Mock Simulation
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-emerald-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-500/20 bg-[#061410] text-emerald-400/80 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6">Target Role</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 px-4">Q&A Items</th>
                  <th className="py-4 px-4 text-center">Score</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 text-slate-200">
                {filteredHistory.map((session, idx) => (
                  <tr key={idx} className="hover:bg-[#061B14] transition-colors group">
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                        {session.role.charAt(0)}
                      </div>
                      <span>{session.role}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500/60" />
                        {session.date}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        session.difficulty === 'Easy' ? 'badge-neon-emerald' :
                        session.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'badge-neon-teal'
                      }`}>
                        {session.difficulty || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{session.qaCount || 4} Questions</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-sm font-black px-2.5 py-1 rounded-xl ${
                        session.score >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                        session.score >= 65 ? 'text-teal-300 bg-teal-500/10' :
                        'text-amber-400 bg-amber-500/10'
                      }`}>
                        {session.score}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveSession(session)}
                          className="px-3 py-1.5 bg-[#0A211B] hover:bg-[#0F2D23] text-slate-200 hover:text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-500/20"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Audit Log</span>
                        </button>

                        <button
                          onClick={() => handleRetake(session.role, session.difficulty)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-emerald-300" />
                          <span>Re-take</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SessionDetailModal session={activeSession} onClose={() => setActiveSession(null)} />
    </div>
  );
};

export default SessionVaultTab;

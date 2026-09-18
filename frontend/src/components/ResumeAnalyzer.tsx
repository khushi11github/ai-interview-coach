import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResumeWithAI } from '../services/api';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  Video,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface ResumeAnalysis {
  score: number;
  role: string;
  foundKeywords: string[];
  missingKeywords: string[];
  improvements: { type: 'critical' | 'warning' | 'tip'; text: string }[];
  questions: string[];
  isBinaryFallback?: boolean;
  filename?: string;
  isJobDescriptionMatch?: boolean;
  jobKeywordsCount?: number;
}

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const SUPPORTED_RESUME_EXTENSIONS = ['.pdf', '.docx', '.txt'];

const getResumeFileError = (candidate: File): string | null => {
  const extension = candidate.name.slice(candidate.name.lastIndexOf('.')).toLowerCase();

  if (!SUPPORTED_RESUME_EXTENSIONS.includes(extension)) {
    return 'Choose a PDF, DOCX, or TXT resume.';
  }

  if (candidate.size > MAX_RESUME_SIZE) {
    return 'Resume files must be 5 MB or smaller.';
  }

  return null;
};

const ResumeAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRole, setSelectedRole] = useState('React Developer');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const error = getResumeFileError(droppedFile);
      setFileError(error);
      if (!error) setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const error = getResumeFileError(selectedFile);
      setFileError(error);
      if (!error) setFile(selectedFile);
    }
  };

  const triggerAnalysis = async () => {
    if (!file) return;
    const error = getResumeFileError(file);
    if (error) {
      setFileError(error);
      return;
    }
    setAnalyzing(true);
    setProgress(15);
    setAnalysis(null);
    try {
      const aiAnalysis = await analyzeResumeWithAI(file, selectedRole, jobDescription);
      const finalAnalysis: ResumeAnalysis = {
        ...aiAnalysis,
        filename: file.name,
        isBinaryFallback: false,
      };
      setProgress(100);
      setAnalysis(finalAnalysis);
      localStorage.setItem('resumeAnalysis', JSON.stringify(finalAnalysis));
    } catch (analysisError) {
      const message = analysisError instanceof Error ? analysisError.message : 'AI resume analysis failed.';
      setFileError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const changeRole = async (role: string) => {
    setSelectedRole(role);
    if (!file) return;

    setAnalyzing(true);
    setProgress(15);
    try {
      const aiAnalysis = await analyzeResumeWithAI(file, role, jobDescription);
      const updatedAnalysis: ResumeAnalysis = {
        ...aiAnalysis,
        filename: file.name,
        isBinaryFallback: false,
      };
      setProgress(100);
      setAnalysis(updatedAnalysis);
      localStorage.setItem('resumeAnalysis', JSON.stringify(updatedAnalysis));
    } catch (analysisError) {
      const message = analysisError instanceof Error ? analysisError.message : 'AI resume analysis failed.';
      setFileError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const startTailoredInterview = () => {
    if (!analysis) return;
    // Store questions in localStorage to be read by the LiveInterviewRoom
    localStorage.setItem('customQuestions', JSON.stringify(analysis.questions));
    localStorage.setItem('customRole', analysis.role);
    navigate('/interview');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Resume <span className="text-gradient-orange-pure">ATS Analyzer</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Scan your resume against target industry profiles, check keyword density, and generate specialized interview setups.
        </p>
      </div>

      {!analysis && !analyzing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Drag & Drop Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="glass-panel p-8 rounded-3xl border-2 border-dashed border-brand-dark-border hover:border-brand-orange/40 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/10 to-transparent" />
            <div className="p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8 text-brand-orange" />
            </div>

            <h3 className="text-sm font-bold text-zinc-200">
              {file ? file.name : 'Drag & drop resume here'}
            </h3>
            <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
              Supports PDF, DOCX, or TXT (Max 5MB)
            </p>
            {fileError && (
              <p role="alert" className="text-[11px] text-red-400 mt-2 max-w-xs">
                {fileError}
              </p>
            )}

            <div className="flex items-center gap-3 mt-5">
              <label className="px-4 py-2 bg-zinc-900 border border-brand-dark-border text-zinc-300 font-semibold text-[10px] rounded-xl hover:text-zinc-100 hover:border-brand-orange/30 cursor-pointer transition-colors">
                Browse Files
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
              
              {file && (
                <button
                  onClick={triggerAnalysis}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-[10px] rounded-xl shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 transition-all duration-300"
                >
                  Scan Resume
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Target Job Description Area */}
          <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/15 to-transparent" />
            <div>
              <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Job Description (Optional)</span>
              </h3>
              <p className="text-[10px] text-zinc-500 mb-3 leading-normal">
                Paste the target job posting requirements. APEXCOACH will dynamically scan gaps, calculate role fit, and tailor prep prompts.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting requirements or key technologies here..."
                className="w-full h-36 p-3 bg-brand-black/60 text-xs text-zinc-200 placeholder-zinc-600 rounded-xl border border-brand-dark-border focus:border-brand-orange focus:outline-none resize-none font-mono"
              />
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-dark-border/40 gap-4">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Target Profile</span>
              <select
                value={selectedRole}
                onChange={(e) => changeRole(e.target.value)}
                className="bg-brand-black text-xs text-zinc-300 font-semibold border border-brand-dark-border px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-orange"
              >
                <option value="React Developer">React Developer</option>
                <option value="Node.js Developer">Node.js Developer</option>
                <option value="Fullstack Engineer">Fullstack Engineer</option>
              </select>
            </div>
          </div>
        </div>
      ) : analyzing ? (
        /* Parsing Progress Screen */
        <div className="glass-panel p-12 rounded-3xl border border-brand-dark-border flex flex-col items-center justify-center min-h-[350px]">
          <div className="p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/20 mb-6 animate-pulse-slow">
            <Brain className="w-8 h-8 text-brand-orange" />
          </div>
          <h3 className="text-lg font-bold text-zinc-200">Analyzing Document</h3>
          <p className="text-xs text-zinc-400 mt-2">Checking semantic structure and extraction markers...</p>
          
          <div className="w-full max-w-md bg-brand-black border border-brand-dark-border h-2.5 rounded-full overflow-hidden mt-6">
            <div 
              className="bg-brand-orange h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-brand-orange font-bold mt-3">{progress}% Done</span>
        </div>
      ) : (
        /* Scanned Report Dashboard */
        analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Left side: Score and Role switcher */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border/80 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/25 to-transparent" />
                
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">ATS Match Score</span>
                
                {/* SVG circular score */}
                <div className="relative w-36 h-36 flex items-center justify-center my-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="#1C1C21" 
                      strokeWidth="8" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="#FF6B00" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * analysis.score) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-4xl font-extrabold text-zinc-100">
                    {analysis.score}
                  </span>
                </div>

                <div className="w-full">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Target Profile</label>
                  <div className="flex gap-2 w-full">
                    <select
                      value={selectedRole}
                      onChange={(e) => changeRole(e.target.value)}
                      className="bg-brand-black text-xs text-zinc-300 font-semibold border border-brand-dark-border px-3 py-2 rounded-xl focus:outline-none focus:border-brand-orange w-full"
                    >
                      <option value="React Developer">React Developer</option>
                      <option value="Node.js Developer">Node.js Developer</option>
                      <option value="Fullstack Engineer">Fullstack Engineer</option>
                    </select>
                    
                    <button
                      onClick={triggerAnalysis}
                      title="Rescan"
                      className="p-2 bg-zinc-950 border border-brand-dark-border text-zinc-400 hover:text-brand-orange hover:border-brand-orange/30 rounded-xl transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Score rating caption */}
                <div className="mt-5 p-3 bg-brand-orange/5 border border-brand-orange/10 text-brand-orange text-xs rounded-xl w-full">
                  {analysis.isBinaryFallback ? (
                    <div className="space-y-1 text-left">
                      <span className="font-bold block">Estimated Scanning Score</span>
                      <span className="text-[11px] text-zinc-400 block leading-normal">
                        PDF/DOCX binary streams are compressed. We matched **{analysis.score}%** based on target profile requirements. For exact keyword tracking, try a plain <strong>.txt</strong> file.
                      </span>
                    </div>
                  ) : analysis.score >= 80 ? (
                    <span className="font-semibold">Optimal ATS compatibility. Ready for application.</span>
                  ) : (
                    <span className="font-semibold">Needs attention. Apply missing keywords below.</span>
                  )}
                </div>
              </div>

              {/* Start interview action card */}
              <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border/80 bg-gradient-to-br from-brand-black to-brand-orange/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
                <Video className="w-8 h-8 text-brand-orange mb-3" />
                <h4 className="text-base font-bold text-zinc-200">Resume-Based Mock</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  AI will evaluate you specifically on technical items, tools, and experiences listed in this resume.
                </p>
                <button
                  onClick={startTailoredInterview}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl transition shadow-lg shadow-brand-orange/15 hover:shadow-brand-orange/25 group/btn"
                >
                  <span>Enter Chamber</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right side: Detailed Analysis Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Keywords found vs missing */}
              <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border/80 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Keyword Density Analysis</h3>
                  <p className="text-xs text-zinc-400">Comparing your profile keywords against requirements for {analysis.role}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Keywords Present ({analysis.foundKeywords.length})</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {analysis.foundKeywords.map((kw) => (
                        <span key={kw} className="px-3 py-1 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 mb-2">
                      <XCircle className="w-4 h-4 text-zinc-500" />
                      <span>Missing High-Priority Keywords ({analysis.missingKeywords.length})</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {analysis.missingKeywords.map((kw) => (
                        <span key={kw} className="px-3 py-1 bg-brand-black border border-brand-dark-border text-zinc-400 text-xs rounded-lg font-medium hover:border-brand-orange/30 hover:text-zinc-200 transition-colors cursor-help" title={`Add ${kw} to improve your score`}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization tips */}
              <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border/80 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Actionable Checklist</h3>
                  <p className="text-xs text-zinc-400">Apply these changes to enhance visibility and structural parsing</p>
                </div>

                <div className="space-y-3">
                  {analysis.improvements.map((imp, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3.5 bg-zinc-950/40 rounded-2xl border border-brand-dark-border/40">
                      {imp.type === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : imp.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider block ${
                          imp.type === 'critical' ? 'text-red-500' : imp.type === 'warning' ? 'text-brand-orange' : 'text-sky-400'
                        }`}>
                          {imp.type}
                        </span>
                        <p className="text-xs text-zinc-300 mt-1">{imp.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored questions list preview */}
              <div className="glass-panel p-6 rounded-3xl border border-brand-dark-border/80 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Resume-Tailored Questions</h3>
                  <p className="text-xs text-zinc-400">Preview of simulated interview items generated based on your history</p>
                </div>

                <div className="space-y-3">
                  {analysis.questions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-brand-black/50 border border-brand-dark-border rounded-xl flex gap-3 text-xs text-zinc-300">
                      <span className="font-extrabold text-brand-orange">{idx + 1}.</span>
                      <p>{q}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ResumeAnalyzer;

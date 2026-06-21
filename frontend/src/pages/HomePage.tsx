import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Video, 
  TrendingUp, 
  Cpu, 
  ChevronDown, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    // Route guard: if not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-black text-zinc-100 font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-brand-orange/3 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-brand-dark-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-hover flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gradient-orange-pure">
            APEXCOACH.AI
          </span>
        </div>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-zinc-400">
          <button onClick={() => scrollToSection('features')} className="hover:text-brand-orange transition-colors">Features</button>
          <button onClick={() => scrollToSection('workflow')} className="hover:text-brand-orange transition-colors">How It Works</button>
          <button onClick={() => scrollToSection('testimonials')} className="hover:text-brand-orange transition-colors">Reviews</button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-orange/15 transition-all duration-300"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Workspace</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-brand-dark-border text-zinc-400 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 border border-brand-orange/25 text-brand-orange text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 animate-pulse-slow">
          <Sparkles className="w-3 h-3" />
          <span>Next-Gen Technical Interview Training</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-100 tracking-tight max-w-4xl leading-tight opacity-0 animate-fade-in-up">
          Master Your Next Tech Interview in the <span className="text-gradient-orange-pure">AI Simulation Chamber</span>
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mt-6 leading-relaxed opacity-0 animate-fade-in-up [animation-delay:150ms] [animation-fill-mode:forwards]">
          Upload your resume to get instant ATS scores, identify target skill gaps, and practice live mock questions inside a voice-synthesized, webcam-integrated simulator.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 opacity-0 animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:forwards]">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <span>Enter Interactive Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 bg-zinc-900/60 hover:bg-zinc-800 border border-brand-dark-border text-zinc-300 hover:text-zinc-100 font-extrabold text-sm rounded-2xl transition-all"
          >
            <span>Explore Features</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Dashboard Chamber Mockup Graphic */}
        <div className="mt-16 w-full max-w-4xl relative group animate-float opacity-0 animate-fade-in-up [animation-delay:450ms] [animation-fill-mode:forwards]">
          {/* Ambient outer aura glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange to-amber-500 rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
          
          <div className="relative glass-panel p-2.5 rounded-3xl border border-brand-dark-border/60 overflow-hidden shadow-2xl animate-glow-pulse">
            <img 
              src="/realistic_interview_mockup.png" 
              alt="ApexCoach AI Interview Room Real Simulation Mockup" 
              className="w-full h-auto rounded-2xl border border-brand-dark-border/40 shadow-inner object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-zinc-950/30 border-t border-brand-dark-border/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              Built for <span className="text-gradient-orange-pure">High-Performance Engineers</span>
            </h2>
            <p className="text-zinc-400 text-xs mt-2">
              APEXCOACH leverages semantic analytics to optimize technical response parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl border border-brand-orange/20 flex items-center justify-center mb-5 text-brand-orange">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-brand-orange transition-colors">
                Resume ATS matching
              </h3>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                Scan plain text or binary resumes against target role keywords. Uncover missing tech stack terms and get dynamic optimization feedback checklist items instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl border border-brand-orange/20 flex items-center justify-center mb-5 text-brand-orange">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-brand-orange transition-colors">
                Interactive Voice Chamber
              </h3>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                Experience simulated pressure. Utilizes Web Speech API for real-time speech synthesis (TTS) reading questions, and voice recognition (STT) transcribing your replies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl border border-brand-orange/20 flex items-center justify-center mb-5 text-brand-orange">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-brand-orange transition-colors">
                Multi-Metric Evaluation
              </h3>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                Receive comprehensive feedback across Technical Accuracy, STAR Delivery structure, Fluency/Vocabulary, and Professional Confidence, plus ideal answer templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            How It <span className="text-gradient-orange-pure">Works</span>
          </h2>
          <p className="text-zinc-400 text-xs mt-2">
            The workspace acts as an integrated preparation lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {/* Progress connector line */}
          <div className="hidden lg:block absolute top-[45px] left-[12%] right-[12%] h-[1px] bg-brand-dark-border/50 z-0" />

          {/* Step 1 */}
          <div className="p-6 bg-zinc-950/40 border border-brand-dark-border/50 rounded-2xl relative z-10 flex flex-col items-center text-center hover:border-brand-orange/20 transition-colors">
            <span className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-sm flex items-center justify-center mb-4">1</span>
            <h4 className="text-sm font-bold text-zinc-200">Parse Resume</h4>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Upload file, view target compatibility score, and locate missing technical terms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-zinc-950/40 border border-brand-dark-border/50 rounded-2xl relative z-10 flex flex-col items-center text-center hover:border-brand-orange/20 transition-colors">
            <span className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-sm flex items-center justify-center mb-4">2</span>
            <h4 className="text-sm font-bold text-zinc-200">Configure Chamber</h4>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Set role parameters, target difficulties, and pull in custom questions parsed from your history.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-zinc-950/40 border border-brand-dark-border/50 rounded-2xl relative z-10 flex flex-col items-center text-center hover:border-brand-orange/20 transition-colors">
            <span className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-sm flex items-center justify-center mb-4">3</span>
            <h4 className="text-sm font-bold text-zinc-200">Enter Simulation</h4>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Enable webcam feed, listen to questions, and speak your answers clearly into the mic.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 bg-zinc-950/40 border border-brand-dark-border/50 rounded-2xl relative z-10 flex flex-col items-center text-center hover:border-brand-orange/20 transition-colors">
            <span className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-sm flex items-center justify-center mb-4">4</span>
            <h4 className="text-sm font-bold text-zinc-200">Inspect Analysis</h4>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Check competency ratings, trace weak areas on the chart, and review ideal responses.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-zinc-950/20 border-t border-brand-dark-border/40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight mb-12">
            Success <span className="text-gradient-orange-pure">Stories</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/15 transition-all">
              <p className="text-zinc-400 text-xs italic leading-relaxed">
                "The voice chamber simulation felt remarkably realistic. The speech-to-text transcript was fast, and the evaluation checklist directly called out my lack of system metrics. Re-wrote my resume and landed my role at Stripe!"
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-dark-border/40">
                <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold flex items-center justify-center">
                  ML
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Michael L.</span>
                  <span className="text-[10px] text-zinc-500">React Architect @ Stripe</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/15 transition-all">
              <p className="text-zinc-400 text-xs italic leading-relaxed">
                "The Resume Analyzer was a game-changer. Other checkers gave vague scores, but ApexCoach highlighted exactly what keywords were missing for my Node.js profile (Docker/AWS) and generated mock questions to practice them."
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-dark-border/40">
                <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold flex items-center justify-center">
                  AM
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Aria M.</span>
                  <span className="text-[10px] text-zinc-500">Node Backend Engineer @ AWS</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-dark-border/50 hover:border-brand-orange/15 transition-all md:col-span-2 lg:col-span-1">
              <p className="text-zinc-400 text-xs italic leading-relaxed">
                "Practicing live with audio speech synthesis got me past my stage fright. Reading my answer transcript allowed me to refine my STAR structuring before the real loop. Highly recommended for any software engineer."
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-dark-border/40">
                <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold flex items-center justify-center">
                  DK
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">Daniel K.</span>
                  <span className="text-[10px] text-zinc-500">Fullstack Developer @ Vercel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-dark-border/30 bg-zinc-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-orange" />
            <span className="font-extrabold text-zinc-300">APEXCOACH.AI</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <span className="cursor-help hover:text-zinc-300 transition-colors">Privacy Policy</span>
            <span className="cursor-help hover:text-zinc-300 transition-colors">Terms of Service</span>
            <span className="cursor-help hover:text-zinc-300 transition-colors">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

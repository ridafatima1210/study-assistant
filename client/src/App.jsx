import React, { useState, useRef, useEffect } from 'react';
import FlashcardDeck from './components/FlashcardDeck';
import QuizView from './components/QuizView';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const suggestedTopics = [
    { label: "Photosynthesis", query: "Light-dependent and light-independent reactions of Photosynthesis" },
    { label: "CPU Scheduling", query: "OS CPU Scheduling Algorithms (FCFS, SJF, Round Robin)" },
    { label: "REST APIs", query: "RESTful API Design Principles, HTTP Methods, and Status Codes" },
    { label: "JWT Authentication", query: "JSON Web Tokens (JWT) authentication mechanism and security" }
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('intellect_ai_sessions');
      if (stored) {
        setSavedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local workspace state:", e);
    }
  }, []);

  // Global Keyboard Shortcut: Focus input on pressing '/'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async (e, customTopic) => {
    if (e) e.preventDefault();
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim()) return;

    if (customTopic) {
      setTopic(customTopic);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setStudyData(null);

    try {
      const response = await fetch('https://study-assistant-backend-kc4i.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'The server encountered an extraction fault.');
      }

      const data = await response.json();
      setStudyData(data);

      // Save valid session to history state and LocalStorage
      const newSession = { id: Date.now(), topic: targetTopic, data };
      setSavedSessions(prev => {
        const updated = [newSession, ...prev.filter(s => s.topic !== targetTopic)].slice(0, 5);
        localStorage.setItem('intellect_ai_sessions', JSON.stringify(updated));
        return updated;
      });

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Network disruption encountered. Try again.');
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const handleLoadSession = (session) => {
    setTopic(session.topic);
    setStudyData(session.data);
    setError(null);
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    localStorage.removeItem('intellect_ai_sessions');
    setSavedSessions([]);
  };

  const handleResetWorkspace = () => {
    setTopic('');
    setStudyData(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans antialiased relative overflow-x-hidden selection:bg-amber-500/30">
      
      {/* 1. Warm Glow Spheres - Fixed background blur anchors */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden opacity-25 mix-blend-screen z-0">
        <div className="absolute top-[5%] left-[10%] w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] animate-blob-slow" />
        <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[140px] animate-blob-reverse" />
        <div className="absolute top-[35%] left-[40%] w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[110px] animate-blob-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* 2. Floating Cyber Blocks - Fixed, High-Visibility, Fast Floating System */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-0 left-[8%] w-12 h-12 border-2 border-amber-500/40 rounded-lg animate-floating-block" style={{ animationDelay: '0s', animationDuration: '16s' }} />
        <div className="absolute bottom-0 left-[28%] w-8 h-8 bg-amber-500/10 border border-amber-500/40 rounded animate-floating-block" style={{ animationDelay: '3s', animationDuration: '12s' }} />
        <div className="absolute bottom-0 right-[15%] w-16 h-16 border-2 border-amber-500/30 rounded-xl animate-floating-block" style={{ animationDelay: '6s', animationDuration: '18s' }} />
        <div className="absolute bottom-0 right-[42%] w-10 h-10 border border-amber-500/40 rounded-lg animate-floating-block" style={{ animationDelay: '1.5s', animationDuration: '14s' }} />
        <div className="absolute bottom-0 left-[62%] w-6 h-6 bg-amber-500/20 border border-amber-500/40 rounded animate-floating-block" style={{ animationDelay: '8s', animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-[48%] w-14 h-14 border-2 border-amber-500/30 rounded-xl animate-floating-block" style={{ animationDelay: '4s', animationDuration: '17s' }} />
      </div>

      {/* Navigation Header */}
      <nav className="w-full max-w-4xl border-b border-slate-900 pb-4 mb-10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span 
            onClick={handleResetWorkspace}
            className="text-sm font-semibold tracking-tight text-white cursor-pointer hover:opacity-85 transition-opacity"
          >
            IntellectAI
          </span>
          <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
            v1.1.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">API Status: Operational</span>
        </div>
      </nav>

      {/* Main Layout Presentation Container */}
      <div className={`w-full max-w-4xl flex flex-col transition-all duration-500 relative z-10 ${!studyData && !loading ? 'my-auto py-8' : 'my-4'}`}>
        
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Structured Learning Suite
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 font-mono tracking-wide">
            Automated contextual generation powered by Gemini
          </p>
        </header>

        <main className="flex flex-col gap-6 w-full">
          {/* Main Control Panel Console with Gold Border Accents */}
          <section className="bg-slate-900/40 border border-amber-500/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <form onSubmit={(e) => handleGenerate(e)} className="flex flex-col sm:flex-row gap-3 relative">
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a complex topic framework..."
                  className="w-full bg-slate-950/80 border border-amber-500/15 rounded-xl pl-4 pr-14 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all text-sm"
                  disabled={loading}
                />
                <span className="absolute right-4 text-[10px] bg-slate-900 border border-amber-500/10 text-slate-500 px-1.5 py-0.5 rounded font-mono select-none pointer-events-none hidden sm:block">
                  /
                </span>
              </div>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-sm rounded-xl px-6 py-3.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-950/20 whitespace-nowrap active:scale-[0.98]"
              >
                {loading ? 'Synthesizing...' : 'Generate Module'}
              </button>
            </form>

            {/* Quick Start Suggested Topics */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-amber-500/10 pt-4">
              <span className="text-[10px] text-slate-600 font-mono tracking-wider uppercase mr-1">Quick Start:</span>
              {suggestedTopics.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleGenerate(e, item.query)}
                  disabled={loading}
                  className="text-xs bg-slate-950/50 hover:bg-slate-900 border border-amber-500/10 text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-lg transition-all font-mono"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {/* Loading View Component */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-slate-900/20 border border-amber-500/20 backdrop-blur-sm rounded-2xl animate-fadeIn">
              <div className="w-6 h-6 border-2 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase animate-pulse">Executing structured validation via Gemini engine</p>
            </div>
          )}

          {/* Error Boundary Output */}
          {error && (
            <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6 text-center shadow-md backdrop-blur-sm animate-fadeIn">
              <p className="text-rose-400 text-sm font-medium mb-4">{error}</p>
              <button
                onClick={(e) => handleGenerate(e)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl px-4 py-2 text-xs font-semibold transition-all"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Onboarding View & Saved History Panel */}
          {!studyData && !loading && !error && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* History Stack Dashboard */}
              {savedSessions.length > 0 && (
                <section className="bg-slate-900/10 border border-amber-500/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between border-b border-amber-500/10 pb-3 mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Local Workspace History</span>
                    <button 
                      onClick={handleClearHistory}
                      className="text-[10px] text-slate-500 hover:text-rose-400 font-mono transition-colors"
                    >
                      Clear Saved History
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => handleLoadSession(session)}
                        className="p-4 bg-slate-950/50 hover:bg-slate-900/40 border border-amber-500/10 hover:border-amber-500/25 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <p className="text-xs font-medium text-slate-300 truncate">{session.topic}</p>
                        <span className="text-[9px] font-mono text-amber-500 mt-2">Click to load cached set &rarr;</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Functional Framework Descriptors */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-900/20 border border-amber-500/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-900/30 transition-all border border-transparent hover:border-amber-500/10 group">
                  <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">System Block 01</span>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1 transition-colors group-hover:text-white">Interactive Flashcards</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">Structured memory pairs compiled automatically into animated dual-profile interfaces to isolate core concepts efficiently.</p>
                </div>
                <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-900/30 transition-all border border-transparent hover:border-amber-500/10 group">
                  <span className="text-[10px] font-mono tracking-widest text-yellow-500 uppercase font-semibold">System Block 02</span>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1 transition-colors group-hover:text-white">Targeted Assessments</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">Dynamically scaled knowledge verification metrics tailored to trace systemic comprehension deficits over the generation parameter.</p>
                </div>
                <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-900/30 transition-all border border-transparent hover:border-amber-500/10 group">
                  <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">System Block 03</span>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1 transition-colors group-hover:text-white">Isolation Vectors</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">A performance-driven correction engine that builds focused review loops to eliminate friction without resetting complete sets.</p>
                </div>
              </section>
            </div>
          )}

          {/* Study Modules Workstation Outputs */}
          {studyData && !loading && (
            <div className="flex flex-col gap-10 mt-2 animate-fadeIn">
              <div className="border-b border-amber-500/10 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">Active Dataset Target</span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mt-1 leading-normal">{studyData.title}</h2>
                </div>
                <button
                  onClick={handleResetWorkspace}
                  className="text-xs bg-slate-900 hover:bg-slate-850 border border-amber-500/10 hover:border-amber-500/30 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-lg transition-all font-mono whitespace-nowrap"
                >
                  Clear Session
                </button>
              </div>
              
              <section className="flex flex-col gap-4">
                <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase font-bold">Concept Flashcards</h3>
                <FlashcardDeck cards={studyData.flashcards} />
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase font-bold">Retention Assessment</h3>
                <QuizView initialQuestions={studyData.quiz} />
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
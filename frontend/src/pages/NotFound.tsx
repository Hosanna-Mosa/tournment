import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#020617] wings-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="glass-card bg-[#0a0e2e]/40 border border-primary/20 rounded-3xl p-10 md:p-16 shadow-[0_0_100px_rgba(0,170,255,0.15)]">
          <div className="mb-8">
            <span className="material-symbols-outlined text-primary text-6xl md:text-8xl animate-pulse">error</span>
          </div>
          <h1 className="font-h1 text-5xl md:text-7xl text-white uppercase tracking-tighter mb-4">404</h1>
          <p className="font-label-caps text-slate-400 uppercase tracking-[0.3em] text-xs md:text-sm mb-10 opacity-80">
            Signal Lost • Route Not Found
          </p>
          <div className="space-y-4">
            <p className="text-slate-500 text-sm md:text-base mb-8 italic">
              "The coordinates you provided lead to a void in the network. Retreat to base immediately."
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(0,170,255,0.4)] uppercase tracking-widest transition-all text-xs md:text-sm"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Return to Base
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings } from "@/api/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          getSettings(),
          getTournaments()
        ]);
        setSettings(sRes.data);
        // Filter for completed tournaments
        const completed = tRes.data.filter((t: any) => t.status === 'COMPLETED').slice(0, 3);
        setRecentTournaments(completed);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const features = [
    { title: "Daily Tournaments", icon: "sports_esports", desc: "Join curated matches every single day across various game modes and formats." },
    { title: "Real Cash Payouts", icon: "payments", desc: "Win and withdraw your prize money instantly via multiple secure payment gateways." },
    { title: "YouTube Live", icon: "video_library", desc: "Get featured on our main channel with professional Telugu commentary and analysis." },
  ];

  const handleWatchLive = () => {
    if (settings?.liveStreamUrl) {
      window.open(settings.liveStreamUrl, '_blank');
    } else {
      window.open('https://youtube.com/@mhgamingtelugu', '_blank');
    }
  };

  const handleHowToRegister = () => {
    if (settings?.howToRegisterUrl) {
      window.open(settings.howToRegisterUrl, '_blank');
    } else {
      // Default tutorial link if none provided
      window.open('https://youtube.com', '_blank');
    }
  };

  return (
    <main className="wing-texture">
      <section className="relative min-h-[600px] md:min-h-[850px] flex items-center justify-center overflow-hidden wings-bg py-12 md:py-24">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5WaBAW30T_2C0jfuqoH7-Nl3dxr4UrC1LtFJyzpQ0Bqb65y_mxETGhRjqih4kKVZJQcSmklnWpEo9P2N8dFEm8MQbXd-IPPN6mUgnnCe92dSV7HXRy82F8RZjJwzggVC4pjOY3svNMd-7ibaNs3dJcB0RLCt0GzYFXf-R4EE6Bjx05sE5BVR3nLKKw5cBNn3-4IsWAjPetzj8pqGatmg4blPhlQBROZSZfwvIW4seKqnP52IOJ9WyoGtU1fCjeDbiiGKyfAQIPnxY"
            alt="MH Gaming hero"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="font-h1 text-white mb-4 text-3xl sm:text-5xl md:text-8xl leading-tight">MH GAMING TELUGU</h1>
          <p className="font-h3 text-primary-container mb-8 uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-base">
            Register. Compete. Win. Watch LIVE.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:gap-6 mt-8 md:mt-12">
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => navigate("/tournaments")}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-fixed font-h2 text-base md:text-xl px-8 md:px-12 py-3 md:py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] hover:scale-105 transition-all uppercase tracking-widest"
              >
                Join Tournament
              </button>
              <button 
                onClick={handleWatchLive}
                className="w-full sm:w-auto border-2 border-primary-container text-primary-container font-h2 text-base md:text-xl px-8 md:px-12 py-3 md:py-4 rounded-xl hover:bg-primary-container/10 transition-all shadow-[inset_0_0_15px_rgba(0,170,255,0.2)] uppercase tracking-widest"
              >
                Watch Live
              </button>
            </div>
            
            <button 
              onClick={handleHowToRegister}
              className="mt-4 flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container px-6 py-3 rounded-xl transition-all group"
            >
              <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">play_circle</span>
              <span className="text-white/80 group-hover:text-white uppercase font-label-caps text-[10px] md:text-xs tracking-[0.2em]">
                How to Register? Watch Tutorial
              </span>
            </button>
          </div>
        </div>
      </section>

      {recentTournaments.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#020617] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
              <div>
                <h2 className="font-h2 text-white text-2xl md:text-4xl uppercase tracking-widest mb-2">RECENT HALL OF FAME</h2>
                <p className="text-on-surface-variant text-sm md:text-base">Witness the legends who conquered the arena.</p>
              </div>
              <button 
                onClick={() => navigate("/tournaments")}
                className="text-primary-container uppercase font-h2 tracking-widest hover:underline flex items-center gap-2"
              >
                View All Results <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {recentTournaments.map((tournament) => (
                <div 
                  key={tournament._id}
                  onClick={() => navigate(`/tournament/${tournament._id}`)}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary-container/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">emoji_events</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold uppercase tracking-wider text-sm truncate w-[180px]">{tournament.title}</h3>
                      <p className="text-primary-container text-[10px] font-bold tracking-widest">{tournament.type}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <p className="text-outline uppercase text-[9px] tracking-widest mb-1">Champion</p>
                    <p className="text-white font-h2 text-lg uppercase tracking-wider truncate">{tournament.winnerName || 'UNDECLARED'}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                    <span>Prize Won</span>
                    <span className="text-primary">₹{tournament.prizePool.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-h2 text-white mb-4 text-2xl md:text-4xl uppercase tracking-widest">WHY JOIN MH GAMING?</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base px-4">
            Experience the most professional gaming platform with instant payouts and daily live action.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <div key={i} className="glass-card p-6 md:p-10 rounded-2xl text-center group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#00aaff]/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:bg-[#00aaff]/20 transition-colors">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-primary-container">{feature.icon}</span>
              </div>
              <h3 className="font-h3 text-white mb-3 md:mb-4 text-lg md:text-xl uppercase tracking-wider">{feature.title}</h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;

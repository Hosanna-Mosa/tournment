import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournaments, getProfile, getSettings } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Tournament {
  _id: string;
  title: string;
  type: string;
  prizePool: number;
  entryFee: number;
  totalSlots: number;
  filledSlots: number;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  imageUrl: string;
  winnerName?: string;
  startDate?: string;
  startTime?: string;
}

const TournamentSkeleton = () => (
  <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[350px] md:h-[400px]">
    <div className="h-32 md:h-40 w-full bg-slate-900/50 flex items-center justify-center">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <div className="p-4 md:p-6 flex-grow space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  </div>
);

const TournamentsPage = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<'UPCOMING' | 'LIVE' | 'COMPLETED'>('UPCOMING');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const [tRes, pRes, sRes] = await Promise.all([
          getTournaments(),
          getProfile().catch(() => ({ data: null })),
          getSettings().catch(() => ({ data: null }))
        ]);
        
        setTournaments(tRes.data);
        if (pRes?.data?.role === 'admin') {
          setIsAdmin(true);
        }
        setSettings(sRes.data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const dummyTournament: Tournament = {
    _id: 'dummy-id',
    title: 'DEMO TOURNAMENT (ADMIN ONLY)',
    type: 'SQUAD',
    prizePool: 5000,
    entryFee: 50,
    totalSlots: 48,
    filledSlots: 12,
    status: 'UPCOMING',
    imageUrl: '',
  };

  const handleSpectate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings?.liveStreamUrl) {
      window.open(settings.liveStreamUrl, '_blank');
    } else {
      window.open('https://youtube.com/@mhgamingtelugu', '_blank');
    }
  };

  const allTournaments = isAdmin ? [dummyTournament, ...tournaments] : tournaments;
  const filteredTournaments = allTournaments.filter(t => t.status === filter);

  return (
    <main className="min-h-screen px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-8 md:mb-12">
        <div className="relative inline-block">
          <h1 className="font-h1 text-2xl sm:text-3xl md:text-5xl text-white uppercase wing-decoration text-center">ALL TOURNAMENTS</h1>
        </div>
        <p className="text-primary mt-3 font-label-caps tracking-widest opacity-80 text-[10px] md:text-sm text-center">
          SELECT YOUR ARENA AND RISE TO GLORY
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 md:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-4 bg-[#0a0e2e]/50 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
          <button 
            onClick={() => setFilter('UPCOMING')}
            className={`px-8 py-2.5 rounded-xl font-label-caps text-xs tracking-[0.1em] transition-all duration-300 ${
              filter === 'UPCOMING' 
                ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(0,170,255,0.4)]" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('LIVE')}
            className={`px-8 py-2.5 rounded-xl font-label-caps text-xs tracking-[0.1em] flex items-center gap-2 transition-all duration-300 ${
              filter === 'LIVE' 
                ? "bg-secondary text-on-secondary shadow-[0_0_20px_rgba(255,170,0,0.4)]" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-error ${filter === 'LIVE' ? 'animate-pulse' : ''}`}></span>
            Present / Live
          </button>
          <button 
            onClick={() => setFilter('COMPLETED')}
            className={`px-8 py-2.5 rounded-xl font-label-caps text-xs tracking-[0.1em] transition-all duration-300 ${
              filter === 'COMPLETED' 
                ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <TournamentSkeleton key={i} />)
        ) : (
          filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <div 
                key={tournament._id}
                onClick={() => navigate(`/tournament/${tournament._id}`)} 
                className={`glass-card rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all hover:scale-[1.02] ${tournament.status === 'COMPLETED' ? 'opacity-80' : ''}`}
              >
                <div className="relative h-32 md:h-40 w-full bg-slate-900/50 flex items-center justify-center overflow-hidden border-b border-white/5">
                  <div className="text-center opacity-20">
                    <span className="material-symbols-outlined text-5xl md:text-6xl text-primary">sports_esports</span>
                  </div>
                  <div className="absolute top-3 md:top-4 left-3 md:left-4">
                    <span className={`flex items-center gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-label-caps text-[8px] md:text-[9px] backdrop-blur-sm border ${
                      tournament.status === 'LIVE' ? 'bg-error/20 border-error/40 text-error' :
                      tournament.status === 'UPCOMING' ? 'bg-primary/20 border-primary/40 text-primary' :
                      'bg-white/10 border-white/20 text-white'
                    }`}>
                      {tournament.status === 'LIVE' && <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-error animate-pulse"></span>}
                      {tournament._id === 'dummy-id' ? 'DEMO' : tournament.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <h3 className="font-h3 text-white text-base md:text-lg uppercase tracking-wider">{tournament.title}</h3>
                    <span className="font-label-caps text-secondary bg-secondary/10 px-1.5 py-0.5 rounded text-[9px] md:text-xs">{tournament.type}</span>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-outline uppercase tracking-wider text-[10px] md:text-[11px]">
                        {tournament.status === 'COMPLETED' ? 'Winner' : 'Prize Pool'}
                      </span>
                      <span className="text-primary font-bold">
                        {tournament.status === 'COMPLETED' ? (tournament.winnerName || 'TBD') : `₹${tournament.prizePool.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-outline uppercase tracking-wider text-[10px] md:text-[11px]">
                        Entry Fee
                      </span>
                      <span className="text-white">
                        ₹{tournament.entryFee}
                      </span>
                    </div>

                    {tournament.status === 'UPCOMING' && (
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                         <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
                            <span className="text-[10px] text-white font-mono uppercase">{tournament.startDate || 'TBA'}</span>
                         </div>
                         <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
                            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                            <span className="text-[10px] text-white font-mono uppercase">{tournament.startTime || 'TBA'}</span>
                         </div>
                      </div>
                    )}


                  </div>

                  <button 
                    onClick={tournament.status === 'LIVE' ? handleSpectate : undefined}
                    className={`w-full py-2.5 md:py-3 text-[11px] md:text-xs font-label-caps rounded-lg hover:brightness-110 transition-all uppercase mt-auto tracking-widest ${
                    tournament.status === 'LIVE' ? 'bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(255,170,0,0.2)]' :
                    tournament.status === 'UPCOMING' ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(0,170,255,0.3)]' :
                    'bg-surface-container-high text-on-surface'
                  }`}>
                    {tournament.status === 'LIVE' ? 'Spectate Now' :
                     tournament.status === 'UPCOMING' ? 'Register Now' :
                     'View Results'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">sentiment_dissatisfied</span>
              <p className="text-gray-500 font-h1 uppercase tracking-widest">No {filter.toLowerCase()} tournaments found</p>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default TournamentsPage;

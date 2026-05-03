import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournaments } from "@/api/api";
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

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data } = await getTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 md:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#0a0e2e]/50 p-1 rounded-xl border border-white/5 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-label-caps text-[10px] md:text-xs text-white bg-primary-container shadow-[0_0_15px_rgba(0,170,255,0.4)] transition-all">All</button>
          <button className="flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-label-caps text-[10px] md:text-xs text-gray-400 hover:text-white transition-all">Free</button>
          <button className="flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-label-caps text-[10px] md:text-xs text-gray-400 hover:text-white transition-all">Paid</button>
          <button className="flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-label-caps text-[10px] md:text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <TournamentSkeleton key={i} />)
        ) : (
          tournaments.map((tournament) => (
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
                    {tournament.status}
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
                      {tournament.status === 'COMPLETED' ? 'Total Players' : 'Entry Fee'}
                    </span>
                    <span className="text-white">
                      {tournament.status === 'COMPLETED' ? `${tournament.totalSlots} Players` : `₹${tournament.entryFee}`}
                    </span>
                  </div>

                  {tournament.status !== 'COMPLETED' && (
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex justify-between text-[9px] md:text-[11px] font-label-caps text-outline uppercase tracking-tighter">
                        <span>Teams Registered</span>
                        <span>{tournament.filledSlots} Teams</span>
                      </div>
                      <div className="h-1.5 md:h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-container transition-all duration-500 shadow-[0_0_8px_rgba(0,170,255,0.5)]" 
                          style={{ width: `${Math.min((tournament.filledSlots / 8) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <button className={`w-full py-2.5 md:py-3 text-[11px] md:text-xs font-label-caps rounded-lg hover:brightness-110 transition-all uppercase mt-auto tracking-widest ${
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
        )}
      </div>
    </main>
  );
};

export default TournamentsPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBracket } from "@/api/api";
import BracketTree from "@/components/bracket/BracketTree";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const BracketSkeleton = () => (
  <main className="min-h-screen bg-[#020617] px-4 md:px-6 py-8 md:py-12">
    <div className="flex flex-col items-center mb-16 space-y-4">
      <Skeleton className="h-12 w-64 md:w-96" />
      <Skeleton className="h-4 w-40 md:w-48" />
    </div>
    <div className="space-y-12 max-w-7xl mx-auto">
      <Skeleton className="h-8 w-40 mx-auto" />
      <div className="flex gap-8 overflow-x-hidden justify-center py-8">
        <Skeleton className="h-64 w-48 rounded-xl shrink-0" />
        <Skeleton className="h-64 w-48 rounded-xl shrink-0 hidden sm:block" />
        <Skeleton className="h-64 w-48 rounded-xl shrink-0 hidden md:block" />
      </div>
    </div>
  </main>
);

const BracketPage = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [brackets, setBrackets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const fetchBracket = async () => {
    try {
      if (!tournamentId) return;
      const { data: result } = await getBracket(tournamentId);
      
      // Fetch user profile to get ID for privacy checks
      const { getProfile } = await import('@/api/api');
      try {
        const { data: profile } = await getProfile();
        setCurrentUserId(profile._id);
      } catch (err) {
        // Not logged in or failed
      }

      // Ensure result is always an array of {bracket, matches}
      const dataArray = Array.isArray(result) ? result : (result ? [result] : []);
      setBrackets(dataArray.filter(item => item && item.bracket));
    } catch (error) {
      console.error("Failed to fetch bracket:", error);
      setBrackets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket();
    const interval = setInterval(fetchBracket, 15000); // 15s poll for live updates
    return () => clearInterval(interval);
  }, [tournamentId]);

  if (loading) return <BracketSkeleton />;

  if (brackets.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="material-symbols-outlined text-primary/40 text-6xl">account_tree</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-widest text-primary/80">No Bracket Found</h1>
        <p className="text-slate-400 text-xs md:text-sm uppercase tracking-wider mb-8 leading-relaxed">
          The bracket generation for this tournament has not started yet. Please check back later or contact the admin.
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="border-primary/20 text-primary hover:bg-primary/10 uppercase tracking-widest text-[10px]"
        >
          Go Back
        </Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col items-center mb-10 md:mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-8 text-slate-500 hover:text-white uppercase tracking-widest text-[10px] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Tournament
          </Button>
          <h1 className="font-h1 text-2xl sm:text-3xl md:text-5xl text-white uppercase wing-decoration text-center leading-tight">
            Tournament Brackets
          </h1>
          <p className="text-primary mt-3 md:mt-4 font-label-caps tracking-[0.2em] opacity-80 uppercase text-[9px] md:text-xs">
             Live Tournament Progress
          </p>
        </div>

        <div className="space-y-16 md:space-y-32">
          {brackets.map((item, index) => (
            <div key={item.bracket._id || index} className="relative">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
                <span className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-primary/30"></span>
                <h2 className="text-white font-h1 text-base md:text-xl uppercase tracking-[0.2em]">
                  {item.bracket.title || "Live Bracket"}
                </h2>
                <span className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-primary/30"></span>
              </div>
              
              <div className="relative overflow-x-auto pb-8 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:40px_40px] pointer-events-none"></div>
                <div className="min-w-max">
                  <BracketTree 
                    matches={item.matches || []} 
                    totalRounds={item.bracket.totalRounds || 1} 
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BracketPage;

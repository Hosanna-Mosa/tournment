import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardSkeleton = () => (
  <main className="min-h-screen px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto space-y-12">
    <div className="flex justify-between items-center">
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 md:w-64" />
        <Skeleton className="h-4 w-32 md:w-40" />
      </div>
      <Skeleton className="h-16 w-24 md:w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto items-end h-60">
      <Skeleton className="h-32 md:h-48 rounded-xl w-full" />
      <Skeleton className="h-40 md:h-60 rounded-xl w-full" />
      <Skeleton className="h-28 md:h-44 rounded-xl w-full" />
    </div>
    <div className="glass-card rounded-xl overflow-hidden border border-white/5 p-4 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  </main>
);

const LeaderboardPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await getLeaderboard();
        setPlayers(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <LeaderboardSkeleton />;

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <main className="min-h-screen px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <span className="pulse-live flex items-center gap-1.5 md:gap-2 bg-red-600 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full font-label-caps text-[9px] md:text-xs">
              <span className="w-1.5 md:w-2 bg-white rounded-full animate-pulse"></span> LIVE
            </span>
            <h1 className="font-h1 text-2xl md:text-4xl text-white uppercase tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-primary-container font-label-caps text-[10px] md:text-sm tracking-widest uppercase opacity-80">
            GLOBAL PRO RANKINGS
          </p>
        </div>

      </div>

      {/* Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-12 items-end max-w-4xl mx-auto px-1">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="podium-gradient-2nd p-3 md:p-6 rounded-xl text-center h-32 md:h-48 flex flex-col justify-end border border-white/5 shadow-lg relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl md:text-4xl font-bold text-gray-300/20">2</div>
              <h3 className="font-h3 text-white text-[10px] md:text-sm line-clamp-1 uppercase tracking-wider">{topThree[1].username}</h3>
              <p className="text-gray-300 font-label-caps mt-1 md:mt-2 text-[9px] md:text-xs">{topThree[1].points} PTS</p>
            </div>
          )}
          
          {/* 1st Place */}
          {topThree[0] && (
            <div className="podium-gradient-1st p-4 md:p-6 rounded-xl text-center h-44 md:h-64 flex flex-col justify-end border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative">
              <span className="material-symbols-outlined text-yellow-400 text-2xl md:text-4xl mb-1 absolute top-4 left-1/2 -translate-x-1/2">military_tech</span>
              <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 text-4xl md:text-6xl font-bold text-yellow-400/20">1</div>
              <h3 className="font-h3 text-white text-xs md:text-lg line-clamp-1 uppercase tracking-widest">{topThree[0].username}</h3>
              <p className="text-yellow-400 font-label-caps mt-1 md:mt-2 text-[10px] md:text-sm font-bold">{topThree[0].points} PTS</p>
            </div>
          )}
          
          {/* 3rd Place */}
          {topThree[2] && (
            <div className="podium-gradient-3rd p-3 md:p-6 rounded-xl text-center h-28 md:h-44 flex flex-col justify-end border border-white/5 shadow-lg relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl md:text-4xl font-bold text-orange-400/20">3</div>
              <h3 className="font-h3 text-white text-[10px] md:text-sm line-clamp-1 uppercase tracking-wider">{topThree[2].username}</h3>
              <p className="text-orange-400 font-label-caps mt-1 md:mt-2 text-[9px] md:text-xs">{topThree[2].points} PTS</p>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.03] border-b border-white/5">
              <tr>
                <th className="text-left p-3 md:p-4 font-label-caps text-outline uppercase text-[9px] md:text-[10px] tracking-widest">Rank</th>
                <th className="text-left p-3 md:p-4 font-label-caps text-outline uppercase text-[9px] md:text-[10px] tracking-widest">Player Name</th>
                <th className="text-left p-3 md:p-4 font-label-caps text-outline uppercase text-[9px] md:text-[10px] tracking-widest">Kills</th>
                <th className="text-left p-3 md:p-4 font-label-caps text-outline uppercase text-[9px] md:text-[10px] tracking-widest">Matches</th>
                <th className="text-left p-3 md:p-4 font-label-caps text-outline uppercase text-[9px] md:text-[10px] tracking-widest">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {others.map((player, index) => (
                <tr key={index} className="hover:bg-primary/5 transition-colors group">
                  <td className="p-3 md:p-4 font-bold text-primary-container text-xs md:text-sm">#{index + 4}</td>
                  <td className="p-3 md:p-4 text-white font-medium text-xs md:text-sm uppercase tracking-tight">{player.username}</td>
                  <td className="p-3 md:p-4 text-on-surface-variant text-[11px] md:text-sm">{player.kills}</td>
                  <td className="p-3 md:p-4 text-on-surface-variant text-[11px] md:text-sm">{player.matchesPlayed}</td>
                  <td className="p-3 md:p-4 text-white font-bold text-xs md:text-sm">{player.points}</td>
                </tr>
              ))}
              {others.length === 0 && players.length <= 3 && players.length > 0 && (
                <tr>
                  <td colSpan={5} className="p-8 md:p-12 text-center text-outline italic text-xs md:text-sm">All rankings shown above</td>
                </tr>
              )}
              {players.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-outline italic">No rankings available yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default LeaderboardPage;

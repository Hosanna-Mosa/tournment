import { Skeleton } from "@/components/ui/skeleton";

const AdminBracketSkeleton = () => (
  <div className="p-4 md:p-8 bg-[#020617] min-h-screen space-y-12">
    <div className="max-w-5xl mx-auto flex justify-between items-center">
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 md:w-64" />
        <Skeleton className="h-4 w-32 md:w-40" />
      </div>
      <Skeleton className="h-12 w-32 md:w-48 rounded-lg" />
    </div>
    <div className="max-w-5xl mx-auto space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24 md:h-32 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

const AdminBracketPanel = () => {
  const { tournamentId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBracket = async () => {
    try {
      if (!tournamentId) return;
      const { data: result } = await getBracket(tournamentId);
      setData(result);
    } catch (error) {
      console.error("No bracket found or error fetching");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket();
  }, [tournamentId]);

  const handleGenerate = async () => {
    try {
      if (!tournamentId) return;
      await generateBracket(tournamentId);
      toast.success("Bracket generated successfully!");
      fetchBracket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate bracket");
    }
  };

  const handleDeclareWinner = async (matchId: string, winnerId: string) => {
    try {
      await declareWinner(matchId, winnerId);
      toast.success("Winner declared!");
      fetchBracket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <AdminBracketSkeleton />;

  return (
    <div className="p-4 md:p-8 bg-[#020617] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-h1 uppercase tracking-tight">Bracket Control</h1>
            <p className="text-outline text-[11px] md:text-sm mt-1 uppercase tracking-widest opacity-70">Manage tournament matches and winners</p>
          </div>
          {!data && (
            <button 
              onClick={handleGenerate}
              className="w-full md:w-auto bg-primary hover:bg-primary/80 px-6 md:px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(0,170,255,0.3)] uppercase tracking-widest text-xs md:text-sm"
            >
              GENERATE BRACKET
            </button>
          )}
        </div>

        {data ? (
          <div className="space-y-4">
            {data.matches.map((match: any) => (
              <div key={match._id} className="glass-card p-4 md:p-6 flex flex-col md:flex-row justify-between items-center border border-white/5 gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 flex-1 w-full">
                  <div className="flex flex-row md:flex-col items-center gap-2 md:gap-1 min-w-[80px]">
                    <span className="text-outline font-label-caps text-[9px] md:text-[10px] bg-white/5 px-2 py-1 rounded">RD {match.round}</span>
                    <span className="text-[9px] md:text-[10px] text-primary font-bold">MATCH {match.matchNumber}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 md:gap-3 flex-1 w-full">
                    <div className={`p-2.5 md:p-3 rounded-lg flex justify-between items-center transition-colors ${match.winner?._id === match.teamA?._id ? 'bg-primary/20 border border-primary/40' : 'bg-white/5'}`}>
                      <span className={`text-xs md:text-sm font-medium ${match.loser?._id === match.teamA?._id ? 'opacity-40 line-through' : ''}`}>
                        {match.teamA?.teamName || 'TBD'}
                      </span>
                      {match.winner?._id === match.teamA?._id && <span className="text-[9px] md:text-[10px] font-bold text-primary tracking-widest">WINNER</span>}
                    </div>
                    <div className={`p-2.5 md:p-3 rounded-lg flex justify-between items-center transition-colors ${match.winner?._id === match.teamB?._id ? 'bg-primary/20 border border-primary/40' : 'bg-white/5'}`}>
                      <span className={`text-xs md:text-sm font-medium ${match.loser?._id === match.teamB?._id ? 'opacity-40 line-through' : ''}`}>
                        {match.teamB?.teamName || 'TBD'}
                      </span>
                      {match.winner?._id === match.teamB?._id && <span className="text-[9px] md:text-[10px] font-bold text-primary tracking-widest">WINNER</span>}
                    </div>
                  </div>
                </div>

                {match.status !== 'completed' && match.teamA && match.teamB && (
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <p className="text-[9px] md:text-[10px] font-label-caps text-outline text-center mb-1 uppercase tracking-widest">Declare Winner</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeclareWinner(match._id, match.teamA._id)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 md:px-4 py-2 rounded text-[10px] md:text-xs transition-colors flex-1 min-w-[100px] uppercase font-bold"
                      >
                        {match.teamA.teamName}
                      </button>
                      <button 
                        onClick={() => handleDeclareWinner(match._id, match.teamB._id)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 md:px-4 py-2 rounded text-[10px] md:text-xs transition-colors flex-1 min-w-[100px] uppercase font-bold"
                      >
                        {match.teamB.teamName}
                      </button>
                    </div>
                  </div>
                )}
                
                {match.status === 'completed' && (
                  <div className="px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded font-label-caps text-[10px] tracking-[0.2em] w-full md:w-auto text-center">
                    COMPLETED
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-32 bg-white/5 rounded-2xl border border-dashed border-white/10 px-6">
            <span className="material-symbols-outlined text-4xl md:text-5xl text-outline mb-4">account_tree</span>
            <h3 className="text-lg md:text-xl font-bold mb-2 uppercase tracking-widest">No Active Bracket</h3>
            <p className="text-outline text-xs md:text-sm max-w-md mx-auto opacity-70">
              Once you have 8, 16, or 32 approved teams, you can generate the elimination bracket here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBracketPanel;

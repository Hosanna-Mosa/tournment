import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { getBracket, generateBracket, declareWinner, getTournaments } from "@/api/api";

export const Route = createFileRoute("/brackets")({
  component: BracketBuilderPage,
});

function BracketBuilderPage() {
  const { tournamentId } = Route.useSearch<{ tournamentId?: string }>();
  const navigate = useNavigate();
  const [brackets, setBrackets] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(8);

  const fetchData = async () => {
    try {
      const { data: tRes } = await getTournaments();
      setTournaments(tRes);
    } catch (error) {
      console.error("Failed to fetch tournaments");
    }
  };

  const fetchBrackets = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const { data: result } = await getBracket(tournamentId);
      setBrackets(Array.isArray(result) ? result : [result]);
    } catch (error) {
      setBrackets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchBrackets();
  }, [tournamentId]);

  const handleGenerate = async () => {
    if (!tournamentId) return;
    try {
      await generateBracket(tournamentId, batchSize);
      alert(`${batchSize}-team bracket generated!`);
      fetchBrackets();
    } catch (error: any) {
      alert(error.response?.data?.message || "Generation failed");
    }
  };

  const handleWinner = async (matchId: string, teamId: string) => {
    try {
      await declareWinner(matchId, teamId);
      fetchBrackets();
    } catch (error: any) {
      const message = error.response?.data?.message || "Action failed";
      alert(message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="BRACKET MANAGER" />
      <main className="ml-[280px] mt-16 p-8 h-[calc(100vh-64px)] overflow-auto bg-[radial-gradient(circle_at_top_right,_#0a0e2e_0%,_#050818_100%)] w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-h2 text-white uppercase tracking-wider">Bracket Manager</h3>
            <div className="flex items-center gap-4">
              <span className="text-xs text-sky-400 font-space uppercase tracking-widest font-bold">Select Tournament:</span>
              <select 
                value={tournamentId || ''}
                onChange={(e) => navigate({ search: { tournamentId: e.target.value } })}
                className="bg-[#0f172a] border border-sky-500/30 rounded-lg p-2 text-white text-xs outline-none focus:border-sky-500 transition-all min-w-[250px]"
              >
                <option value="">Select a Tournament</option>
                {tournaments.map(t => (
                  <option key={t._id} value={t._id}>{t.title.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-sky-400">Loading bracket systems...</div>
        ) : brackets.length > 0 ? (
          <div className="space-y-20">
            {brackets.map((item, bIndex) => {
              const rounds = Array.from({ length: item.bracket.totalRounds }, (_, i) => i + 1);
              return (
                <div key={item.bracket._id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-sky-400 font-space text-lg font-bold uppercase tracking-widest">
                      Bracket {item.bracket.batchSN || bIndex + 1} ({item.bracket.size} Teams)
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      item.bracket.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}>
                      {item.bracket.status}
                    </span>
                  </div>
                  <div className="relative min-w-max flex gap-16 py-4 bg-white/[0.02] p-8 rounded-2xl border border-white/5 overflow-x-auto">
                    {rounds.map((round) => (
                      <div key={round} className="flex flex-col justify-around gap-12">
                        <h4 className="text-center font-space text-[10px] text-sky-400/30 uppercase tracking-[0.3em] mb-4">
                          Round {round}
                        </h4>
                        {item.matches
                          .filter((m: any) => m.round === round)
                          .map((match: any) => (
                            <div 
                              key={match._id} 
                              className={`w-64 bg-slate-900/60 backdrop-blur-md border rounded-xl overflow-hidden p-4 space-y-3 transition-all ${
                                match.status === 'live' ? 'border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.1)]' : 'border-white/5'
                              }`}
                            >
                              <div className="flex justify-between items-center text-[10px] tracking-widest font-bold">
                                <span className="text-slate-500">MATCH #{match.matchNumber}</span>
                                <span className={`px-2 py-0.5 rounded ${
                                  match.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                  match.status === 'live' ? 'bg-red-500/10 text-red-500' :
                                  'bg-sky-500/10 text-sky-500'
                                }`}>
                                  {match.status}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {[match.teamA, match.teamB].map((team, i) => (
                                  <div 
                                    key={i}
                                    onClick={() => match.status !== 'completed' && team && handleWinner(match._id, team._id)}
                                    className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all ${
                                      match.winner?._id === team?._id 
                                        ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400' 
                                        : match.loser?._id === team?._id 
                                          ? 'opacity-30 line-through grayscale text-slate-500' 
                                          : 'hover:bg-white/5 border border-transparent text-slate-300'
                                    }`}
                                  >
                                    <span className="font-bold text-xs truncate max-w-[180px]">{team?.teamName || 'TBD'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          tournamentId && (
            <div className="text-center py-32 bg-sky-950/10 rounded-2xl border border-dashed border-sky-500/20">
              <span className="material-symbols-outlined text-5xl text-sky-400/20 mb-4">account_tree</span>
              <p className="text-sky-400/50 italic font-space tracking-widest uppercase text-xs">No active batches for this tournament</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

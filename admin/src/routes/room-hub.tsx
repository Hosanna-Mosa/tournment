import { createFileRoute } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useState, useEffect } from "react";
import { getTournaments, getBracket, setRoomDetails, toggleRoomRelease } from "@/api/api";
import { toast } from "sonner";

export const Route = createFileRoute("/room-hub")({
  component: RoomHubPage,
});

function RoomHubPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [activeRound, setActiveRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState<Record<string, { roomId: string, roomPassword: string }>>({});

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await getTournaments();
      setTournaments(res.data);
    } catch (err) {
      toast.error("Failed to fetch tournaments");
    }
  };

  const fetchMatches = async (tournamentId: string) => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const res = await getBracket(tournamentId);
      // Flatten all matches from all brackets/batches
      const allMatches = res.data.flatMap((item: any) => item.matches);
      // We keep ALL matches now (including completed ones) so we can see all rounds
      setMatches(allMatches);
      
      // Default to the current round of the bracket if possible, or just the first round
      const activeMatches = allMatches.filter((m: any) => m.status !== 'completed');
      if (activeMatches.length > 0) {
        const minRound = Math.min(...activeMatches.map((m: any) => m.round));
        setActiveRound(minRound);
      } else if (allMatches.length > 0) {
        setActiveRound(1);
      }

      const initialRoomData: any = {};
      allMatches.forEach((m: any) => {
        initialRoomData[m._id] = { 
          roomId: m.roomId || "", 
          roomPassword: m.roomPassword || "" 
        };
      });
      setRoomData(initialRoomData);
    } catch (err) {
      toast.error("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  // Get unique rounds from current matches
  const uniqueRounds = Array.from(new Set(matches.map((m: any) => m.round))).sort((a: any, b: any) => a - b);
  const filteredMatches = matches.filter((m: any) => m.round === activeRound);

  const handleInputChange = (matchId: string, field: 'roomId' | 'roomPassword', value: string) => {
    setRoomData(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
  };

  const handleSaveAndRelease = async (matchId: string) => {
    const data = roomData[matchId];
    if (!data.roomId || !data.roomPassword) {
      toast.error("Please enter both Room ID and Password");
      return;
    }

    try {
      await setRoomDetails(matchId, data);
      await toggleRoomRelease(matchId, true);
      toast.success("Room ID and Password released!");
      fetchMatches(selectedTournament);
    } catch (err) {
      toast.error("Failed to release room details");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050818]">
      <Sidebar />
      <TopBar title="ROOM ID HUB" />
      
      <main className="ml-[280px] pt-24 px-8 pb-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold font-h2 text-white uppercase tracking-wider">Room ID Hub</h3>
              <p className="text-sm text-sky-400/70 font-space uppercase tracking-[0.2em]">Deploy match credentials to players</p>
            </div>
            
            {/* Round Selection Tabs */}
            {uniqueRounds.length > 0 && (
              <div className="flex items-center gap-2 bg-[#0a0e2e]/50 p-1.5 rounded-xl border border-sky-500/10 inline-flex">
                {uniqueRounds.map((round: any) => (
                  <button
                    key={round}
                    onClick={() => setActiveRound(round)}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      activeRound === round
                        ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                        : 'text-slate-500 hover:text-sky-400 hover:bg-sky-500/5'
                    }`}
                  >
                    Round {round}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 min-w-[300px]">
            <label className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] ml-1">Select Tournament</label>
            <select 
              value={selectedTournament}
              onChange={(e) => {
                setSelectedTournament(e.target.value);
                fetchMatches(e.target.value);
              }}
              className="bg-[#0a0e2e]/80 border border-sky-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all shadow-inner cursor-pointer"
            >
              <option value="">Choose a tournament...</option>
              {tournaments.map(t => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : selectedTournament && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <div key={match._id} className="glass-card rounded-2xl p-6 border-sky-500/10 hover:border-sky-500/30 transition-all group">
                {/* Match Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest block mb-1">
                      Round {match.round} • Match #{match.matchNumber}
                    </span>
                    <h4 className="text-lg font-bold text-white flex items-center gap-3 font-h2">
                      {match.teamA?.teamName} <span className="text-sky-500/50 text-xs">VS</span> {match.teamB?.teamName}
                    </h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    match.isRoomReleased 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {match.isRoomReleased ? '● Released' : '○ Pending'}
                  </div>
                </div>

                {/* Captains Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 bg-[#050818]/50 p-4 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Captain A</p>
                    <p className="text-xs text-white font-medium">{match.teamA?.captain?.username || 'N/A'}</p>
                    <p className="text-[10px] text-sky-400 font-mono">{match.teamA?.captain?.phone || 'No Number'}</p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <p className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Captain B</p>
                    <p className="text-xs text-white font-medium">{match.teamB?.captain?.username || 'N/A'}</p>
                    <p className="text-[10px] text-sky-400 font-mono">{match.teamB?.captain?.phone || 'No Number'}</p>
                  </div>
                </div>

                {/* Inputs Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Room ID</label>
                    <input
                      type="text"
                      placeholder="Enter Room ID"
                      value={roomData[match._id]?.roomId || ""}
                      onChange={(e) => handleInputChange(match._id, 'roomId', e.target.value)}
                      className="w-full bg-[#050818] border border-sky-500/20 rounded-xl px-4 py-3 text-sky-400 font-mono text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Password</label>
                    <input
                      type="text"
                      placeholder="Enter Password"
                      value={roomData[match._id]?.roomPassword || ""}
                      onChange={(e) => handleInputChange(match._id, 'roomPassword', e.target.value)}
                      className="w-full bg-[#050818] border border-sky-500/20 rounded-xl px-4 py-3 text-sky-400 font-mono text-sm outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-800"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSaveAndRelease(match._id)}
                  disabled={match.isRoomReleased}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                    match.isRoomReleased
                      ? 'bg-green-500/10 text-green-500 cursor-default border border-green-500/20'
                      : 'bg-primary-container text-on-primary-container hover:bg-primary-container/80 active:scale-[0.98] shadow-sky-500/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {match.isRoomReleased ? 'verified' : 'send'}
                  </span>
                  {match.isRoomReleased ? 'ROOM DETAILS RELEASED' : 'RELEASE ROOM TO PLAYERS'}
                </button>
              </div>
            ))}
          </div>
        ) : selectedTournament ? (
          <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl border-white/5">
            <span className="material-symbols-outlined text-5xl text-sky-500/20 mb-4">sports_esports</span>
            <p className="text-slate-500 font-space uppercase tracking-widest">No active matches needing Room IDs</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl border-white/5">
            <span className="material-symbols-outlined text-5xl text-sky-500/20 mb-4">ads_click</span>
            <p className="text-slate-500 font-space uppercase tracking-widest">Select a tournament to manage rooms</p>
          </div>
        )}
      </main>
    </div>
  );
}


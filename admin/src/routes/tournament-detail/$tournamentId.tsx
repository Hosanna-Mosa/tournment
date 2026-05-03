import { createFileRoute, useParams } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { getTournamentById, getTeams, updateTeamStatus, updateTournament, generateBracket, updatePayoutStatus } from "@/api/api";
import { toast } from "sonner";

export const Route = createFileRoute("/tournament-detail/$tournamentId")({
  component: TournamentDetailPage,
});

function TournamentDetailPage() {
  const { tournamentId } = useParams({ from: "/tournament-detail/$tournamentId" });
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [winnerPayoutRef, setWinnerPayoutRef] = useState("");
  const [runnerUpPayoutRef, setRunnerUpPayoutRef] = useState("");
  const [isProcessingWinner, setIsProcessingWinner] = useState(false);
  const [isProcessingRunnerUp, setIsProcessingRunnerUp] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [tRes, teamsRes] = await Promise.all([
        getTournamentById(tournamentId),
        getTeams(tournamentId)
      ]);
      setTournament(tRes.data);
      setTeams(teamsRes.data);
      setEditData(tRes.data);
      
      if (teamsRes.data.some((t: any) => t.status === 'PENDING')) {
        setActiveTab("teams");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setErrorMsg(error.response?.data?.message || "Failed to load tournament data. Please check if you are logged in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutStatusUpdate = async (type: 'winner' | 'runnerUp', status: string, ref: string) => {
    try {
      if (type === 'winner') setIsProcessingWinner(true);
      else setIsProcessingRunnerUp(true);
      
      await updatePayoutStatus(tournamentId, { type, status, ref });
      toast.success(`${type === 'winner' ? 'Winner' : 'Runner-up'} payout updated!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payout");
    } finally {
      setIsProcessingWinner(false);
      setIsProcessingRunnerUp(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const handleUpdateTournament = async () => {
    try {
      await updateTournament(tournamentId, editData);
      setShowEditModal(false);
      fetchData();
      alert("Tournament updated successfully");
    } catch (error) {
      alert("Failed to update tournament");
    }
  };

  const handleStatusUpdate = async (teamId: string, status: string) => {
    try {
      await updateTeamStatus(teamId, { status });
      fetchData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#050818] text-sky-400">Loading Tournament Details...</div>;
  if (!tournament) return <div className="flex items-center justify-center h-screen bg-[#050818] text-red-400">Tournament not found</div>;

  const approvedTeams = teams.filter(t => t.status === 'APPROVED');
  const batches = Array.from(new Set(teams.filter(t => t.batchSN).map(t => t.batchSN))).sort();
  
  // Hold System Logic: Calculate progress to next batch of 8
  const currentBatchProgress = approvedTeams.length % 8;
  const teamsNeededForNextBatch = 8 - currentBatchProgress;
  const totalBatches = Math.floor(approvedTeams.length / 8);

  const handleStartTournament = async () => {
    try {
      // 1. Generate the unified bracket for all approved teams
      await generateBracket(tournamentId);
      
      // 2. Set tournament status to LIVE
      await updateTournament(tournamentId, { status: 'LIVE' });
      
      fetchData();
      alert("Tournament is now LIVE with a unified bracket!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to start tournament");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title={tournament.title.toUpperCase()} />
      <main className="ml-[280px] mt-16 p-6 w-full pb-32">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-500 rounded-xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {errorMsg}
          </div>
        )}
        <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden mb-8 border border-sky-500/20 bg-slate-900/40">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1223] via-[#0f1223]/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded flex items-center gap-2 border ${
                  tournament.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-secondary-container/20 text-secondary-fixed-dim border-secondary-container/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tournament.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-secondary-fixed-dim'}`}></span>{" "}
                  {tournament.status}
                </span>
              </div>
              <h1 className="font-space text-[48px] text-on-background leading-none font-bold">{tournament.title}</h1>
            </div>
            <div className="flex items-center gap-12 text-right">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-space uppercase tracking-widest">Winner Pool</p>
                <p className="text-tertiary font-space text-[32px] font-bold">₹{tournament.prizePool.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-space uppercase tracking-widest">Runner-up Pool</p>
                <p className="text-sky-400 font-space text-[32px] font-bold">₹{(tournament.runnerUpPrize || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 mb-8 border-b border-sky-500/10 px-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`pb-4 uppercase text-sm tracking-widest transition-all ${activeTab === 'overview' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("teams")}
            className={`pb-4 uppercase text-sm tracking-widest transition-all ${activeTab === 'teams' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Teams ({teams.length})
          </button>
          <button 
            onClick={() => setActiveTab("batches")}
            className={`pb-4 uppercase text-sm tracking-widest transition-all ${activeTab === 'batches' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
          >
            Batches ({batches.length})
          </button>
          {tournament.status === 'COMPLETED' && (
            <button 
              onClick={() => setActiveTab("payouts")}
              className={`pb-4 uppercase text-sm tracking-widest transition-all ${activeTab === 'payouts' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-500 hover:text-slate-200'}`}
            >
              Payouts
            </button>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/20 rounded-xl p-6">
                <h3 className="font-space text-2xl text-sky-400 mb-6 font-semibold">Hold System Progress</h3>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Next Batch (8 Series)</span>
                  <span className="text-sky-400 font-bold">{approvedTeams.length} Approved</span>
                </div>
                <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden mb-4 border border-slate-800 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,170,255,0.5)]" 
                    style={{ width: `${(currentBatchProgress / 8) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 italic">
                  {teamsNeededForNextBatch === 0 || teamsNeededForNextBatch === 8 
                    ? `Ready for next bracket! (${totalBatches} batches formed)` 
                    : `Need ${teamsNeededForNextBatch} more approved teams to form the next batch of 8.`}
                </p>
              </div>

              <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/20 rounded-xl p-6">
                <h3 className="font-space text-2xl text-sky-400 mb-4 font-semibold">Tournament Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Type</p>
                    <p className="text-white font-bold">{tournament.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Entry Fee</p>
                    <p className="text-white font-bold">₹{tournament.entryFee}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Teams</p>
                    <p className="text-white font-bold">{approvedTeams.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sky-400 font-bold">{tournament.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="space-y-8">
            {batches.length > 0 ? batches.map(batchName => (
              <div key={batchName} className="bg-surface-container/40 border border-sky-500/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-sky-500/10 p-4 border-b border-sky-500/20 flex justify-between items-center">
                  <h4 className="text-sky-400 font-space font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">inventory_2</span>
                    {batchName}
                  </h4>
                  <span className="text-[10px] text-slate-500 uppercase font-space tracking-widest">
                    {teams.filter(t => t.batchSN === batchName).length} Teams Assigned
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                  {teams.filter(t => t.batchSN === batchName).map(team => (
                    <div key={team._id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                      <p className="text-white font-bold text-sm truncate uppercase tracking-wider">{team.teamName}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] text-slate-500 italic">Captain: {team.captain?.username}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase font-bold tracking-tighter">Approved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-500 italic">No batches formed yet. Teams are placed in batches upon bracket generation.</div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
            <div className="bg-surface-container-low rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container text-sky-400/70 font-space text-[10px] uppercase tracking-[0.2em] border-b border-sky-500/20">
                  <tr>
                    <th className="px-6 py-4">Team Name</th>
                    <th className="px-6 py-4">Captain</th>
                    <th className="px-6 py-4">Players</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-500/5">
                  {teams.map((team) => (
                    <tr key={team._id} className="hover:bg-sky-400/[0.03] transition-colors group">
                      <td className="px-6 py-5">
                        <a 
                          href={`/verify-team/${team._id}`}
                          className="font-bold text-on-surface hover:text-sky-400 flex items-center gap-2 transition-colors"
                        >
                          {team.teamName}
                          {team.status === 'WAITING_VERIFICATION' && (
                            <span className="material-symbols-outlined text-[14px] text-yellow-500 animate-pulse">verified_user</span>
                          )}
                        </a>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-sm font-medium">{team.captain?.username}</span>
                          <span className="text-slate-500 text-[10px]">{team.captain?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-400 text-sm">
                        {team.players.length} Players
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          team.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          team.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                        }`}>
                          {team.status === 'PENDING' ? 'ON HOLD' : team.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          {team.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleStatusUpdate(team._id, 'APPROVED')}
                              className="px-3 py-1 bg-green-500/20 text-green-500 text-[10px] font-bold rounded border border-green-500/30 hover:bg-green-500/30 transition-all"
                            >
                              Approve
                            </button>
                          )}
                          {team.status !== 'REJECTED' && (
                            <button 
                              onClick={() => handleStatusUpdate(team._id, 'REJECTED')}
                              className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold rounded border border-red-500/30 hover:bg-red-500/30 transition-all"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {teams.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">No teams registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-6">
             <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/20 rounded-xl p-6">
                <h3 className="font-space text-2xl text-sky-400 mb-6 font-semibold">Prize Payout Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Winner Payout */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                            <span className="material-symbols-outlined">emoji_events</span>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Winner Team</p>
                            <p className="text-white font-bold">{tournament.winnerName || "Processing..."}</p>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        tournament.winnerPayoutStatus === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                      }`}>
                        {tournament.winnerPayoutStatus}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Winner's UPI ID</p>
                        {tournament.winnerUpiId ? (
                          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-white font-mono text-sm flex-1">{tournament.winnerUpiId}</p>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(tournament.winnerUpiId); toast.success("Copied!"); }}
                              className="text-sky-400 hover:text-sky-300 material-symbols-outlined text-sm"
                            >
                              content_copy
                            </button>
                          </div>
                        ) : (
                          <p className="text-slate-500 italic text-sm py-3 bg-white/5 p-3 rounded-lg border border-white/10">UPI ID not yet submitted by winner.</p>
                        )}
                      </div>

                      {tournament.winnerUpiId && tournament.winnerPayoutStatus === 'PENDING' && (
                        <div className="space-y-3 pt-4 border-t border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">Mark as Paid</p>
                           <input 
                              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-tertiary outline-none transition-all text-sm"
                              placeholder="Enter Transaction Ref / UTR"
                              value={winnerPayoutRef}
                              onChange={(e) => setWinnerPayoutRef(e.target.value)}
                           />
                           <button 
                              onClick={() => handlePayoutStatusUpdate('winner', 'PAID', winnerPayoutRef)}
                              disabled={!winnerPayoutRef || isProcessingWinner}
                              className="w-full py-3 bg-tertiary hover:bg-tertiary/80 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                           >
                              {isProcessingWinner ? "PROCESSING..." : "CONFIRM & MARK AS PAID"}
                           </button>
                        </div>
                      )}

                      {tournament.winnerPayoutStatus === 'PAID' && (
                        <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction Reference</p>
                           <p className="text-white font-mono text-sm">{tournament.winnerPayoutRef}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Runner-up Payout */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                            <span className="material-symbols-outlined">medal</span>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Runner-up Team</p>
                            <p className="text-white font-bold">{teams.find(t => t._id === tournament.runnerUpTeam)?.teamName || "Processing..."}</p>
                         </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        tournament.runnerUpPayoutStatus === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                      }`}>
                        {tournament.runnerUpPayoutStatus}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Runner-up's UPI ID</p>
                        {tournament.runnerUpUpiId ? (
                          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-white font-mono text-sm flex-1">{tournament.runnerUpUpiId}</p>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(tournament.runnerUpUpiId); toast.success("Copied!"); }}
                              className="text-sky-400 hover:text-sky-300 material-symbols-outlined text-sm"
                            >
                              content_copy
                            </button>
                          </div>
                        ) : (
                          <p className="text-slate-500 italic text-sm py-3 bg-white/5 p-3 rounded-lg border border-white/10">UPI ID not yet submitted by runner-up.</p>
                        )}
                      </div>

                      {tournament.runnerUpUpiId && tournament.runnerUpPayoutStatus === 'PENDING' && (
                        <div className="space-y-3 pt-4 border-t border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">Mark as Paid</p>
                           <input 
                              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all text-sm"
                              placeholder="Enter Transaction Ref / UTR"
                              value={runnerUpPayoutRef}
                              onChange={(e) => setRunnerUpPayoutRef(e.target.value)}
                           />
                           <button 
                              onClick={() => handlePayoutStatusUpdate('runnerUp', 'PAID', runnerUpPayoutRef)}
                              disabled={!runnerUpPayoutRef || isProcessingRunnerUp}
                              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                           >
                              {isProcessingRunnerUp ? "PROCESSING..." : "CONFIRM & MARK AS PAID"}
                           </button>
                        </div>
                      )}

                      {tournament.runnerUpPayoutStatus === 'PAID' && (
                        <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction Reference</p>
                           <p className="text-white font-mono text-sm">{tournament.runnerUpPayoutRef}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>
      
      <div className="fixed bottom-0 left-[280px] w-[calc(100%-280px)] bg-slate-950/90 backdrop-blur-xl border-t border-sky-500/30 p-4 z-40 flex justify-end gap-3">
        <button 
          onClick={() => setShowEditModal(true)}
          className="px-6 py-3 border border-sky-500/30 text-sky-400 rounded font-bold uppercase tracking-widest text-xs hover:bg-sky-500/10 transition-all"
        >
          Edit
        </button>
        <button 
          onClick={handleStartTournament}
          disabled={tournament.status === 'LIVE'}
          className="px-8 py-3 bg-primary-container text-on-primary-container rounded font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,170,255,0.4)] hover:shadow-[0_0_30px_rgba(0,170,255,0.6)] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          {tournament.status === 'LIVE' ? 'Tournament Live' : 'Start Tournament'}
        </button>
      </div>

      {/* Edit Tournament Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-surface-container-low border border-sky-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,170,255,0.1)] animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-sky-500/10 flex justify-between items-center">
              <h3 className="text-xl font-space font-bold text-white uppercase tracking-wider">Edit Tournament</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tournament Title</label>
                  <input 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Winner Prize (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all"
                    value={editData.prizePool}
                    onChange={(e) => setEditData({...editData, prizePool: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Runner-up Prize (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all"
                    value={editData.runnerUpPrize}
                    onChange={(e) => setEditData({...editData, runnerUpPrize: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Entry Fee (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all"
                    value={editData.entryFee}
                    onChange={(e) => setEditData({...editData, entryFee: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Match Type</label>
                  <select 
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-all"
                    value={editData.type}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                  >
                    <option value="4V4 SQUAD">4V4 SQUAD</option>
                    <option value="DUO">DUO</option>
                    <option value="SOLO">SOLO</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-4 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-500 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTournament}
                  className="flex-1 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,170,255,0.3)] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamById, updateTeamStatus } from "@/api/api";
import { toast } from "sonner";

export default function TeamVerificationPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const { data } = await getTeamById(teamId);
      setTeam(data);
    } catch (error) {
      toast.error("Failed to fetch team details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const handleVerify = async (status: string) => {
    if (!teamId) return;
    setSubmitting(true);
    try {
      await updateTeamStatus(teamId, { status });
      toast.success(`Team ${status === 'APPROVED' ? 'Approved' : 'Reset'} successfully`);
      navigate(`/tournament-detail/${team.tournamentId}`);
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#050818] text-sky-400">Loading Verification Data...</div>;
  if (!team) return <div className="flex items-center justify-center h-screen bg-[#050818] text-red-400">Team not found</div>;

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="PAYMENT VERIFICATION" />
      <main className="ml-[280px] mt-16 p-8 w-full pb-32">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sky-400 text-xs font-space uppercase tracking-[0.3em] mb-2">Reviewing Tournament Entry</p>
              <h1 className="text-4xl font-space font-bold text-white tracking-tighter uppercase">{team.teamName}</h1>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border ${
                team.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                team.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
              }`}>
                Current Status: {team.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left: Team Info */}
            <div className="col-span-12 lg:col-span-7 space-y-8">
              <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/10 rounded-2xl p-6">
                <h3 className="text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-sky-500/10 pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-400">groups</span>
                  Team Roster
                </h3>
                <div className="space-y-4">
                  {team.players.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white font-bold">{p.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {p.gameId}</p>
                      </div>
                      <span className="text-[10px] text-sky-500/50 font-space uppercase tracking-widest">Player {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/10 rounded-2xl p-6">
                <h3 className="text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-sky-500/10 pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-400">person</span>
                  Captain Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Username</p>
                    <p className="text-white font-bold">{team.captain?.username}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-white font-bold">{team.captain?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment Verification */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <div className="bg-surface-container/60 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,170,255,0.05)]">
                <h3 className="text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-sky-500/10 pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-sky-400">payments</span>
                  Transaction Evidence
                </h3>
                
                <div className="text-center space-y-6">
                  <div className="p-6 bg-slate-950 rounded-2xl border border-sky-500/30">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">Player-Submitted UTR</p>
                    <p className="text-3xl font-mono text-white font-black tracking-[0.2em]">{team.utrNumber || 'MISSING'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => handleVerify('REJECTED')}
                      disabled={submitting}
                      className="py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                    >
                      Reset / Reject
                    </button>
                    <button 
                      onClick={() => handleVerify('APPROVED')}
                      disabled={submitting}
                      className="py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(0,170,255,0.3)] transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Verifying...' : 'Approve Team'}
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 italic">Approving this team will allow them to be placed in the tournament bracket.</p>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/tournament-detail/${team.tournamentId}`)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

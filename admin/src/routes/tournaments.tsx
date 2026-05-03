import { createFileRoute, Link } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { getTournaments, deleteTournament } from "@/api/api";

export const Route = createFileRoute("/tournaments")({
  component: TournamentsPage,
});

interface Tournament {
  _id: string;
  title: string;
  type: string;
  prizePool: number;
  entryFee: number;
  totalSlots: number;
  filledSlots: number;
  status: string;
  createdAt: string;
}

function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await deleteTournament(id);
        fetchTournaments();
      } catch (error) {
        alert("Failed to delete tournament");
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="TOURNAMENTS" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-space uppercase tracking-widest mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-sky-400">Tournaments</span>
            </nav>
            <h2 className="font-space text-[32px] text-on-surface tracking-tight font-bold">TOURNAMENTS</h2>
          </div>
          <Link to="/create-tournament" className="flex items-center gap-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-6 py-3 rounded shadow-[0_0_20px_rgba(0,170,255,0.4)] transition-all active:scale-95 font-bold uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined">add</span>
            CREATE TOURNAMENT
          </Link>
        </div>
        
        <div className="bg-surface-container-low rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-20 text-center text-slate-500">Loading tournaments...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-sky-400/70 font-space text-[10px] uppercase tracking-[0.2em] border-b border-sky-500/20">
                <tr>
                  <th className="px-6 py-4 font-semibold">#</th>
                  <th className="px-6 py-4 font-semibold">Tournament Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Entry Fee</th>
                  <th className="px-6 py-4 font-semibold">Teams</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-500/5">
                {tournaments.map((t, index) => (
                  <tr key={t._id} className="hover:bg-sky-400/[0.03] transition-colors group">
                    <td className="px-6 py-5 text-slate-500 font-space">{index + 1}</td>
                    <td className="px-6 py-5">
                      <Link to="/tournament-detail/$tournamentId" params={{ tournamentId: t._id }} className="flex items-center gap-3 cursor-pointer">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-sky-400/20 to-blue-600/20 border border-sky-500/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sky-400 text-sm">videogame_asset</span>
                        </div>
                        <span className="font-bold text-on-surface group-hover:text-sky-400 transition-colors">
                          {t.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-slate-300">{t.type}</td>
                    <td className="px-6 py-5 text-secondary-fixed-dim font-bold">₹{t.entryFee}</td>
                    <td className="px-6 py-5 text-slate-300">{t.filledSlots}/{t.totalSlots}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        t.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        t.status === 'UPCOMING' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 
                          t.status === 'UPCOMING' ? 'bg-sky-500' : 'bg-slate-500'
                        }`}></span>{" "}
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to="/brackets" search={{ tournamentId: t._id }} className="p-2 text-slate-500 hover:text-sky-400">
                          <span className="material-symbols-outlined text-[18px]">account_tree</span>
                        </Link>
                        <button onClick={() => handleDelete(t._id)} className="p-2 text-slate-500 hover:text-red-400">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tournaments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-500 italic">No tournaments found. Create one to get started!</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

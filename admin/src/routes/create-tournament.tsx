import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useState } from "react";
import { createTournament } from "@/api/api";

export const Route = createFileRoute("/create-tournament")({
  component: CreateTournamentPage,
});

function CreateTournamentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    type: "4V4 SQUAD",
    prizePool: 0,
    runnerUpPrize: 0,
    entryFee: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createTournament(formData);
      navigate({ to: "/tournaments" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="CREATE TOURNAMENT" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-space uppercase tracking-widest mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="cursor-pointer hover:text-sky-400" onClick={() => navigate({ to: "/tournaments" })}>Tournaments</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-sky-400">Create</span>
            </nav>
            <h2 className="font-space text-[32px] text-on-surface tracking-tight font-bold">NEW TOURNAMENT</h2>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl border border-sky-500/20 shadow-2xl p-8 max-w-3xl">
          {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-500 rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Tournament Title</label>
                <input 
                   required
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors"
                  placeholder="e.g. Sunday Slaughter"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Match Type</label>
                <select 
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="4V4 SQUAD">4V4 SQUAD</option>
                  <option value="DUO">DUO</option>
                  <option value="SOLO">SOLO</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Winner Prize Pool (₹)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors"
                  value={formData.prizePool || ''}
                  onChange={(e) => setFormData({...formData, prizePool: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Runner-up Prize Pool (₹)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors"
                  value={formData.runnerUpPrize || ''}
                  onChange={(e) => setFormData({...formData, runnerUpPrize: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Entry Fee (₹)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors"
                  value={formData.entryFee || ''}
                  onChange={(e) => setFormData({...formData, entryFee: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Start Date</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors [color-scheme:dark]"
                  value={(formData as any).startDate || ''}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-outline font-space text-xs uppercase tracking-widest font-semibold">Start Time</label>
                <input 
                  type="time"
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-colors [color-scheme:dark]"
                  value={(formData as any).startTime || ''}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,170,255,0.4)] disabled:opacity-50 transition-all"
              >
                {loading ? "CREATING..." : "CREATE TOURNAMENT"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

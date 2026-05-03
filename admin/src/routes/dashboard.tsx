import { createFileRoute } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { getTournaments, getLeaderboard } from "@/api/api";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({
    tournaments: 0,
    teams: 0,
    revenue: 0,
    live: 0
  });
  const [liveTournaments, setLiveTournaments] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: tournaments } = await getTournaments();
        const live = tournaments.filter((t: any) => t.status === 'LIVE');
        
        // Mocking some revenue logic based on entry fees
        const revenue = tournaments.reduce((acc: number, curr: any) => acc + (curr.entryFee * curr.filledSlots), 0);
        const totalTeams = tournaments.reduce((acc: number, curr: any) => acc + curr.filledSlots, 0);

        setStats({
          tournaments: tournaments.length,
          teams: totalTeams,
          revenue,
          live: live.length
        });
        setLiveTournaments(live);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="DASHBOARD" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen bg-[#0a0e2e] w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tournaments", value: stats.tournaments.toString(), icon: "emoji_events" },
            { label: "Registered Teams", value: stats.teams.toString(), icon: "groups" },
            { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: "payments" },
          ].map((c) => (
            <div key={c.label} className="glass-card p-5 rounded-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-all">
                <span className="material-symbols-outlined text-7xl">{c.icon}</span>
              </div>
              <p className="text-sky-400/70 font-space text-xs uppercase mb-2 tracking-widest font-semibold">
                {c.label}
              </p>
              <h3 className="font-orbitron text-[40px] text-sky-400">{c.value}</h3>
            </div>
          ))}
          <div className="glass-card p-5 rounded-xl relative overflow-hidden group border-sky-500/50 bg-sky-950/20">
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:opacity-30 transition-all">
              <span className="material-symbols-outlined text-7xl text-error">stream</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-error pulse-red"></div>
              <p className="text-error font-space text-xs uppercase tracking-widest font-semibold">Live Now</p>
            </div>
            <h3 className="font-orbitron text-[40px] text-error">{stats.live}</h3>
          </div>
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-error shadow-[0_0_10px_#ff0000]"></div>
              <h2 className="font-space text-2xl text-on-background uppercase tracking-tight font-semibold">
                Live Tournaments
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveTournaments.map((t) => (
              <div key={t._id} className="glass-card flex h-48 rounded-xl overflow-hidden group border-l-4 border-l-error">
                <div className="w-1/3 relative h-full bg-slate-900/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-error/30">live_tv</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0e2e]"></div>
                </div>
                <div className="w-2/3 p-5 flex flex-col justify-center">
                  <span className="text-[10px] bg-error/20 text-error font-bold px-2 py-0.5 rounded-full w-fit mb-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> LIVE
                  </span>
                  <h4 className="font-space text-2xl text-sky-400 mb-1 font-semibold">{t.title}</h4>
                  <p className="text-slate-400 text-sm mb-4">{t.type} Tournament</p>
                </div>
              </div>
            ))}
            {liveTournaments.length === 0 && (
              <div className="glass-card p-10 text-center text-slate-500 italic rounded-xl border border-white/5 w-full col-span-2">
                No tournaments currently live.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

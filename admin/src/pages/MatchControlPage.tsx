import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function MatchControlPage() {
  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="MATCH CONTROL" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen bg-[#0a0e2e] w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-error-container/50 bg-surface-container-high shadow-[0_0_30px_rgba(147,0,10,0.15)] flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-error-container/20 border border-error/30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="text-[10px] font-black text-error uppercase tracking-wider">🔴 LIVE MATCH</span>
                </div>
                <span className="text-xs text-slate-400">#M-204 • ERANGEL MAP</span>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-12 w-full">
                <div className="flex flex-col items-center gap-4 w-1/3">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-sky-500/20 flex items-center justify-center p-4">
                    <span className="material-symbols-outlined text-5xl text-sky-400">shield</span>
                  </div>
                  <h2 className="font-space text-[32px] text-on-surface text-center tracking-tight font-bold">
                    TEAM ALPHA
                  </h2>
                </div>
                <div className="font-space text-[48px] text-sky-400/30 italic font-bold">VS</div>
                <div className="flex flex-col items-center gap-4 w-1/3">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-sky-500/20 flex items-center justify-center p-4">
                    <span className="material-symbols-outlined text-5xl text-yellow-400">bolt</span>
                  </div>
                  <h2 className="font-space text-[32px] text-on-surface text-center tracking-tight font-bold">
                    TEAM ZEUS
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

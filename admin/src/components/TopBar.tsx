export default function TopBar({ title }: { title?: string }) {
  return (
    <header className="fixed top-0 left-[280px] w-[calc(100%-280px)] h-16 bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/30 flex justify-between items-center px-6 z-40 shadow-[0_4px_20px_rgba(0,170,255,0.1)]">
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-sky-400 tracking-wider uppercase font-space">
          {title || "TRIOZEN TECH"}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative flex items-center bg-slate-900/50 border border-sky-500/20 rounded-full px-4 py-1.5 focus-within:border-sky-400 transition-all">
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-slate-500 w-64 outline-none"
            placeholder="Search..."
            type="text"
          />
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-slate-400 hover:text-sky-400 cursor-pointer transition-all">
            notifications
          </span>
          <span className="material-symbols-outlined text-slate-400 hover:text-sky-400 cursor-pointer transition-all">
            sensors
          </span>
          <div className="flex items-center gap-3 cursor-pointer active:scale-95 transition-all">
            <div className="w-8 h-8 rounded-full border border-sky-400 bg-sky-400/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-sky-400 text-lg">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

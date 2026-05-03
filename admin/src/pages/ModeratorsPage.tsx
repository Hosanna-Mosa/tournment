import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function ModeratorsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="MODERATORS" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-surface-container-high/40 border border-outline-variant/20 rounded-xl p-5 backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-xl border-2 border-sky-400/20 bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-sky-400">person</span>
              </div>
              <span className="px-2 py-1 bg-sky-400/10 text-sky-400 text-[10px] font-black tracking-widest rounded uppercase">
                MODERATOR
              </span>
            </div>
            <div className="mb-6">
              <h3 className="font-space text-2xl text-on-surface font-semibold">Ravi Kumar</h3>
              <p className="text-outline text-sm">ravi.k@mhgaming.pro</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-surface-variant text-xs font-bold rounded">Edit</button>
              <button className="flex-1 py-2 border border-error text-error text-xs font-bold rounded">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

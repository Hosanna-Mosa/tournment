import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function StreamViewPage() {
  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="STREAM CONTROL" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen bg-background w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="glass-card rounded-xl overflow-hidden aspect-video relative group bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-sky-400/20 border border-sky-400/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sky-400 text-5xl">play_arrow</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space text-lg text-sky-400 flex items-center gap-2 mb-4 font-semibold">
                <span className="material-symbols-outlined">campaign</span> ANNOUNCEMENT PANEL
              </h3>
              <textarea
                className="w-full bg-[#050818] border border-sky-500/20 rounded-lg p-4 text-on-surface h-40 outline-none"
                placeholder="Type match update here..."
              ></textarea>
              <button className="w-full mt-4 bg-secondary-container text-on-secondary-container py-3 rounded-lg font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span> SEND TO WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

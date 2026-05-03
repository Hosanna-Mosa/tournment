import { createFileRoute } from "@tanstack/react-router";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const Route = createFileRoute("/hall-of-fame")({
  component: HallOfFamePage,
});

function HallOfFamePage() {
  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="HALL OF FAME" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen bg-surface-container-lowest w-full">
        <div className="grid grid-cols-12 gap-4 mb-10">
          <div className="col-span-12 md:col-span-6 md:col-start-4 glass-card rounded-xl p-5 border-4 border-tertiary flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-tertiary text-6xl mb-4">workspace_premium</span>
            <div className="w-32 h-32 rounded-full mb-6 border-4 border-tertiary bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-tertiary">military_tech</span>
            </div>
            <p className="text-tertiary font-space text-xs tracking-[0.4em] mb-2 uppercase font-semibold">
              Supreme Champions
            </p>
            <h2 className="font-space text-[32px] text-white uppercase mb-4 font-bold">Neon Phantoms</h2>
            <p className="text-tertiary font-space text-2xl font-black">₹50,000</p>
          </div>
        </div>
      </main>
    </div>
  );
}

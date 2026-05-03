import { Link, useNavigate, useLocation } from "@tanstack/react-router";

const menuItems = [
  { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { path: "/tournaments", icon: "emoji_events", label: "Tournaments" },
  { path: "/brackets", icon: "account_tree", label: "Bracket Builder" },
  { path: "/match-control", icon: "settings_remote", label: "Match Control" },
  { path: "/room-hub", icon: "meeting_room", label: "Room ID Hub" },
  { path: "/stream", icon: "live_tv", label: "Stream View" },
  { path: "/hall-of-fame", icon: "military_tech", label: "Hall of Fame" },
  { path: "/moderators", icon: "group", label: "Moderators" },
] as const;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#050818] border-r border-sky-500/20 shadow-2xl shadow-sky-900/20 flex flex-col py-6 z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container">sports_esports</span>
        </div>
        <div>
          <h1 className="font-black text-2xl bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent leading-none font-space">
            MH GAMING
          </h1>
          <p className="font-space font-medium uppercase text-[10px] tracking-widest text-sky-400/60 mt-1">
            COMMAND CENTER
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`cursor-pointer active:translate-x-1 flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-sky-400/10 text-sky-400 border-r-2 border-sky-400 shadow-[inset_-10px_0_15px_-10px_rgba(0,170,255,0.5)]"
                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-space font-medium uppercase text-xs tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 pt-6 mt-6 border-t border-sky-500/10">
        <button
          onClick={() => navigate({ to: "/tournaments" })}
          className="w-full py-3 bg-primary-container text-on-primary-container font-black text-xs tracking-widest rounded shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
        >
          CREATE TOURNAMENT
        </button>
      </div>

      <div className="px-4 mt-auto space-y-1 pb-6">
        <Link
          to="/settings"
          className={`cursor-pointer active:translate-x-1 flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
            location.pathname === "/settings"
              ? "bg-sky-400/10 text-sky-400 border-r-2 border-sky-400 shadow-[inset_-10px_0_15px_-10px_rgba(0,170,255,0.5)]"
              : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-space font-medium uppercase text-xs tracking-widest">Settings</span>
        </Link>
        <Link
          to="/"
          className="cursor-pointer active:translate-x-1 flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-space font-medium uppercase text-xs tracking-widest">Logout</span>
        </Link>
      </div>
    </aside>
  );
}

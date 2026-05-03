import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/api/api";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@mhgaming.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 cyber-grid z-0 opacity-40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-[#050818] via-surface-container-lowest to-[#0a0e2e] z-[-1]"></div>
      <main className="relative z-10 w-full max-w-[440px] px-6">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-primary">shield</span>
              <span
                className="material-symbols-outlined absolute text-3xl text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                swords
              </span>
            </div>
          </div>
          <h1 className="font-space text-[32px] font-bold text-on-surface tracking-widest uppercase mb-2">
            MH GAMING TELUGU
          </h1>
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-primary/40"></div>
            <span className="font-space text-xs text-primary uppercase tracking-[0.3em] font-semibold">
              ADMIN PORTAL
            </span>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-primary/40"></div>
          </div>
        </div>
        <div className="bg-surface-container/60 backdrop-blur-xl border border-primary/20 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded text-sm text-center">{error}</div>}
          <form
            className="space-y-6"
            onSubmit={handleLogin}
          >
            <div className="space-y-2">
              <label className="font-space text-xs text-outline uppercase block ml-1 font-semibold tracking-widest">
                Command Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                </div>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-space text-xs text-outline uppercase font-semibold tracking-widest">
                  Access Key
                </label>
                <a className="text-[10px] font-space text-primary hover:text-secondary-fixed transition-colors font-semibold tracking-widest" href="#">
                  FORGOT KEY?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                </div>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-space text-2xl font-semibold uppercase py-4 rounded-lg shadow-[0_0_20px_rgba(0,170,255,0.3)] hover:shadow-[0_0_30px_rgba(0,170,255,0.5)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              type="submit"
            >
              LOGIN
              <span className="material-symbols-outlined text-on-primary-container group-hover:translate-x-1 transition-transform">
                login
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

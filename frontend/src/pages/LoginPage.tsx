import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/api/api';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login({ 
        identifier: formData.identifier, 
        password: formData.password 
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success("Welcome back, Commander!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#020617] wings-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 md:mb-10">
          <Link to="/" className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase font-h1 leading-tight">
            MH GAMING TELUGU
          </Link>
          <p className="text-primary font-label-caps tracking-[0.2em] mt-3 md:mt-4 uppercase text-[9px] md:text-xs opacity-80">Access Communications Link</p>
        </div>

        <div className="glass-card bg-[#0a0e2e]/60 border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,170,255,0.1)] p-6 md:p-8">
          <h2 className="font-h1 text-xl md:text-2xl text-white uppercase tracking-[0.2em] mb-6 md:mb-8 text-center">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Email or Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">contact_mail</span>
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 md:py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all font-space text-[13px] md:text-sm"
                  placeholder="Enter Email or Phone"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Access Code</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">lock</span>
                <input 
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 md:py-3 pl-10 pr-4 text-white focus:border-primary outline-none transition-all font-space text-[13px] md:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] disabled:opacity-50 uppercase tracking-[0.2em] transition-all text-xs md:text-sm"
            >
              {loading ? "ESTABLISHING LINK..." : 'LOGIN NOW'}
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-space">
                Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">New Recruit</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

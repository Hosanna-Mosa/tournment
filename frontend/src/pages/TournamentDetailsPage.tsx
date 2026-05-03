import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournamentById, registerForTournament, getMyTeam, updateMyTeam, getProfile, updateProfile, updatePayoutInfo } from '@/api/api';
import { toast } from 'sonner';

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // Check login status
  const isLoggedIn = !!localStorage.getItem('token');

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    players: Array(8).fill({ username: '', gameId: '' }),
    utrNumber: ''
  });

  const fetchData = async () => {
    try {
      if (!id) return;
      const { data } = await getTournamentById(id);
      setTournament(data);

      if (isLoggedIn) {
        const [teamRes, profileRes] = await Promise.all([
          getMyTeam(id),
          getProfile()
        ]);
        
        const myTeam = teamRes.data;
        const profile = profileRes.data;
        
        setUserTeam(myTeam);

        // Auto-fill logic
        if (myTeam) {
          setFormData({
            teamName: myTeam.teamName,
            players: myTeam.players.length >= 8 ? myTeam.players : [...myTeam.players, ...Array(8 - myTeam.players.length).fill({ username: '', gameId: '' })],
            utrNumber: myTeam.utrNumber || ''
          });
        } else if (profile?.savedTeam) {
          setFormData({
            teamName: profile.savedTeam.teamName,
            players: profile.savedTeam.players.length >= 8 ? profile.savedTeam.players : [...profile.savedTeam.players, ...Array(8 - profile.savedTeam.players.length).fill({ username: '', gameId: '' })],
            utrNumber: ''
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutSubmit = async () => {
    try {
      setSubmittingPayout(true);
      await updatePayoutInfo(id!, { upiId });
      toast.success("UPI ID submitted successfully!");
      fetchData(); // Refresh to show status
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit payout info");
    } finally {
      setSubmittingPayout(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, isLoggedIn]);

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (userTeam) {
      toast.error("You have already registered for this tournament");
    } else {
      setIsEditing(false);
      setShowModal(true);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setRegistrationStep(1);
    setShowModal(true);
  };

  const handlePlayerChange = (index: number, field: string, value: string) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setFormData({ ...formData, players: newPlayers });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamName) return toast.error("Team Name is required");
    const validPlayers = formData.players.filter(p => p.username && p.gameId);
    if (validPlayers.length < 1) return toast.error("At least one player is required");
    setRegistrationStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!isEditing && !formData.utrNumber) return toast.error("UTR Number is required for verification");

    // Format Validation: 12 digits
    if (!isEditing) {
      const utrRegex = /^\d{12}$/;
      if (!utrRegex.test(formData.utrNumber)) {
        return toast.error("Invalid UTR number. It must be exactly 12 digits (numbers only).");
      }
    }

    setRegistering(true);
    try {
      const payload = {
        teamName: formData.teamName,
        players: formData.players.filter(p => p.username && p.gameId),
        utrNumber: formData.utrNumber
      };

      if (isEditing) {
        await updateMyTeam(id, payload);
        toast.success("Team details updated successfully!");
      } else {
        const { data } = await registerForTournament(id, payload);
        toast.success(data.message);
      }

      // Save to profile if checked
      if (saveToProfile) {
        await updateProfile({
          savedTeam: {
            teamName: formData.teamName,
            players: formData.players.filter(p => p.username && p.gameId)
          }
        });
      }
      
      setShowModal(false);
      setRegistrationStep(1);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setRegistering(false);
    }
  };

const TournamentDetailSkeleton = () => (
    <div className="min-h-screen bg-[#020617] animate-pulse">
      <div className="h-[250px] md:h-[420px] bg-slate-900 w-full" />
      <div className="px-4 md:px-6 max-w-7xl mx-auto -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 md:h-20 bg-slate-900 rounded-xl border border-white/5" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-slate-900 rounded-xl border border-white/5" />
            <div className="h-40 bg-slate-900 rounded-xl border border-white/5" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-slate-900 rounded-xl border border-white/5" />
          <div className="h-40 bg-slate-900 rounded-xl border border-white/5" />
        </div>
      </div>
    </div>
  );

  if (loading) return <TournamentDetailSkeleton />;

  if (!tournament) return (
    <div className="min-h-screen flex items-center justify-center text-white">Tournament not found</div>
  );

  const stats = [
    { icon: "sports_esports", label: "GAME", val: tournament.game || "Free Fire" },
    { icon: "groups", label: "MODE", val: tournament.type },
    { icon: "payments", label: "ENTRY", val: `₹${tournament.entryFee}` },
    { icon: "emoji_events", label: "WINNER", val: `₹${tournament.prizePool}` },
  ];

  return (
    <main className="min-h-screen pb-32 bg-[#020617]">
      <section className="relative h-[150px] sm:h-[200px] md:h-[300px] flex items-end overflow-hidden bg-slate-900/50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        </div>
        <div className="relative z-10 px-4 md:px-6 max-w-7xl mx-auto w-full pb-6 md:pb-8">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <span className="flex items-center gap-1.5 md:gap-2 bg-primary/20 border border-primary/40 text-primary px-2 md:px-3 py-0.5 md:py-1 rounded-full font-label-caps text-[8px] md:text-[10px]">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full animate-pulse"></span> {tournament.status}
            </span>
            <span className="font-label-caps text-slate-400 uppercase tracking-widest text-[8px] md:text-[9px]">{tournament.game} • SEASON 1</span>
          </div>
          <h1 className="font-h1 text-white text-xl sm:text-2xl md:text-4xl uppercase tracking-tighter leading-tight">{tournament.title}</h1>
        </div>
      </section>

      <section className="px-4 md:px-6 max-w-7xl mx-auto -mt-6 md:-mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((item, i) => (
              <div key={i} className="glass-card p-3 md:p-4 rounded-xl flex items-center gap-2 md:gap-3 border border-white/5">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">{item.icon}</span>
                <div>
                  <p className="text-[8px] md:text-[10px] font-label-caps text-slate-500 uppercase tracking-widest">{item.label}</p>
                  <p className="text-white font-bold text-xs md:text-sm">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prize Payout Section */}
          {tournament.status === 'COMPLETED' && (tournament.winnerTeam === userTeam?._id || tournament.runnerUpTeam === userTeam?._id) && (
            <div className="glass-card p-5 md:p-6 rounded-xl border border-primary/20 bg-primary/5 mb-8">
              <h3 className="font-h3 text-white mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                <span className="material-symbols-outlined text-primary text-xl">payments</span> PRIZE PAYOUT
              </h3>
              
              <div className="space-y-4">
                <p className="text-slate-400 text-xs md:text-sm">
                  Congratulations! Please enter your UPI ID to receive your prize money.
                </p>

                {((tournament.winnerTeam === userTeam?._id ? tournament.winnerPayoutStatus : tournament.runnerUpPayoutStatus) === 'PENDING') ? (
                  <div className="space-y-4">
                    {(tournament.winnerTeam === userTeam?._id ? tournament.winnerUpiId : tournament.runnerUpUpiId) ? (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                          <span className="text-[10px] font-label-caps uppercase tracking-widest">PENDING VERIFICATION</span>
                        </div>
                        <p className="text-white text-xs md:text-sm">
                          Submitted UPI ID: <span className="text-primary font-bold">{(tournament.winnerTeam === userTeam?._id ? tournament.winnerUpiId : tournament.runnerUpUpiId)}</span>
                        </p>
                        <p className="text-slate-400 text-[10px] italic leading-relaxed">
                          Admin is processing your payment. It will be credited within 24-48 hours.
                        </p>
                        <div className="pt-2">
                          <button 
                            onClick={() => setUpiId((tournament.winnerTeam === userTeam?._id ? tournament.winnerUpiId : tournament.runnerUpUpiId) || '')}
                            className="text-primary text-[10px] underline uppercase tracking-[0.2em]"
                          >
                            Change UPI ID
                          </button>
                        </div>
                        {upiId && upiId !== (tournament.winnerTeam === userTeam?._id ? tournament.winnerUpiId : tournament.runnerUpUpiId) && (
                          <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all text-sm mb-3"
                              placeholder="Enter New UPI ID"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                            <button 
                              onClick={handlePayoutSubmit}
                              disabled={submittingPayout}
                              className="w-full bg-primary text-[#001d31] font-label-caps tracking-widest uppercase text-[10px] py-3 rounded-lg hover:shadow-[0_0_15px_rgba(0,170,255,0.4)] transition-all"
                            >
                              {submittingPayout ? "UPDATING..." : "UPDATE UPI ID"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all text-sm"
                          placeholder="Enter UPI ID (e.g. name@upi)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <button 
                          onClick={handlePayoutSubmit}
                          disabled={submittingPayout || !upiId}
                          className="w-full bg-primary text-[#001d31] font-label-caps tracking-widest uppercase text-[10px] py-3 rounded-lg hover:shadow-[0_0_15px_rgba(0,170,255,0.4)] transition-all"
                        >
                          {submittingPayout ? "SUBMITTING..." : "SUBMIT UPI ID"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="text-[10px] font-label-caps uppercase tracking-widest">PAID</span>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Transaction Reference / UTR</p>
                      <p className="text-white font-mono text-sm tracking-widest bg-white/5 p-2 rounded border border-white/5">
                        {(tournament.winnerTeam === userTeam?._id ? tournament.winnerPayoutRef : tournament.runnerUpPayoutRef) || 'REF-XXXXXXXX'}
                      </p>
                    </div>
                    <p className="text-slate-400 text-[10px] italic">
                      The prize amount has been successfully transferred to your account.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="glass-card p-5 md:p-6 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-h3 text-white mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                <span className="material-symbols-outlined text-primary text-xl">gavel</span> RULES
              </h3>
              <ul className="space-y-2 md:space-y-3 text-slate-400 text-[11px] md:text-sm">
                {tournament.rules && tournament.rules.length > 0 ? (
                  tournament.rules.map((rule: string, i: number) => <li key={i}>• {rule}</li>)
                ) : (
                  <>
                    <li>• Level 40+ IDs required.</li>
                    <li>• Emulators strictly prohibited.</li>
                    <li>• Standard map rotation apply.</li>
                    <li>• POV recording mandatory for all matches.</li>
                  </>
                )}
              </ul>
            </div>
            <div className="glass-card p-5 md:p-6 rounded-xl border border-white/5 bg-white/[0.02]">
              <h3 className="font-h3 text-white mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                <span className="material-symbols-outlined text-primary text-xl">stadium</span> REGISTRATION PROGRESS
              </h3>
              <div>
                <div className="flex justify-between text-xs md:text-sm mb-2 md:mb-3">
                  <span className="text-slate-400 font-space">{tournament.filledSlots} Teams Registered</span>
                </div>
                <div className="h-2.5 md:h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-sky-400 shadow-[0_0_15px_rgba(0,170,255,0.5)]" style={{ width: `${Math.min((tournament.filledSlots / 8) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[9px] md:text-[10px] text-slate-500 mt-3 md:mt-4 italic">Next batch starts at 8, 16, or 24 teams.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="glass-card p-5 md:p-6 rounded-xl text-center border border-primary/20 bg-primary/5">
            <p className="font-label-caps text-primary uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-3 md:mb-4">REGISTRATION STATUS</p>
            <div className="py-2 md:py-4">
              <span className="text-2xl md:text-3xl font-h1 text-white uppercase tracking-widest">OPEN</span>
            </div>
            <button 
              onClick={() => navigate(`/tournament/${tournament._id}/bracket`)}
              className="mt-3 md:mt-4 w-full text-[10px] md:text-xs text-slate-400 hover:text-white transition-colors underline uppercase tracking-widest font-space"
            >
              View Live Brackets
            </button>
          </div>
          
          <div className="glass-card p-5 md:p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <h3 className="font-h3 text-white mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
              <span className="material-symbols-outlined text-primary text-xl">military_tech</span> PRIZE BREAKDOWN
            </h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center p-2.5 md:p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <span className="text-slate-300 text-[11px] md:text-sm font-medium">Winner</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">₹{tournament.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 md:p-3 bg-slate-400/10 rounded-lg border border-slate-400/30">
                <span className="text-slate-300 text-[11px] md:text-sm font-medium">Runner Up</span>
                <span className="text-slate-300 font-bold text-sm md:text-base">₹{(tournament.runnerUpPrize || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card w-full max-w-2xl bg-[#0a0e2e] border border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,170,255,0.2)]">
            <div className="bg-primary/10 px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-h2 text-white uppercase tracking-widest">
                {isEditing ? "Edit Team Details" : registrationStep === 1 ? "Step 1: Team Registration" : "Step 2: Payment Verification"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {registrationStep === 1 ? (
                <form onSubmit={(e) => { e.preventDefault(); if (isEditing) handleRegister(e); else handleNextStep(e); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Team Name</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all"
                      placeholder="Enter your team name"
                      value={formData.teamName}
                      onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Player Details (Team of 8)</label>
                    {formData.players.map((player, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 uppercase">Player {index + 1} Name</p>
                          <input 
                            className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-white focus:border-primary outline-none"
                            placeholder="Username"
                            value={player.username}
                            onChange={(e) => handlePlayerChange(index, 'username', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 uppercase">Player {index + 1} Game ID</p>
                          <input 
                            className="w-full bg-transparent border-b border-white/10 p-1 text-xs text-white focus:border-primary outline-none"
                            placeholder="Game ID (e.g. 5234234)"
                            value={player.gameId}
                            onChange={(e) => handlePlayerChange(index, 'gameId', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isEditing && (
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${saveToProfile ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary'}`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={saveToProfile}
                          onChange={(e) => setSaveToProfile(e.target.checked)}
                        />
                        {saveToProfile && <span className="material-symbols-outlined text-white text-sm">check</span>}
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Save team details to my profile for future tournaments</span>
                    </label>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] uppercase tracking-widest transition-all"
                  >
                    {isEditing ? (registering ? "Saving..." : "Update Team Details") : "Proceed to Payment"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-slate-400 text-sm">Use the UPI ID below to pay the entry fee of <span className="text-white font-bold">₹{tournament.entryFee}</span>.</p>
                    
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl inline-flex items-center gap-3">
                      <p className="text-sky-400 font-mono text-sm">mhgaming@upi</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("mhgaming@upi");
                          toast.success("UPI ID copied!");
                        }}
                        className="text-slate-500 hover:text-white"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Transaction UTR Number</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all font-mono"
                      placeholder="Enter 12-digit UTR Number"
                      value={formData.utrNumber}
                      onChange={(e) => setFormData({...formData, utrNumber: e.target.value})}
                    />
                    <p className="text-[9px] text-slate-500 italic">Enter the reference number from your payment receipt.</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setRegistrationStep(1)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={registering}
                      className="w-2/3 bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] disabled:opacity-50 uppercase tracking-widest transition-all"
                    >
                      {registering ? "Submitting..." : "Submit Registration"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom CTA / Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#020617]/90 backdrop-blur-md border-t border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
          {!userTeam ? (
            tournament.status === 'UPCOMING' && (
              <button 
                onClick={handleRegisterClick}
                className="bg-primary hover:bg-primary/80 text-white font-bold text-sm px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(0,170,255,0.3)] hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                Register Your Team
              </button>
            )
          ) : (
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-space">Registered Team</p>
                <p className="text-white font-bold font-h2 text-xl">{userTeam.teamName}</p>
                {tournament.status === 'UPCOMING' && (
                  <button 
                    onClick={handleEditClick}
                    className="mt-1 text-[10px] uppercase font-bold text-primary hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                    Edit Team Details
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex justify-center">
                {/* WAITING_VERIFICATION Status */}
                {userTeam.status === 'WAITING_VERIFICATION' && (
                  <div className="px-6 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-blue-500/10 text-blue-400 border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm animate-pulse">account_balance_wallet</span>
                      <span className="text-xs">Payment Verification Pending</span>
                    </div>
                  </div>
                )}

                {/* REJECTED / Reset Status */}
                {userTeam.status === 'REJECTED' && (
                  <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-red-500/10 text-red-500 border-red-500/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">error</span>
                      <span className="text-sm">Registration Rejected</span>
                    </div>
                    <button 
                      onClick={() => {
                        setUserTeam(null);
                        setShowModal(true);
                      }}
                      className="text-[9px] uppercase font-bold text-sky-400 underline"
                    >
                      Resubmit Registration
                    </button>
                  </div>
                )}

                {/* PENDING Status */}
                {userTeam.status === 'PENDING' && (
                  <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm animate-spin">hourglass_empty</span>
                      <span className="text-sm">Waiting for Approval</span>
                    </div>
                  </div>
                )}

                {/* APPROVED Status */}
                {userTeam.status === 'APPROVED' && !userTeam.batchSN && (
                  <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-green-500/10 text-green-500 border-green-500/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span className="text-sm">Team Approved</span>
                    </div>
                  </div>
                )}

                {/* Batch Assigned */}
                {userTeam.batchSN && (
                  <div className={`px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border ${
                    userTeam.isEliminated ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'
                  }`}>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm">{userTeam.isEliminated ? 'cancel' : 'task_alt'}</span>
                      <span>{userTeam.isEliminated ? 'Eliminated' : `Registered - ${userTeam.batchSN}`}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:block w-48"></div> {/* Spacer to balance layout */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TournamentDetailsPage;

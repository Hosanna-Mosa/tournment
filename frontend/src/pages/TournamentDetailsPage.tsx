import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournamentById, registerForTournament, getMyTeam, updateMyTeam, getProfile, updateProfile, updatePayoutInfo, getReviews, getSettings } from '@/api/api';
import { toast } from 'sonner';

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Demo States
  const isDemo = id === 'dummy-id';
  const [demoStatus, setDemoStatus] = useState<'REGISTER_NOW' | 'APPROVED' | 'PROBLEM' | 'BADGE'>('REGISTER_NOW');

  // Check login status
  const isLoggedIn = !!localStorage.getItem('token');

  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    players: Array(5).fill({ username: '', gameId: '' }),
    utrNumber: ''
  });

  const fetchData = async () => {
    try {
      if (!id) return;

      if (isDemo) {
        // Fetch demo reviews and settings too
        const [rRes, sRes] = await Promise.all([
          getReviews(),
          getSettings().catch(() => ({ data: null }))
        ]);
        setReviews(rRes.data.data);
        setSettings(sRes.data);

        setTournament({
          _id: 'dummy-id',
          title: 'DEMO TOURNAMENT (FRONTEND ONLY)',
          type: 'SQUAD',
          game: 'Free Fire',
          prizePool: 5000,
          entryFee: 50,
          totalSlots: 48,
          filledSlots: 12,
          status: 'UPCOMING',
          rules: ["Demo Rule 1", "Demo Rule 2"]
        });
        if (demoStatus !== 'REGISTER_NOW') {
          setUserTeam({
            teamName: formData.teamName || 'DEMO TEAM',
            status: demoStatus === 'APPROVED' ? 'APPROVED' : demoStatus === 'PROBLEM' ? 'WAITING_PROBLEM' : 'WAITING_BADGE'
          });
        } else {
          setUserTeam(null);
        }
        setLoading(false);
        return;
      }

      const [tRes, rRes, sRes] = await Promise.all([
        getTournamentById(id),
        getReviews(),
        getSettings().catch(() => ({ data: null }))
      ]);

      setTournament(tRes.data);
      setReviews(rRes.data.data);
      setSettings(sRes.data);

      if (isLoggedIn) {
        const [teamRes, profileRes] = await Promise.all([
          getMyTeam(id),
          getProfile()
        ]);
        
        const myTeam = teamRes.data;
        const currentProfile = profileRes.data;
        
        setUserTeam(myTeam);
        setProfile(currentProfile);

        // Auto-fill logic
        if (myTeam) {
          setFormData({
            teamName: myTeam.teamName,
            players: myTeam.players.length >= 5 ? myTeam.players : [...myTeam.players, ...Array(5 - myTeam.players.length).fill({ username: '', gameId: '' })],
            utrNumber: myTeam.utrNumber || ''
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSavedTeam = () => {
    if (profile?.savedTeam) {
      setFormData({
        ...formData,
        teamName: profile.savedTeam.teamName,
        players: profile.savedTeam.players.length >= 5 
          ? profile.savedTeam.players 
          : [...profile.savedTeam.players, ...Array(5 - profile.savedTeam.players.length).fill({ username: '', gameId: '' })],
      });
      toast.success("Saved team loaded!");
    } else {
      toast.error("No saved team found in your profile.");
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
    window.scrollTo(0, 0);
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
      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDemoStatus('APPROVED');
        setShowModal(false);
        setRegistrationStep(1);
        toast.success("Registration Approved (Demo Mode)");
        fetchData();
        return;
      }

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

  const [showAllRules, setShowAllRules] = useState(false);

  const defaultRules = [
    "Level 40+ IDs required.",
    "Emulators strictly prohibited.",
    "Standard map rotation apply.",
    "POV recording mandatory for all matches.",
    "No hacking or use of third-party tools.",
    "All team members must be present 15 mins before match.",
    "Internet issues are at the player's own risk.",
    "Organizers decision is final and binding.",
    "Teaming with other teams results in immediate disqualification.",
    "Proper screenshots must be provided after match completion.",
    "No abusive language in the lobby or match.",
    "Respect all fellow competitors.",
    "Prize pool will be distributed within 48 hours.",
    "Matches will be played on Bermuda and Purgatory."
  ];

  if (loading) return <TournamentDetailSkeleton />;

  if (!tournament) return (
    <div className="min-h-screen flex items-center justify-center text-white">Tournament not found</div>
  );

  const stats = [
    { icon: "sports_esports", label: "GAME", val: tournament.game || "Free Fire" },
    { icon: "groups", label: "MODE", val: tournament.type },
    { icon: "payments", label: "ENTRY", val: `₹${tournament.entryFee}` },
    { icon: "emoji_events", label: "WINNER", val: `₹${tournament.prizePool}` },
    { icon: "calendar_month", label: "DATE", val: tournament.startDate || "TBA" },
    { icon: "schedule", label: "TIME", val: tournament.startTime || "TBA" },
  ];

  const rulesToShow = (settings?.rules && settings.rules.length > 0) ? settings.rules : defaultRules;
  const displayedRules = showAllRules ? rulesToShow : rulesToShow.slice(0, 4);



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
            <div className="glass-card p-5 md:p-6 rounded-xl border border-white/5 bg-white/[0.02] relative">
              <h3 className="font-h3 text-white mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                <span className="material-symbols-outlined text-primary text-xl">gavel</span> RULES
              </h3>
              <ul className="space-y-2 md:space-y-3 text-slate-400 text-[11px] md:text-sm">
                {displayedRules.map((rule: string, i: number) => (
                  <li key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">• {rule}</li>
                ))}
              </ul>
              
              {rulesToShow.length > 4 && (
                <div className="mt-4 flex">
                  {!showAllRules ? (
                    <button 
                      onClick={() => setShowAllRules(true)}
                      className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Read More <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAllRules(false)}
                      className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Close <span className="material-symbols-outlined text-sm">expand_less</span>
                    </button>
                  )}
                </div>
              )}
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
              <h2 className="font-h2 text-white uppercase tracking-widest text-sm md:text-base">
                {isEditing ? "Edit Team Details" : registrationStep === 1 ? "Fill in the details" : "Step 2: Payment Verification"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {registrationStep === 1 ? (
                <form onSubmit={(e) => { e.preventDefault(); if (isEditing) handleRegister(e); else handleNextStep(e); }} className="space-y-6">
                  {profile?.savedTeam && !isEditing && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">groups</span>
                        <div>
                          <p className="text-[10px] text-primary uppercase font-bold">Saved Team Found</p>
                          <p className="text-white text-xs font-bold">{profile.savedTeam.teamName}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={handleLoadSavedTeam}
                        className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                      >
                        Load Team
                      </button>
                    </div>
                  )}

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
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-label-caps text-primary uppercase tracking-[0.2em]">Player Details (Team of 5)</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newPlayers = Array(5).fill({ username: '', gameId: '' });
                          setFormData({...formData, players: newPlayers});
                        }}
                        className="text-[9px] text-slate-500 hover:text-white uppercase"
                      >
                        Clear All
                      </button>
                    </div>
                    {formData.players.slice(0, 5).map((player, index) => (
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
                      <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Save team details to my profile</span>
                    </label>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 md:py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] uppercase tracking-widest transition-all text-xs md:text-sm"
                  >
                    {isEditing ? (registering ? "Saving..." : "Update Team Details") : "Next, Proceed to Play"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="text-center space-y-4">
                    <p className="text-slate-400 text-xs">Scan the QR code or use the UPI ID to pay <span className="text-white font-bold text-sm">₹{tournament.entryFee}</span></p>
                    
                    {/* QR Code Display */}
                    <div className="relative mx-auto w-48 h-48 bg-white p-2 rounded-xl shadow-2xl">
                      {settings?.qrCodeUrl ? (
                        <img 
                          src={settings.qrCodeUrl} 
                          alt="Payment QR Code" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                          <span className="material-symbols-outlined text-4xl mb-2">qr_code_2</span>
                          <span className="text-[10px] font-bold uppercase">QR Code Pending</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl inline-flex items-center gap-3">
                      <p className="text-sky-400 font-mono text-xs">{settings?.upiId || "mhgaming@upi"}</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(settings?.upiId || "mhgaming@upi");
                          toast.success("UPI ID copied!");
                        }}
                        className="text-slate-500 hover:text-white flex p-1"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-label-caps text-primary uppercase tracking-[0.2em]">Transaction UTR Number</label>
                    <input 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-all font-mono text-sm"
                      placeholder="Enter 12-digit UTR Number"
                      value={formData.utrNumber}
                      onChange={(e) => setFormData({...formData, utrNumber: e.target.value})}
                    />
                    <p className="text-[8px] text-slate-500 italic">Verify your 12-digit UTR number from payment receipt.</p>
                  </div>

                  <div className="flex gap-3 max-w-sm mx-auto">
                    <button 
                      type="button"
                      onClick={() => setRegistrationStep(1)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-all text-[10px]"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={registering}
                      className="flex-[2] bg-primary hover:bg-primary/80 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.4)] disabled:opacity-50 uppercase tracking-widest transition-all text-[10px]"
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
                Register Now
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
                {userTeam.status === 'APPROVED' && userTeam.currentMatch?.isRoomReleased ? (
                  /* Room ID & Password Display - Exclusive Mode */
                  <div className="flex flex-col md:flex-row gap-3 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-900 border border-primary/40 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,170,255,0.2)]">
                      <p className="text-[8px] text-primary uppercase font-bold tracking-widest mb-0.5">Room ID</p>
                      <p className="text-white font-mono font-bold text-sm tracking-widest">{userTeam.currentMatch.roomId || "PENDING"}</p>
                    </div>
                    <div className="bg-slate-900 border border-primary/40 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,170,255,0.2)]">
                      <p className="text-[8px] text-primary uppercase font-bold tracking-widest mb-0.5">Password</p>
                          <p className="text-white font-mono font-bold text-sm tracking-widest">{userTeam.currentMatch.roomPassword || "PENDING"}</p>
                    </div>
                  </div>
                ) : (
                  /* Other Status Badges */
                  <>
                    {/* WINNER Status */}
                    {tournament.winnerTeam === userTeam._id && (
                      <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.3)] border bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-xl">emoji_events</span>
                          <span className="text-sm font-bold">Tournament Winner</span>
                        </div>
                      </div>
                    )}

                    {/* RUNNER UP Status */}
                    {tournament.runnerUpTeam === userTeam._id && (
                      <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-slate-400/10 text-slate-300 border-slate-400/30">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">military_tech</span>
                          <span className="text-sm font-bold">Runner Up</span>
                        </div>
                      </div>
                    )}

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

                    {/* APPROVED Status Logic */}
                    {(userTeam.status === 'APPROVED' || demoStatus === 'APPROVED') && (
                      <>
                        {!userTeam.batchSN ? (
                          // CASE: Approved but NOT assigned to a batch (On Hold or Eliminated)
                          <div className={`px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border ${
                            tournament.status === 'LIVE' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          }`}>
                            <div className="flex items-center gap-2 text-center">
                              <span className="material-symbols-outlined text-sm">
                                {tournament.status === 'LIVE' ? 'cancel' : 'pause_circle'}
                              </span>
                              <span className="text-xs md:text-sm">
                                {tournament.status === 'LIVE' 
                                  ? (
                                    <div className="flex flex-col items-center gap-3 w-full">
                                      <p className="text-xs md:text-sm text-center">Tournament Started! Not assigned to any batch. Team eliminated. Refund will be processed.</p>
                                      
                                      {/* REFUND WORKFLOW */}
                                      {userTeam.refundStatus === 'none' && (
                                        <div className="flex flex-col gap-2 w-full max-w-xs animate-in slide-in-from-top duration-300">
                                          <input 
                                            type="text" 
                                            id="refund-upi"
                                            placeholder="Enter UPI ID for Refund"
                                            className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
                                          />
                                          <button 
                                            onClick={async () => {
                                              const upi = (document.getElementById('refund-upi') as HTMLInputElement).value;
                                              if (!upi) return toast.error("Please enter your UPI ID");
                                              try {
                                                const { updateRefundUPI } = await import('@/api/api');
                                                await updateRefundUPI(tournament._id, upi);
                                                toast.success("UPI Submitted successfully!");
                                                fetchData();
                                              } catch (err) {
                                                toast.error("Failed to submit UPI");
                                              }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-1.5 rounded uppercase tracking-widest transition-all"
                                          >
                                            Submit UPI ID
                                          </button>
                                        </div>
                                      )}

                                      {userTeam.refundStatus === 'submitted' && (
                                        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-lg flex flex-col items-center gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-amber-500">pending</span>
                                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Refund Pending</p>
                                          </div>
                                          <p className="text-[9px] text-slate-400">UPI: {userTeam.refundUPI}</p>
                                        </div>
                                      )}

                                      {userTeam.refundStatus === 'completed' && (
                                        <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg flex flex-col items-center gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Refund Processed</p>
                                          </div>
                                          <p className="text-[9px] text-slate-400 font-mono">UTR: {userTeam.refundUTR}</p>
                                        </div>
                                      )}
                                    </div>
                                  ) 
                                  : userTeam.batchSN
                                    ? `Success! Assigned to Batch ${userTeam.batchSN}. Wait for tournament start.` 
                                    : `Approved! On hold for next batch update. Please wait for the tournament to start.`}
                              </span>
                            </div>
                          </div>
                        ) : (
                          // CASE: Approved and HAS a batch
                          <>
                            {tournament.status !== 'LIVE' ? (
                              // Tournament not live yet - show "Assigned to Batch"
                              <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-green-500/10 text-green-500 border-green-500/30">
                                <div className="flex items-center gap-2 text-center">
                                  <span className="material-symbols-outlined text-sm">verified</span>
                                  <span className="text-xs md:text-sm">Paid! Assigned to {userTeam.batchSN}. Wait until tournament start.</span>
                                </div>
                              </div>
                            ) : (
                              // Tournament is LIVE - show Match/Elimination/Qualification status
                              tournament.winnerTeam !== userTeam._id && tournament.runnerUpTeam !== userTeam._id && (
                                <div className={`px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border ${
                                  userTeam.isEliminated ? 'bg-red-500/10 text-red-500 border-red-500/30' : 
                                  !userTeam.currentMatch ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                  'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                }`}>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined text-sm">
                                      {userTeam.isEliminated ? 'cancel' : !userTeam.currentMatch ? 'military_tech' : 'notification_important'}
                                    </span>
                                    <span className="text-center">
                                      {userTeam.isEliminated ? 'Eliminated' : 
                                       !userTeam.currentMatch ? 'Qualified! Wait for next round wait for update' :
                                       (userTeam.currentMatch?.isFinal ? 'Grand Finals Started. Wait for Room ID & Password' : 
                                       `Round ${userTeam.currentMatch?.round || ''} Started. Wait for Room ID & Password`)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* DEMO SPECIFIC STATUSES (Problem/Badge) */}
                    {isDemo && demoStatus === 'PROBLEM' && (
                      <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-amber-500/10 text-amber-500 border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">warning</span>
                          <span className="text-sm">Waiting for a problem</span>
                        </div>
                      </div>
                    )}

                    {isDemo && demoStatus === 'BADGE' && (
                      <div className="px-8 py-2 rounded-lg font-h2 flex flex-col items-center gap-0 uppercase tracking-wider shadow-lg border bg-purple-500/10 text-purple-500 border-purple-500/30">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">stars</span>
                          <span className="text-sm">Waiting for badge</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isDemo && (
                  <button 
                    onClick={() => {
                      if (demoStatus === 'APPROVED') setDemoStatus('PROBLEM');
                      else if (demoStatus === 'PROBLEM') setDemoStatus('BADGE');
                      else if (demoStatus === 'BADGE') setDemoStatus('APPROVED');
                      fetchData();
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all border border-white/10"
                  >
                    <span className="material-symbols-outlined text-xs">sync</span>
                    Cycle Demo Status
                  </button>
                )}
                <a 
                  href="https://wa.me/919398334115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TournamentDetailsPage;

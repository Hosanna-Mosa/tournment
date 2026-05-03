import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useEffect, useState } from "react";
import { getAdminReviews, createReview, updateReview, deleteReview, getSettings, updateSettings } from "@/api/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [paymentSettings, setPaymentSettings] = useState({
    upiId: '',
    qrCodeUrl: '',
    whatsappNumber: '',
    liveStreamUrl: '',
    howToRegisterUrl: '',
    rules: [] as string[]
  });
  
  const [formData, setFormData] = useState({
    username: '',
    rating: 5,
    comment: '',
    isPublic: true
  });

  const fetchData = async () => {
    try {
      const [reviewsRes, settingsRes] = await Promise.all([
        getAdminReviews(),
        getSettings().catch(() => ({ data: { upiId: 'mhgaming@upi', qrCodeUrl: '', whatsappNumber: '', liveStreamUrl: '', howToRegisterUrl: '' } }))
      ]);
      setReviews(reviewsRes.data.data || []);
      if (settingsRes.data) {
        setPaymentSettings({
          upiId: settingsRes.data.upiId || '',
          qrCodeUrl: settingsRes.data.qrCodeUrl || '',
          whatsappNumber: settingsRes.data.whatsappNumber || '',
          liveStreamUrl: settingsRes.data.liveStreamUrl || '',
          howToRegisterUrl: settingsRes.data.howToRegisterUrl || '',
          rules: settingsRes.data.rules || []
        });
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async () => {
    try {
      await updateSettings(paymentSettings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview(editingReview._id, formData);
        toast.success("Review updated successfully");
      } else {
        await createReview(formData);
        toast.success("Review added successfully");
      }
      setShowModal(false);
      setEditingReview(null);
      setFormData({ username: '', rating: 5, comment: '', isPublic: true });
      fetchData();
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const openEditModal = (review: any) => {
    setEditingReview(review);
    setFormData({
      username: review.username,
      rating: review.rating,
      comment: review.comment,
      isPublic: review.isPublic
    });
    setShowModal(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <TopBar title="SETTINGS" />
      <main className="ml-[280px] pt-24 px-8 pb-12 min-h-screen bg-[#0a0e2e] w-full">
        <div className="max-w-6xl mx-auto">
          {/* Global Configuration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-sky-400 shadow-[0_0_10px_#00aaff]"></div>
                <h2 className="font-space text-2xl text-on-background uppercase tracking-tight font-semibold">
                  Global Configuration
                </h2>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">UPI ID for Payments</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-all text-sm font-mono"
                      value={paymentSettings.upiId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, upiId: e.target.value})}
                      placeholder="e.g. mhgaming@upi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">WhatsApp Support Number</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-all text-sm font-mono"
                      value={paymentSettings.whatsappNumber}
                      onChange={(e) => setPaymentSettings({...paymentSettings, whatsappNumber: e.target.value})}
                      placeholder="e.g. 919398334115"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Live Stream YouTube URL</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-all text-sm font-mono"
                      value={paymentSettings.liveStreamUrl}
                      onChange={(e) => setPaymentSettings({...paymentSettings, liveStreamUrl: e.target.value})}
                      placeholder="https://youtube.com/live/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Tutorial (How to Register) URL</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-all text-sm font-mono"
                      value={paymentSettings.howToRegisterUrl}
                      onChange={(e) => setPaymentSettings({...paymentSettings, howToRegisterUrl: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Payment QR Code (Direct URL)</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-sky-400 outline-none transition-all text-sm font-mono"
                    placeholder="https://example.com/qr-code.png"
                    value={paymentSettings.qrCodeUrl}
                    onChange={(e) => setPaymentSettings({...paymentSettings, qrCodeUrl: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-500 italic">Provide a direct link to your UPI QR Code image hosted online.</p>
                </div>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Global Tournament Rules (Applied to all matches)</label>
                  <div className="space-y-2">
                    {(paymentSettings.rules || []).map((rule: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-black/20 p-2.5 rounded-lg border border-white/5 group">
                        <p className="flex-1 text-xs text-slate-300">{rule}</p>
                        <button 
                          onClick={() => {
                            const newRules = [...paymentSettings.rules];
                            newRules.splice(idx, 1);
                            setPaymentSettings({...paymentSettings, rules: newRules});
                          }}
                          className="text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      id="new-global-rule"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white text-xs focus:border-sky-400 outline-none"
                      placeholder="Add a new global rule..."
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('new-global-rule') as HTMLInputElement;
                        if (!input.value) return;
                        setPaymentSettings({...paymentSettings, rules: [...(paymentSettings.rules || []), input.value]});
                        input.value = "";
                      }}
                      className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-6 py-2 rounded text-[10px] font-bold uppercase hover:bg-sky-500/20 transition-all"
                    >
                      Add Rule
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleUpdateSettings}
                  className="w-full bg-sky-400 text-[#0a0e2e] font-space font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-widest text-xs"
                >
                  Save Global Settings
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-sky-400 shadow-[0_0_10px_#00aaff]"></div>
                <h2 className="font-space text-2xl text-on-background uppercase tracking-tight font-semibold">
                  QR Preview
                </h2>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center min-h-[250px] relative overflow-hidden group">
                {paymentSettings.qrCodeUrl ? (
                  <img src={paymentSettings.qrCodeUrl} alt="Preview" className="max-w-[180px] rounded-xl shadow-2xl transition-transform group-hover:scale-105" />
                ) : (
                  <div className="text-center text-slate-500">
                    <span className="material-symbols-outlined text-5xl block mb-2 opacity-20">qr_code_2</span>
                    <p className="text-[10px] uppercase font-bold tracking-widest">No QR URL Provided</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-sky-400 shadow-[0_0_10px_#00aaff]"></div>
                <h2 className="font-space text-2xl text-on-background uppercase tracking-tight font-semibold">
                  Manage Player Reviews
                </h2>
              </div>
              <button 
                onClick={() => {
                  setEditingReview(null);
                  setFormData({ username: '', rating: 5, comment: '', isPublic: true });
                  setShowModal(true);
                }}
                className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-space font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add New Review
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-sky-400/10 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-space text-[10px] uppercase tracking-widest text-sky-400">Player</th>
                      <th className="px-6 py-4 font-space text-[10px] uppercase tracking-widest text-sky-400">Rating</th>
                      <th className="px-6 py-4 font-space text-[10px] uppercase tracking-widest text-sky-400">Comment</th>
                      <th className="px-6 py-4 font-space text-[10px] uppercase tracking-widest text-sky-400">Status</th>
                      <th className="px-6 py-4 font-space text-[10px] uppercase tracking-widest text-sky-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map((review) => (
                      <tr key={review._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-400/20 flex items-center justify-center text-sky-400 font-bold text-xs uppercase">
                              {review.username[0]}
                            </div>
                            <span className="text-white font-medium text-sm">{review.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'text-yellow-500' : 'text-slate-600'}`}>
                                star
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-slate-400 text-xs truncate">{review.comment}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${review.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {review.isPublic ? 'Public' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(review)}
                              className="p-2 hover:bg-sky-400/20 text-sky-400 rounded-lg transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(review._id)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <span className="material-symbols-outlined text-4xl text-slate-700 mb-2 block">rate_review</span>
                          <p className="text-slate-500 italic uppercase tracking-[0.2em] text-[10px]">No reviews found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative glass-card w-full max-w-md bg-[#0a0e2e] border border-sky-400/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,170,255,0.2)] animate-in zoom-in-95 duration-200">
              <div className="bg-sky-400/10 px-8 py-5 border-b border-white/5 flex justify-between items-center">
                <h2 className="font-orbitron text-white uppercase tracking-widest text-xs md:text-sm">
                  {editingReview ? "Edit Review" : "Add New Review"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Username</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-sky-400 outline-none transition-all text-sm"
                    placeholder="Enter player name"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Rating (1-5 Stars)</label>
                  <div className="flex gap-3 justify-center py-2 bg-white/5 rounded-xl border border-white/5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={`material-symbols-outlined text-3xl transition-all ${star <= formData.rating ? 'text-yellow-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        star
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-sky-400 uppercase tracking-[0.2em]">Comment</label>
                  <textarea 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-sky-400 outline-none transition-all text-sm h-32 resize-none"
                    placeholder="Enter what the player said about the platform..."
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.isPublic ? 'bg-sky-400 border-sky-400' : 'border-white/20'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    />
                    {formData.isPublic && <span className="material-symbols-outlined text-[#0a0e2e] text-sm font-bold">check</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest font-space font-bold">Make this review public</span>
                </label>

                <button 
                  type="submit"
                  className="w-full bg-sky-400 text-[#0a0e2e] font-space font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(0,170,255,0.4)] hover:shadow-[0_0_35px_rgba(0,170,255,0.6)] uppercase tracking-widest transition-all text-xs"
                >
                  {editingReview ? "Update Player Review" : "Add Player Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

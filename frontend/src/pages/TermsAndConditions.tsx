import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocExpanded, setIsTocExpanded] = useState(false);

  const sections = [
    { id: 'acceptance', title: '1. ACCEPTANCE OF TERMS' },
    { id: 'eligibility', title: '2. ELIGIBILITY' },
    { id: 'registration', title: '3. ACCOUNT REGISTRATION' },
    { id: 'tournament-reg', title: '4. TOURNAMENT REGISTRATION' },
    { id: 'fees', title: '5. ENTRY FEES & PAYMENTS' },
    { id: 'rules', title: '6. TOURNAMENT RULES' },
    { id: 'prizes', title: '7. PRIZE DISTRIBUTION' },
    { id: 'content', title: '8. CONTENT & LIVE STREAMING' },
    { id: 'conduct', title: '9. PROHIBITED CONDUCT' },
    { id: 'ip', title: '10. INTELLECTUAL PROPERTY' },
    { id: 'disclaimer', title: '11. DISCLAIMER OF WARRANTIES' },
    { id: 'liability', title: '12. LIMITATION OF LIABILITY' },
    { id: 'indemnity', title: '13. INDEMNIFICATION' },
    { id: 'law', title: '14. GOVERNING LAW' },
    { id: 'changes', title: '15. CHANGES TO TERMS' },
    { id: 'grievance', title: '16. CONTACT & GRIEVANCE' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const currentSection = sectionElements.find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });
      
      if (currentSection) setActiveSection(currentSection.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsTocExpanded(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0e2e] text-[#ccd6f6] font-inter pb-20 selection:bg-[#00aaff]/30">
      {/* Header Section */}
      <div className="pt-12 pb-8 px-6 flex flex-col items-center text-center border-b border-[#00aaff]/20">
        <div className="relative mb-6">
          <img src="/Triozen-logo-removebg-preview.png" alt="MH GAMING TELUGU" className="w-24 md:w-32 z-10 relative" />
          <div className="absolute inset-0 bg-[#00aaff]/20 blur-2xl rounded-full -z-0"></div>
        </div>
        <h1 className="font-rajdhani text-3xl md:text-5xl font-bold text-[#00aaff] uppercase tracking-tighter mb-2">
          Terms & Conditions — MH GAMING TELUGU
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">Last Updated: May 2025</p>
        
        <button 
          onClick={handlePrint}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#0d1535] border border-[#00aaff]/30 rounded-lg hover:bg-[#00aaff]/10 transition-colors text-xs font-bold uppercase tracking-widest no-print"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          Print Version
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Table of Contents - Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-32 h-fit no-print">
          <nav className="bg-[#0d1535] border border-[#00aaff]/20 rounded-2xl p-6 shadow-xl">
            <h3 className="font-rajdhani text-[#00aaff] text-xl font-bold mb-6 uppercase tracking-wider">Contents</h3>
            <ul className="space-y-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left text-sm transition-all duration-300 hover:text-[#00aaff] ${
                      activeSection === section.id ? 'text-[#00aaff] font-bold border-l-2 border-[#00aaff] pl-3' : 'text-slate-400 pl-3'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile TOC Accordion */}
        <div className="lg:hidden no-print">
          <div className="bg-[#0d1535] border border-[#00aaff]/20 rounded-xl overflow-hidden">
            <button 
              onClick={() => setIsTocExpanded(!isTocExpanded)}
              className="w-full flex justify-between items-center px-5 py-4 text-[#00aaff] font-rajdhani font-bold uppercase tracking-wider"
            >
              Table of Contents
              <span className={`material-symbols-outlined transition-transform duration-300 ${isTocExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {isTocExpanded && (
              <div className="px-5 pb-4 space-y-3 border-t border-[#00aaff]/10 pt-4 bg-[#0a0e2e]/50">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left text-sm text-slate-400 hover:text-[#00aaff]"
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-[860px] w-full mx-auto print:max-w-none print:px-0">
          <div className="space-y-12">
            <section id="acceptance">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">1. ACCEPTANCE OF TERMS</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>
                  By accessing or using the MH GAMING TELUGU tournament platform ("Platform"), registering for any tournament, or participating in any matches, you ("User", "Player", "you") agree to be bound by these Terms and Conditions ("Terms"). These Terms form a legally binding agreement between you and MH GAMING TELUGU.
                </p>
                <p className="bg-primary/10 border-l-4 border-[#00aaff] p-4 text-sm italic">
                  If you do not agree to these Terms, you must immediately stop using the Platform.
                </p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="eligibility">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">2. ELIGIBILITY</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>To use this Platform, you must:</p>
                <ul className="list-none space-y-3 ml-4">
                  {[
                    "Be at least 13 years of age (users aged 13\u201318 require parental/guardian consent)",
                    "Have a valid Garena Free Fire account with a legitimate Player UID",
                    "Provide accurate and truthful registration information",
                    "Have a valid WhatsApp number for match communication",
                    "Have a valid UPI ID or bank account for prize payouts (if winning)",
                    "Not be currently banned or suspended from Garena Free Fire",
                    "Not be a moderator or admin of this Platform (conflicts of interest prohibited)"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">\u2713</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="registration">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">3. ACCOUNT REGISTRATION</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <ul className="list-disc ml-5 space-y-2">
                  <li>You must sign in using a valid Google account</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must not share your account credentials with anyone</li>
                  <li>One Google account per player \u2014 multiple accounts are prohibited</li>
                  <li>We reserve the right to suspend accounts with suspicious activity</li>
                  <li>Your Free Fire UID must be your own \u2014 using another player's UID is strictly prohibited</li>
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="tournament-reg">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">4. TOURNAMENT REGISTRATION</h2>
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <div className="bg-[#0d1535] p-6 rounded-xl border border-[#00aaff]/10">
                  <h3 className="text-white font-bold mb-3 uppercase text-sm tracking-widest">4.1 Squad Registration</h3>
                  <ul className="list-disc ml-5 space-y-2 text-sm">
                    <li>Each team must consist of exactly 4 players + 1 player extra</li>
                    <li>All 4 player Free Fire UIDs must be legitimate and active</li>
                    <li>The same Free Fire UID cannot be registered in multiple teams for the same tournament</li>
                    <li>Team captain is responsible for accuracy of all team member details</li>
                    <li>False information will result in immediate disqualification without refund</li>
                  </ul>
                </div>
                <div className="bg-[#0d1535] p-6 rounded-xl border border-[#00aaff]/10">
                  <h3 className="text-white font-bold mb-3 uppercase text-sm tracking-widest">4.2 Slot Allocation</h3>
                  <ul className="list-disc ml-5 space-y-2 text-sm">
                    <li>Registration is confirmed only after successful payment (for paid tournaments)</li>
                    <li>Slots are allocated on a first-come, first-served basis</li>
                    <li>We reserve the right to reject registrations at our sole discretion</li>
                    <li>Teams on HOLD status are not guaranteed a slot in the next bracket</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="fees">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">5. ENTRY FEES & PAYMENTS</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <h3 className="text-white font-bold">5.1 Payment Confirmation</h3>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Your registration is confirmed only after payment verification</li>
                  <li>In case of payment failure, your slot will not be reserved</li>
                  <li>Contact us within 24 hours if payment was deducted but registration not confirmed</li>
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="rules">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">6. TOURNAMENT RULES</h2>
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <div>
                  <h3 className="text-white font-bold mb-2">6.1 General Rules</h3>
                  <p className="text-sm">All matches are played in Free Fire Custom Room mode. Room ID and Password will be shared 15 minutes before match start via player dashboard. Players must join the room within 5 minutes of Room ID release.</p>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">6.2 Bracket System</h3>
                  <p className="text-sm">Tournaments use a Single Elimination Bracket format. Match pairings are determined by random draw. Admin decision on match results is final and binding.</p>
                </div>
                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <h3 className="text-red-400 font-bold mb-3 uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">gavel</span>
                    6.3 Fair Play
                  </h3>
                  <p className="text-xs mb-3 text-red-200/70 uppercase font-bold tracking-widest">Strictly prohibited / Immediate Ban:</p>
                  <ul className="list-disc ml-5 space-y-2 text-sm text-slate-400">
                    <li>Use of hacks, mods, cheats, or third-party software</li>
                    <li>Teaming with opponents or match fixing</li>
                    <li>Stream sniping to gain advantage</li>
                    <li>Abusive behavior toward players or staff</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="prizes">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">7. PRIZE DISTRIBUTION</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <h3 className="text-white font-bold">7.2 Prize Payout</h3>
                <p>Prizes are paid via UPI or bank transfer within 48\u201372 hours of tournament completion. Winner must provide valid UPI ID or bank account details for payout. Failure to provide details within 7 days results in prize forfeiture.</p>
                <p className="text-sm italic text-slate-500">TDS (Tax Deducted at Source) may apply to prizes above \u20b910,000 as per Indian Income Tax Act.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="content">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">8. CONTENT & LIVE STREAMING</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>MH GAMING TELUGU reserves the right to live stream all tournament matches on YouTube. By registering, you grant us permission to feature your team name, player names, and in-game footage in live streams and promotional content.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="conduct">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">9. PROHIBITED CONDUCT</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>Users must not attempt to hack the Platform, create fake registrations, or impersonate staff. Violations may result in account suspension, tournament ban, and legal action.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="ip">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">10. INTELLECTUAL PROPERTY</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>"MH GAMING TELUGU" name and branding are owned by us. Free Fire is a registered trademark of Garena \u2014 we are an independent platform.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="disclaimer">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">11. DISCLAIMER OF WARRANTIES</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>The Platform is provided "as is" without warranties of any kind. We do not guarantee uninterrupted operation or specific tournament outcomes.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="grievance">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">16. CONTACT & GRIEVANCE OFFICER</h2>
              <div className="bg-[#0d1535] p-8 rounded-2xl border border-[#00aaff]/20 space-y-4 shadow-2xl">
                <p className="text-xl font-rajdhani font-bold text-white uppercase tracking-widest">MH GAMING TELUGU</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00aaff]">mail</span>
                    <span>legal@mhgamingtelugu.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00aaff]">location_on</span>
                    <span>Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Legal Footer */}
          <div className="mt-20 pt-10 border-t border-white/5 text-center space-y-6 no-print">
            <p className="text-slate-500 text-sm">Questions? Contact us at triozen.tech@gmail.com</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.2em] font-bold">
              <Link to="/" className="hover:text-[#00aaff] transition-colors">Home</Link>
              <Link to="/tournaments" className="hover:text-[#00aaff] transition-colors">Tournaments</Link>
              <Link to="/privacy-policy" className="hover:text-[#00aaff] transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="text-[#00aaff]">Terms & Conditions</Link>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 text-[10px] uppercase tracking-widest">MH GAMING TELUGU \u00a9 2025. ALL RIGHTS RESERVED.</p>
              <p className="text-slate-700 text-[9px] uppercase tracking-tighter">THIS PLATFORM IS NOT AFFILIATED WITH GARENA OR FREE FIRE.</p>
            </div>
          </div>
        </main>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-[70] bg-[#00aaff] text-white w-12 h-12 rounded-full shadow-[0_0_20px_rgba(0,170,255,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center no-print"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .min-h-screen { background: white !important; color: black !important; }
          h1, h2, h3 { color: black !important; border-bottom: 1px solid #ccc !important; padding-bottom: 10px !important; }
          p, li { color: black !important; }
          .max-w-screen-xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          section { page-break-inside: avoid; margin-bottom: 30px !important; }
          .bg-[#0d1535], .bg-primary\\/5 { background: transparent !important; border: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;

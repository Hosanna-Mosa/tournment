import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTocExpanded, setIsTocExpanded] = useState(false);

  const sections = [
    { id: 'introduction', title: '1. INTRODUCTION' },
    { id: 'collection', title: '2. INFORMATION WE COLLECT' },
    { id: 'usage', title: '3. HOW WE USE YOUR INFORMATION' },
    { id: 'sharing', title: '4. SHARING YOUR INFORMATION' },
    { id: 'security', title: '5. DATA STORAGE & SECURITY' },
    { id: 'retention', title: '6. DATA RETENTION' },
    { id: 'children', title: '7. CHILDREN\'S PRIVACY' },
    { id: 'cookies', title: '8. COOKIES & TRACKING' },
    { id: 'rights', title: '9. YOUR RIGHTS' },
    { id: 'third-party', title: '10. THIRD PARTY LINKS' },
    { id: 'changes', title: '11. CHANGES TO THIS POLICY' },
    { id: 'contact', title: '12. CONTACT US' },
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
          <img src="/Triozen-logo-removebg-preview.png" alt="TRIOZEN TECH" className="w-24 md:w-32 z-10 relative" />
          <div className="absolute inset-0 bg-[#00aaff]/20 blur-2xl rounded-full -z-0"></div>
        </div>
        <h1 className="font-rajdhani text-3xl md:text-5xl font-bold text-[#00aaff] uppercase tracking-tighter mb-2">
          Privacy Policy — TRIOZEN TECH
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
            <section id="introduction">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">1. INTRODUCTION</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>
                  TRIOZEN TECH ("we", "our", "us") operates the TRIOZEN TECH tournament platform (the "Platform") accessible at our official website. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our Platform to register for and participate in Free Fire gaming tournaments.
                </p>
                <p>
                  By using our Platform, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Platform.
                </p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="collection">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">2. INFORMATION WE COLLECT</h2>
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <div>
                  <h3 className="text-white font-bold mb-3">2.1 Information You Provide Directly</h3>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Full name and display name
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Email address (via Google Sign-In)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Profile photo (via Google Sign-In)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      WhatsApp mobile number
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Free Fire In-Game Name (IGN) and Player UID
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Team name and teammate details (names and Free Fire UIDs)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-3">2.2 Information Collected Automatically</h3>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      IP address and approximate location
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Browser type and version
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Device type (mobile/desktop)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Pages visited and time spent on Platform
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00aaff] font-bold">•</span>
                      Tournament activity logs
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="usage">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">3. HOW WE USE YOUR INFORMATION</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>We use collected information for the following purposes:</p>
                <ul className="list-none space-y-4 ml-4">
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Account Creation & Management:</strong> To create and manage your player account and profile</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Tournament Registration:</strong> To register your team, verify player UIDs, and manage slot allocation</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Match Communication:</strong> To deliver Room IDs, passwords, and match schedules to registered teams via WhatsApp/Dashboard</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Legal Compliance:</strong> To comply with applicable Indian laws and regulations</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Security:</strong> To detect and prevent fraud, cheating, and unauthorized access</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#00aaff] font-bold">✓</span>
                    <div><strong>Live Stream:</strong> Your team name and tournament performance may appear on our YouTube live stream</div>
                  </li>
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="sharing">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">4. SHARING YOUR INFORMATION</h2>
              <div className="space-y-6 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>We do not sell your personal information. We may share information with:</p>
                <div className="bg-[#0d1535] p-5 rounded-xl border border-[#00aaff]/10">
                  <h3 className="text-white font-bold mb-2">4.1 Service Providers</h3>
                  <p className="text-sm">MongoDB Atlas — for secure database hosting</p>
                </div>
                <div className="bg-[#0d1535] p-5 rounded-xl border border-[#00aaff]/10">
                  <h3 className="text-white font-bold mb-2">4.2 Public Information</h3>
                  <p className="text-sm mb-2">The following information is publicly visible on the Platform:</p>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    <li>Team names on tournament bracket and leaderboard</li>
                    <li>Tournament results and winner announcements</li>
                    <li>Hall of Fame entries (team name and player names)</li>
                  </ul>
                </div>
                <div className="bg-[#0d1535] p-5 rounded-xl border border-[#00aaff]/10">
                  <h3 className="text-white font-bold mb-2">4.3 Legal Requirements</h3>
                  <p className="text-sm">We may disclose your information if required by Indian law, court order, or government authority.</p>
                </div>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="security">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">5. DATA STORAGE & SECURITY</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <ul className="list-none space-y-3">
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-[#00aaff] text-sm mt-1">shield</span>
                    All data is stored on MongoDB Atlas servers with encryption at rest
                  </li>
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-[#00aaff] text-sm mt-1">lock</span>
                    We implement industry-standard security measures including HTTPS, JWT tokens, and rate limiting
                  </li>
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-sm mt-1">warning</span>
                    Despite our measures, no internet transmission is 100% secure — use the Platform at your own risk
                  </li>
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="retention">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">6. DATA RETENTION</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <ul className="list-none space-y-2">
                  <li className="flex gap-2">
                    <span className="text-[#00aaff] font-bold">●</span>
                    <strong>Account data:</strong> Retained as long as your account is active
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00aaff] font-bold">●</span>
                    <strong>Tournament data:</strong> Retained for 2 years for dispute resolution
                  </li>
                </ul>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="children">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">7. CHILDREN\'S PRIVACY</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>Our Platform is intended for users aged 13 and above. Free Fire is rated for players 12+ by Garena.</p>
                <p>We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us information, contact us immediately.</p>
                <p className="bg-primary/5 p-4 rounded-lg italic text-slate-400">
                  Parents or guardians of users aged 13–18 are encouraged to supervise platform usage.
                </p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="cookies">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">8. COOKIES & TRACKING</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>We use the following:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0d1535] border border-[#00aaff]/10 rounded-xl">
                    <span className="font-bold text-[#00aaff] block mb-1">Essential Cookies</span>
                    <p className="text-xs">For authentication sessions and platform functionality</p>
                  </div>
                  <div className="p-4 bg-[#0d1535] border border-[#00aaff]/10 rounded-xl">
                    <span className="font-bold text-[#00aaff] block mb-1">Analytics</span>
                    <p className="text-xs">Google Analytics to understand platform usage (anonymized)</p>
                  </div>
                </div>
                <p className="text-sm italic">No advertising or tracking cookies are used for ad targeting.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="rights">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">9. YOUR RIGHTS (Indian IT Act)</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>You have the right to:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>Access:</strong> Request a copy of personal data we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Portability:</strong> Request your data in a portable format</li>
                </ul>
                <p className="mt-4">To exercise these rights, contact us at: <strong>triozen.tech@gmail.com</strong></p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="third-party">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">10. THIRD PARTY LINKS</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>
                  Our Platform contains links to YouTube, WhatsApp, Instagram, and other third-party services. We are not responsible for the privacy practices of these services. Please review their respective privacy policies.
                </p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="changes">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">11. CHANGES TO THIS POLICY</h2>
              <div className="space-y-4 text-[15px] leading-[1.8] text-[#ccd6f6]">
                <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page or sending a notification.</p>
                <p className="text-[#00aaff] font-bold">Continued use of the Platform after changes constitutes acceptance of the updated policy.</p>
              </div>
              <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#00aaff]/30 to-transparent"></div>
            </section>

            <section id="contact">
              <h2 className="font-rajdhani text-2xl md:text-3xl font-bold text-[#00aaff] mb-6 uppercase tracking-wider">12. CONTACT US</h2>
              <div className="bg-[#0d1535] p-8 rounded-2xl border border-[#00aaff]/20 space-y-4 shadow-2xl">
                <p className="text-xl font-rajdhani font-bold text-white uppercase tracking-widest">TRIOZEN TECH</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00aaff]">mail</span>
                    <span>triozen.tech@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00aaff]">smart_display</span>
                    <span>YouTube: TRIOZEN TECH</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#00aaff]">phone_iphone</span>
                    <span>WhatsApp: 9398334115</span>
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
              <Link to="/privacy-policy" className="text-[#00aaff]">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#00aaff] transition-colors">Terms & Conditions</Link>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 text-[10px] uppercase tracking-widest">TRIOZEN TECH © 2025. ALL RIGHTS RESERVED.</p>
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

export default PrivacyPolicy;

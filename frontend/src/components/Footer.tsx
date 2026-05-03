const Footer = () => (
  <footer className="w-full py-12 md:py-16 border-t border-white/5 bg-[#020617] flex flex-col items-center gap-8 md:gap-10">
    <div className="flex flex-col items-center gap-3">
      <div className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase font-h1">
        MH GAMING
      </div>
      <div className="h-0.5 w-12 bg-primary rounded-full"></div>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-x-8 gap-y-6 px-6 max-w-4xl">
      {["Privacy", "Terms", "Contact", "Discord", "YouTube", "Support"].map((label) => (
        <a
          key={label}
          className="text-slate-500 hover:text-primary transition-all font-label-caps text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 hover:opacity-100 text-center"
          href="#"
        >
          {label}
        </a>
      ))}
    </div>
    
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="text-slate-600 font-label-caps text-[9px] md:text-[10px] uppercase tracking-[0.4em] opacity-60">
        © 2024 MH GAMING. RISE TO GLORY.
      </div>
      <div className="text-[8px] text-slate-800 uppercase tracking-widest font-space">
        SECURE COMMUNICATIONS LINK ACTIVE
      </div>
    </div>
  </footer>
);

export default Footer;

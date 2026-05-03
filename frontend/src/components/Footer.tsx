import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "@/api/api";

const Footer = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="w-full py-12 md:py-16 border-t border-white/5 bg-[#020617] flex flex-col items-center gap-8 md:gap-10">
      <div className="flex flex-col items-center gap-3">
        <div className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase font-h1">
          MH GAMING TELUGU
        </div>
        <div className="h-0.5 w-12 bg-primary rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-x-8 gap-y-6 px-6 max-w-4xl">
        {["Privacy", "Terms", "Contact", "YouTube", "Support"].map((label) => {
          const isExternal = ["Support", "Contact", "YouTube"].includes(label);
          
          let path = "#";
          if (label === "Privacy") path = "/privacy-policy";
          else if (label === "Terms") path = "/terms-and-conditions";
          else if (label === "Support" || label === "Contact") {
            path = settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : "https://wa.me/919398334115";
          } else if (label === "YouTube") {
            path = settings?.youtubeChannelUrl || "https://www.youtube.com/@mhgamingtelugu11";
          }
          
          return isExternal ? (
            <a
              key={label}
              className="text-slate-500 hover:text-primary transition-all font-label-caps text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 hover:opacity-100 text-center"
              href={path}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              className="text-slate-500 hover:text-primary transition-all font-label-caps text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 hover:opacity-100 text-center"
              to={path}
            >
              {label}
            </Link>
          );
        })}
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
};

export default Footer;

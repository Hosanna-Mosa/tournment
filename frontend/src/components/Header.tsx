import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/api/api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const isLoggedIn = !!localStorage.getItem('token');

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/');
  };

  const navItems = [
    { name: "Tournaments", path: "/tournaments", isExternal: false },
    { name: "Support", path: settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : "https://wa.me/919398334115", isExternal: true },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#0a0e2e]/80 backdrop-blur-md border-b border-[#00aaff]/20 shadow-[0_0_15px_rgba(0,170,255,0.1)]">
      <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="text-white">
                  <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0a0e2e] border-r border-primary/20 p-6 pt-12">
                <nav className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    item.isExternal ? (
                      <a
                        key={item.name}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white font-h1 uppercase tracking-widest text-lg transition-all duration-300"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`${
                          location.pathname === item.path
                            ? "text-[#00aaff]"
                            : "text-gray-400 hover:text-white"
                        } font-h1 uppercase tracking-widest text-lg transition-all duration-300`}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                  {isLoggedIn && (
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="text-left text-error uppercase tracking-widest font-space text-lg transition-colors mt-4"
                    >
                      Logout
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="text-[11px] xs:text-sm sm:text-lg md:text-2xl font-black text-white italic tracking-tighter uppercase font-h1 whitespace-nowrap">
            MH GAMING TELUGU
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.name}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white pb-1 font-h1 uppercase tracking-wider text-[10px] lg:text-xs transition-all duration-300"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-[#00aaff] border-b-2 border-[#00aaff]"
                    : "text-gray-400 hover:text-white"
                } pb-1 font-h1 uppercase tracking-wider text-[10px] lg:text-xs transition-all duration-300`}
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate("/tournaments")}
            className="bg-primary-container text-on-primary-container px-3 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs font-label-caps uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(0,170,255,0.4)] transition-all whitespace-nowrap"
          >
            Join Tournament
          </button>
          
          <div className="flex gap-3 md:gap-4 items-center">
            <span className="material-symbols-outlined text-gray-400 hover:text-[#00aaff] cursor-pointer transition-colors text-xl md:text-2xl hidden xs:block">
              notifications
            </span>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="hidden sm:block text-[10px] text-gray-400 hover:text-error uppercase tracking-widest font-space transition-colors"
              >
                Logout
              </button>
            ) : (
              <span 
                onClick={() => navigate('/login')}
                className="material-symbols-outlined text-gray-400 hover:text-[#00aaff] cursor-pointer transition-colors text-xl md:text-2xl"
              >
                account_circle
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

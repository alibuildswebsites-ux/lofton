import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, LogOut, 
  LayoutDashboard, Settings, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../lib/firebase/auth';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  variant?: 'public' | 'dashboard';
}

export const Navbar = ({ variant = 'public' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false); 
  
  const [hoverResource, setHoverResource] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const currentPath = location.pathname;
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath !== '/') return false;
    return currentPath.startsWith(path);
  };

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/property-listings' },
    { name: 'About Us', path: '/about-us' },
  ];

  const resourceLinks = [
    { name: "Buyer's Guide", path: '/buyers-guide' },
    { name: "Seller's Guide", path: '/sellers-guide' },
    { name: 'Our Agents', path: '/agents' },
  ];

  const secondaryLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const mobileMenuVariants = {
    closed: { 
      x: "100%",
      opacity: 0,
      transition: { 
        duration: 0.25,
        ease: [0.32, 0.72, 0, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      x: "0%",
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 } 
    },
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      } 
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoverResource(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoverResource(false);
    }, 200);
  };

  const isHomePage = location.pathname === '/';
  const navBgClass = isScrolled 
    ? 'bg-background shadow-md py-3 border-border' 
    : isHomePage 
      ? 'bg-transparent py-5 border-transparent' 
      : 'bg-background py-5 border-border/40';

  const navTextClass = (isHomePage && !isScrolled) 
    ? 'text-white' 
    : 'text-foreground';

  const navLinkClass = (isHomePage && !isScrolled)
    ? 'text-white/80 hover:text-white'
    : 'text-muted-foreground hover:text-foreground';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${navBgClass}`}
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-6 lg:px-8 flex justify-between items-center h-full">
          <Link 
            to="/" 
            className={`font-extrabold text-2xl tracking-tight z-[101] relative flex-shrink-0 mr-8 flex items-center gap-2 group transition-colors duration-300 ${navTextClass}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lofton Realty
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
            {mainLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-[15px] font-semibold px-4 py-2 rounded-full transition-all relative group ${
                  isActive(link.path) ? (isHomePage && !isScrolled ? 'text-white' : 'text-foreground') : navLinkClass
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                    <motion.div 
                        layoutId="desktop-navbar-indicator"
                        className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-brand rounded-full"
                    />
                )}
              </Link>
            ))}

            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                aria-expanded={hoverResource}
                aria-haspopup="true"
                className={`flex items-center gap-1 text-[15px] font-semibold px-4 py-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  hoverResource || resourceLinks.some(r => isActive(r.path)) 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-foreground') 
                    : navLinkClass
                }`}
              >
                Resources <ChevronDown size={14} className={`transition-transform duration-200 ${hoverResource ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {hoverResource && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-popover rounded-2xl shadow-xl border border-border overflow-hidden py-2"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-accent transition-colors ${
                          isActive(link.path) ? 'text-brand' : 'text-foreground/80'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {secondaryLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-[15px] font-semibold px-4 py-2 rounded-full transition-all relative ${
                  isActive(link.path) ? (isHomePage && !isScrolled ? 'text-white' : 'text-foreground') : navLinkClass
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                    <motion.div 
                        layoutId="desktop-navbar-indicator"
                        className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-brand rounded-full"
                    />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-full transition-colors border relative z-[110] ${
                    isHomePage && !isScrolled 
                      ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                      : 'hover:bg-accent border-border hover:border-border/80'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-dark text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className={`font-bold text-sm max-w-[100px] truncate ${isHomePage && !isScrolled ? 'text-white' : 'text-foreground'}`}>
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} className={`mr-2 ${isHomePage && !isScrolled ? 'text-white/60' : 'text-muted-foreground'}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[105] cursor-default" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-popover rounded-2xl shadow-xl border border-border py-2 z-[115] overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-border bg-accent/50">
                          <p className="font-bold text-foreground truncate">{user.displayName || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-brand transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          {isAdmin && (
                            <Link to="/dashboard/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                              <ShieldCheck size={16} /> Admin Panel
                            </Link>
                          )}
                          <Link to="/dashboard/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-brand transition-colors">
                            <Settings size={16} /> Settings
                          </Link>
                        </div>
                        <div className="border-t border-border pt-2 mt-1 px-2">
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`text-[15px] font-bold transition-colors px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-full ${navLinkClass}`}>Log In</Link>
                <Link to="/signup" className={`px-6 py-2.5 rounded-full font-bold text-[15px] hover:opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  isHomePage && !isScrolled 
                    ? 'bg-white text-black hover:bg-zinc-200' 
                    : 'bg-foreground text-background'
                }`}>Sign Up</Link>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button 
              className={`p-2 z-[103] relative rounded-full active:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${navTextClass} ${isHomePage && !isScrolled ? 'hover:bg-white/10' : 'hover:bg-accent/80'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] lg:hidden cursor-pointer"
            />
            
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-background z-[201] shadow-2xl lg:hidden flex flex-col overflow-y-auto border-l border-border"
            >
              <div className="pt-[7.5vh] px-6 pb-6 flex flex-col gap-1 flex-grow relative z-10">
                
                {/* Main Links */}
                {[...mainLinks, ...secondaryLinks].map((link) => (
                  <motion.div
                    key={link.name}
                    variants={menuItemVariants}
                    className="flex justify-center"
                  >
                    <Link 
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-center px-4 py-4 text-lg font-bold transition-all relative w-full text-center ${
                        isActive(link.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {link.name}
                        {isActive(link.path) && (
                          <motion.div 
                            layoutId="mobile-navbar-indicator"
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-brand rounded-full"
                          />
                        )}
                    </Link>
                  </motion.div>
                ))}

                {/* Resources Accordion */}
                <motion.div 
                    variants={menuItemVariants}
                    className="mt-2 rounded-2xl overflow-hidden"
                >
                    <button 
                      onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                      aria-expanded={isResourcesOpen}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-4 text-lg font-bold transition-colors active:scale-[0.98] ${
                        isResourcesOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                    Resources
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isResourcesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden flex flex-col items-center"
                      >
                        {resourceLinks.map((link) => (
                          <Link 
                            key={link.name} 
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-center px-8 py-3 text-base font-semibold transition-colors relative w-full text-center ${
                              isActive(link.path) ? 'text-brand' : 'text-foreground/80'
                            }`}
                          >
                            {link.name}
                            {isActive(link.path) && (
                              <motion.div 
                                layoutId="mobile-resource-indicator"
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand rounded-full"
                              />
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={menuItemVariants} className="mt-auto pt-8 border-t border-border">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex flex-col items-center gap-3 px-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-dark text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                          {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                        </div>
                        <div className="text-center overflow-hidden">
                          <p className="font-bold text-foreground text-lg truncate">{user.displayName || 'User'}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[220px]">{user.email}</p>
                        </div>
                      </div>
                      
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl bg-accent text-foreground font-bold hover:bg-accent/80 transition-colors">Dashboard</Link>
                      {isAdmin && (
                        <Link to="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">Admin Panel</Link>
                      )}
                      <Link to="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-xl text-foreground/80 font-bold hover:bg-accent transition-colors">Settings</Link>
                      <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2">Log Out</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3.5 rounded-xl font-bold text-muted-foreground border border-border hover:bg-accent transition-colors">Log In</Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3.5 rounded-xl font-bold text-background bg-foreground hover:opacity-90 transition-all shadow-lg">Sign Up</Link>
                    </div>
                  )}
                </motion.div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

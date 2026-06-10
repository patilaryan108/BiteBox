import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { 
  Search, 
  User, 
  Settings, 
  Store, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard,
  Utensils
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'shopkeeper') return '/shopkeeper';
    return '/';
  };

  return (
    <nav className={`bb-navbar ${scrolled ? 'bb-navbar--scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" className="bb-navbar__logo">
        <Utensils size={24} />
        BITE<span>BOX</span>
      </Link>

      {/* Nav Links */}
      <ul className="bb-navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#about">About</a></li>
      </ul>

      {/* Right side Actions */}
      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <button 
          className="p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => navigate('/search')}
        >
          <Search size={22} />
        </button>

        {user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 py-1.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user.role === 'admin' ? <Settings size={14} /> : user.role === 'shopkeeper' ? <Store size={14} /> : <User size={14} />}
              </div>
              <span className="text-sm font-semibold text-white/90 hidden sm:block">
                {user.name?.split(' ')[0]}
              </span>
              <ChevronDown size={14} className={`text-white/50 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#120801] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-bottom border-white/5 bg-white/5">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{user.role}</p>
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                </div>
                
                <div className="p-2">
                  {(user.role === 'admin' || user.role === 'shopkeeper') && (
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => { navigate(getDashboardPath(user.role)); setMenuOpen(false); }}
                    >
                      <LayoutDashboard size={18} className="text-primary" />
                      Dashboard
                    </button>
                  )}
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/signin" className="px-5 py-2 text-sm font-bold text-white hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-light rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
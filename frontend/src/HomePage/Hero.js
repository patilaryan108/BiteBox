import React, { useState } from 'react';
import { UtensilsCrossed, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const [address, setAddress] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (address.trim()) navigate(`/search?query=${encodeURIComponent(address.trim())}`);
  };

  return (
    <section className="bb-hero-section" id="hero">
      <div className="bb-hero-split">

        {/* ── Left: Dark Column ── */}
        <div className="bb-hero-left">
          {/* Navbar */}
          <nav className="bb-nav">
            <a href="/" className="bb-logo">
              <UtensilsCrossed size={22} className="bb-logo-icon" />
              BiteBox
            </a>
            <ul className="bb-nav-links">
              <li><a href="#hero"    className="bb-nav-link">Explore</a></li>
              <li><a href="#dishes"  className="bb-nav-link">Menu</a></li>
              <li><a href="#about"   className="bb-nav-link">Offers</a></li>
              <li><a href="#reviews" className="bb-nav-link">Contact</a></li>
            </ul>
            <div className="bb-nav-profile">
              {user ? (
                <>
                  <button
                    className="bb-nav-profile-btn"
                    onClick={() => setDropdownOpen(o => !o)}
                  >
                    {user.name || 'Profile'} ▾
                  </button>
                  {dropdownOpen && (
                    <div className="bb-nav-dropdown">
                      <button className="bb-nav-dropdown-item" onClick={() => { logout(); setDropdownOpen(false); }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="bb-nav-profile-btn" onClick={() => navigate('/signin')}>
                  Sign In
                </button>
              )}
            </div>
          </nav>

          {/* Hero Content */}
          <div className="bb-hero-content">
            <h1 className="bb-hero-headline">
              Gourmet Meals<br />Delivered. Right<br />to Your Door.
            </h1>
            <p className="bb-hero-sub">
              Discover exquisite flavors from local restaurants, curated just for you.
            </p>

            {/* Address Search */}
            <form className="bb-search-bar" onSubmit={handleSearch}>
              <MapPin size={18} className="bb-search-icon" />
              <input
                className="bb-search-input"
                type="text"
                placeholder="Enter Your Delivery Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <button type="submit" className="bb-search-btn">
                Find Restaurants
              </button>
            </form>
          </div>
        </div>

        {/* ── Right: Image Column ── */}
        <div className="bb-hero-right">
          <img
            src="/media/fine_dining_steak.png"
            alt="Fine dining steak table setting with red wine"
            className="bb-hero-right-img"
          />
          <div className="bb-hero-right-overlay" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
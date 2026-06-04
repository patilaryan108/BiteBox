import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

function Footer() {
  return (
    <footer className="bb-footer-section">
      <div className="bb-footer-container">
        <div className="bb-footer-grid">

          {/* Company */}
          <div className="bb-footer-col">
            <div className="bb-footer-brand">
              <UtensilsCrossed size={20} color="#D97706" />
              <span className="bb-footer-logo">BiteBox</span>
            </div>
            <p className="bb-footer-tagline">
              Premium food delivery, curated from the best local restaurants right to your door.
            </p>
          </div>

          {/* Company Links */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Company</h4>
            <ul className="bb-footer-list">
              <li><a href="#hero" className="bb-footer-link">About Us</a></li>
              <li><a href="#dishes" className="bb-footer-link">Our Menu</a></li>
              <li><a href="#about" className="bb-footer-link">Features</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Support</h4>
            <ul className="bb-footer-list">
              <li><a href="#reviews" className="bb-footer-link">Contact</a></li>
              <li><a href="#" className="bb-footer-link">Privacy Policy</a></li>
              <li><a href="#" className="bb-footer-link">Help Center</a></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Join Us</h4>
            <div className="bb-footer-socials">
              {/* Facebook */}
              <a href="https://facebook.com" className="bb-footer-social-icon" aria-label="Facebook" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" className="bb-footer-social-icon" aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" className="bb-footer-social-icon" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com" className="bb-footer-social-icon" aria-label="TikTok" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.18 8.18 0 004.78 1.52V6.93a4.85 4.85 0 01-1.01-.24z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="bb-footer-bottom">
          <p className="bb-footer-copyright">© 2025 BiteBox. All rights reserved. Made with ❤️ by Aryan</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
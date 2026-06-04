import React from 'react';
import { Leaf, ChefHat, MapPin, Award } from 'lucide-react';

function Intro() {
  return (
    <section className="bb-features-section" id="about">
      <div className="bb-features-container">
        <h2 className="bb-features-title">Why BiteBox?</h2>

        <div className="bb-features-visual-wrap">
          {/* SVG Connecting Lines */}
          <svg
            className="bb-features-svg-lines"
            viewBox="0 0 1000 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Top (Fresh Ingredients) → burger center */}
            <path d="M 270 145 L 390 230" className="bb-features-line" />
            {/* Left Bottom (Curated Menu) → burger center */}
            <path d="M 270 355 L 390 270" className="bb-features-line" />
            {/* Right Top (Local Favorites) → burger center */}
            <path d="M 730 145 L 610 230" className="bb-features-line" />
            {/* Right Bottom (Premium Quality) → burger center */}
            <path d="M 730 355 L 610 270" className="bb-features-line" />
          </svg>

          {/* Left Column */}
          <div className="bb-features-side-col left-side">
            <div className="bb-feature-item-label">
              <div className="bb-feature-icon-circle">
                <Leaf size={20} color="#D97706" />
              </div>
              <div className="bb-feature-text-block">
                <span className="bb-feature-item-title">FRESH INGREDIENTS</span>
                <p className="bb-feature-item-desc">Farm-to-table sourcing daily</p>
              </div>
            </div>
            <div className="bb-feature-item-label">
              <div className="bb-feature-icon-circle">
                <ChefHat size={20} color="#D97706" />
              </div>
              <div className="bb-feature-text-block">
                <span className="bb-feature-item-title">CURATED MENU</span>
                <p className="bb-feature-item-desc">Expert-curated selections</p>
              </div>
            </div>
          </div>

          {/* Central Burger */}
          <div className="bb-features-center-burger">
            <img
              src="/media/burger_why.png"
              alt="Stacked Artisan Burger"
              className="bb-features-burger-img"
            />
          </div>

          {/* Right Column */}
          <div className="bb-features-side-col right-side">
            <div className="bb-feature-item-label">
              <div className="bb-feature-icon-circle">
                <MapPin size={20} color="#D97706" />
              </div>
              <div className="bb-feature-text-block">
                <span className="bb-feature-item-title">LOCAL FAVORITES</span>
                <p className="bb-feature-item-desc">Support neighborhood chefs</p>
              </div>
            </div>
            <div className="bb-feature-item-label">
              <div className="bb-feature-icon-circle">
                <Award size={20} color="#D97706" />
              </div>
              <div className="bb-feature-text-block">
                <span className="bb-feature-item-title">PREMIUM QUALITY</span>
                <p className="bb-feature-item-desc">Top-rated, verified restaurants</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
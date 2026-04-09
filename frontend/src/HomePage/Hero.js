import React from 'react';

function Hero() {
    return (
        <section className="bb-hero" id="hero">
            {/* Background image */}
            <img
                src="media/heroleft.jpg"
                alt="Delicious Indian Food"
                className="bb-hero__bg"
            />

            {/* Dark gradient overlay */}
            <div className="bb-hero__overlay"></div>

            {/* Main Content */}
            <div className="bb-hero__content">
                <div className="bb-hero__badge">
                    <i className="fa-solid fa-star"></i>
                    Fresh &amp; Authentic Indian Flavors
                </div>

                <h1 className="bb-hero__title">
                    Fuel Your Day
                    <span className="highlight">with a Fresh,</span>
                    Flavorful Platter
                </h1>

                <p className="bb-hero__desc">
                    Handcrafted meals made with farm-fresh ingredients, delivered
                    hot to your doorstep. Taste the difference, every single day.
                </p>

                <div className="bb-hero__actions">
                    <a href="#lunch" className="bb-btn-primary">
                        <i className="fa-solid fa-bag-shopping"></i>
                        Order BiteBox
                    </a>
                    <a href="#about" className="bb-btn-ghost">
                        <i className="fa-solid fa-play"></i>
                        How It Works
                    </a>
                </div>
                {/* Bottom stats */}
                <div className="bb-hero__stats">
                    <div className="bb-hero__stat">
                        <div className="bb-hero__stat-num">5K+</div>
                        <div className="bb-hero__stat-label">Happy Customers</div>
                    </div>
                    <div className="bb-hero__stat">
                        <div className="bb-hero__stat-num">50+</div>
                        <div className="bb-hero__stat-label">Dishes Daily</div>
                    </div>
                    <div className="bb-hero__stat">
                        <div className="bb-hero__stat-num">4.9★</div>
                        <div className="bb-hero__stat-label">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Floating food image on right */}
            <img
                src="media/heroright.png"
                alt="Delicious Biryani"
                className="bb-hero__food-img"
            />
        </section>
    );
}

export default Hero;
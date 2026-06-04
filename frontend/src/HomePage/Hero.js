import React from 'react';
import { ShoppingBag, Play, Sparkles, Star } from 'lucide-react';

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
                    <Sparkles size={14} />
                    Fresh &amp; Authentic Indian Flavors
                </div>

                <h1 className="bb-hero__title">
                    Fuel Your Day
                    <span>with a Fresh,</span>
                    Flavorful Platter
                </h1>

                <p className="bb-hero__desc">
                    Handcrafted meals made with farm-fresh ingredients, delivered
                    hot to your doorstep. Taste the difference, every single day.
                </p>




            </div>

            {/* Floating food image on right
            <img
                src="media/heroright.png"
                alt="Delicious Biryani"
                className="bb-hero__food-img"
            /> */}
        </section >
    );
}

export default Hero;
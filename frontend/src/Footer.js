import React from 'react';

function Footer() {
    return (
        <footer className="bb-footer">
            <div className="bb-footer__grid">
                {/* Brand column */}
                <div>
                    <div className="bb-footer__logo">BITEBOX</div>
                    <p className="bb-footer__desc">
                        Fresh, flavourful Indian meals crafted daily with farm-fresh ingredients
                        and delivered hot to your doorstep. Taste the difference, every single day.
                    </p>
                    <div className="bb-footer__socials">
                        <a href="#" className="bb-footer__social" aria-label="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#" className="bb-footer__social" aria-label="Facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#" className="bb-footer__social" aria-label="Twitter">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="#" className="bb-footer__social" aria-label="YouTube">
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <div className="bb-footer__col-title">Quick Links</div>
                    <ul className="bb-footer__links">
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#lunch">Lunch Menu</a></li>
                        <li><a href="#dairy">Dairy Products</a></li>
                        <li><a href="#veggies">Vegetables</a></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <div className="bb-footer__col-title">Categories</div>
                    <ul className="bb-footer__links">
                        <li><a href="#lunch">Thali Meals</a></li>
                        <li><a href="#lunch">Poori & Sabzi</a></li>
                        <li><a href="#dairy">Fresh Milk</a></li>
                        <li><a href="#dairy">Paneer & Curd</a></li>
                        <li><a href="#veggies">Organic Veggies</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <div className="bb-footer__col-title">Contact Us</div>
                    <div className="bb-footer__contact-item">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>123 Main Street, Anytown,<br />Maharashtra, India</span>
                    </div>
                    <div className="bb-footer__contact-item">
                        <i className="fa-solid fa-phone"></i>
                        <span>+91 98675 96590</span>
                    </div>
                    <div className="bb-footer__contact-item">
                        <i className="fa-solid fa-envelope"></i>
                        <span>aspatil1081@gmail.com</span>
                    </div>
                    <div className="bb-footer__contact-item">
                        <i className="fa-solid fa-clock"></i>
                        <span>Mon – Sat: 8:00 AM – 9:00 PM</span>
                    </div>
                </div>
            </div>

            <div className="bb-footer__bottom">
                <p className="bb-footer__copy">
                    &copy; 2025 <span>BiteBox</span>. All rights reserved. Made with ❤️ by Aryan
                </p>
                <p className="bb-footer__copy">
                    Privacy Policy · Terms of Service
                </p>
            </div>
        </footer>
    );
}

export default Footer;
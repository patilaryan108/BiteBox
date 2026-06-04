import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah L.',
    avatar: '/media/sarah_profile.png',
    text: 'Absolutely amazing food! Delivered hot and fresh every single time. BiteBox has become my go-to for every meal.',
    stars: 5,
  },
  {
    name: 'Mark P.',
    avatar: '/media/mark_profile.png',
    text: 'BiteBox is my go-to for dinner. Love the variety and the portions are always generous. Highly recommended!',
    stars: 5,
  },
  {
    name: 'Emily R.',
    avatar: '/media/emily_profile.png',
    text: 'Top-tier quality and seamless ordering. The artisan burger was absolutely divine. Highly recommend to everyone!',
    stars: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="bb-testimonial-stars">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={15} fill="#D97706" stroke="#D97706" />
      ))}
    </div>
  );
}

function Customer() {
  return (
    <section className="bb-testimonials-section" id="reviews">
      <div className="bb-testimonials-container">
        <p className="bb-testimonials-subtitle">Testimonials</p>
        <h2 className="bb-testimonials-title">What Our Foodies Say</h2>

        <div className="bb-testimonials-grid">
          {reviews.map((r, i) => (
            <div className="bb-testimonial-card" key={i}>
              <div className="bb-testimonial-profile">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="bb-testimonial-avatar"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="bb-testimonial-avatar-fallback"
                  style={{ display: 'none' }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="bb-testimonial-name">{r.name}</p>
                  <StarRating count={r.stars} />
                </div>
              </div>
              <p className="bb-testimonial-text">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Customer;
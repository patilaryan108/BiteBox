import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dishes = [
  {
    img: '/media/signature_ramen.png',
    name: 'Signature Ramen',
    restaurant: 'Tokyo Kitchen',
    stars: 4.8,
    price: '$22.50',
    query: 'Ramen',
  },
  {
    img: '/media/avocado_toast.png',
    name: 'Avocado Toast',
    restaurant: 'The Green Bistro',
    stars: 4.8,
    price: '$22.50',
    query: 'Avocado Toast',
  },
  {
    img: '/media/truffle_pasta.png',
    name: 'Truffle Pasta',
    restaurant: 'Bella Italia',
    stars: 4.8,
    price: '$22.50',
    query: 'Truffle Pasta',
  },
  {
    img: '/media/artisan_burger.png',
    name: 'Artisan Burger',
    restaurant: 'The Grill House',
    stars: 4.8,
    price: '$22.50',
    query: 'Burger',
  },
];

function StarRating({ rating }) {
  return (
    <div className="bb-dish-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? '#D97706' : 'none'}
          stroke={i <= Math.round(rating) ? '#D97706' : '#C4B8AD'}
        />
      ))}
      <span style={{ marginLeft: 4, color: '#9C8E84', fontSize: '0.75rem' }}>{rating}</span>
    </div>
  );
}

function Lunch() {
  const navigate = useNavigate();

  return (
    <section className="bb-dishes-section" id="dishes">
      <div className="bb-dishes-container">
        <div className="bb-dishes-header">
          <div>
            <p className="bb-dishes-subtitle">Chef's Selection</p>
            <h2 className="bb-dishes-title">Most Loved Dishes Nearby</h2>
          </div>
          <a href="/search" className="bb-dishes-view-all">View All →</a>
        </div>

        <div className="bb-dishes-grid">
          {dishes.map((dish, i) => (
            <div className="bb-dish-card" key={i}>
              <div className="bb-dish-img-wrap">
                <img src={dish.img} alt={dish.name} className="bb-dish-img" />
              </div>
              <div className="bb-dish-body">
                <h3 className="bb-dish-name">{dish.name}</h3>
                <p className="bb-dish-restaurant">{dish.restaurant}</p>
                <div className="bb-dish-meta">
                  <StarRating rating={dish.stars} />
                  <span className="bb-dish-price">{dish.price}</span>
                </div>
                <button
                  className="bb-dish-btn"
                  onClick={() => navigate(`/search?query=${encodeURIComponent(dish.query)}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Lunch;
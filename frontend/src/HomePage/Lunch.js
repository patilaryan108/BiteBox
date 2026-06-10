import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultDishes = [
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
  const [lunchDishes, setLunchDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/restaurants/featured/all');
        const data = await res.json();
        if (data.success && data.data) {
          setLunchDishes(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch featured items:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Use dynamic dishes if present, otherwise default to static
  const displayDishes = lunchDishes.length > 0 ? lunchDishes : defaultDishes;

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
          {displayDishes.map((dish, i) => {
            const isDynamic = !!dish._id;
            const priceText = isDynamic ? `₹${dish.price}` : dish.price;
            const imgUrl = isDynamic ? (dish.image || '/media/signature_ramen.png') : dish.img;
            const restName = isDynamic ? dish.shopName : dish.restaurant;
            const ratingVal = isDynamic ? (dish.stars || 4.5) : dish.stars;
            const onClickHandler = () => {
              if (isDynamic && dish.shopId) {
                navigate(`/restaurant/${dish.shopId}`);
              } else {
                navigate(`/search?query=${encodeURIComponent(dish.query || dish.name)}`);
              }
            };

            return (
              <div className="bb-dish-card" key={dish._id || i}>
                <div className="bb-dish-img-wrap">
                  <img
                    src={imgUrl}
                    alt={dish.name}
                    className="bb-dish-img"
                    onError={(e) => { e.target.src = '/media/signature_ramen.png'; }}
                  />
                </div>
                <div className="bb-dish-body">
                  <h3 className="bb-dish-name">{dish.name}</h3>
                  <p className="bb-dish-restaurant">{restName}</p>
                  <div className="bb-dish-meta">
                    <StarRating rating={ratingVal} />
                    <span className="bb-dish-price">{priceText}</span>
                  </div>
                  <button
                    className="bb-dish-btn"
                    onClick={onClickHandler}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Lunch;
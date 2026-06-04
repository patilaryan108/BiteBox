import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, ArrowLeft, Clock, Utensils, IndianRupee } from 'lucide-react';

const TYPE_ICONS = {
  other: '🍽️',
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/restaurants/${id}`);
        if (res.data.success) setRestaurant(res.data.data);
      } catch (err) {
        console.error('Failed to fetch restaurant details', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
        <button onClick={() => navigate('/search')} className="text-orange-600 hover:underline">Go back to search</button>
      </div>
    );
  }

  const menuItems = restaurant.menu && restaurant.menu.length > 0 ? restaurant.menu : null;
  const legacyItems = restaurant.items && restaurant.items.length > 0 ? restaurant.items : null;

  const filteredMenu = menuItems;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold transition-colors bg-gray-100 hover:bg-orange-50 px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Search
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        {/* Banner */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="h-64 md:h-80 relative">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2000"
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">{restaurant.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.address}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
                    <span className="flex items-center gap-1 capitalize"><Utensils className="w-4 h-4" /> {restaurant.type}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Up to ₹{restaurant.priceRange}</span>
                  </div>
                </div>
                <div className="bg-green-500 text-white px-5 py-3 rounded-2xl flex flex-col items-center shadow-lg min-w-[80px]">
                  <div className="flex items-center gap-1 text-2xl font-black">
                    {restaurant.rating.toFixed(1)} <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80 mt-1">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${restaurant.isOpen ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
            {restaurant.isOpen ? '🟢 Currently Open' : '🔴 Currently Closed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main: Menu */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="text-orange-500 w-6 h-6" /> Our Menu
              </h2>

              {filteredMenu ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMenu.map(item => (
                      <div key={item._id} className="detail-menu-card">
                        {/* Image or icon */}
                        {item.image ? (
                          <div className="detail-menu-img-wrap">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="detail-menu-img"
                              onError={e => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="detail-menu-icon" style={{ display: 'none' }}>
                              🍽️
                            </div>
                          </div>
                        ) : (
                          <div className="detail-menu-icon">🍽️</div>
                        )}
                        <div className="detail-menu-info">
                          <h4 className="detail-menu-name">{item.name}</h4>
                          {item.description && (
                            <p className="detail-menu-desc">{item.description}</p>
                          )}
                        </div>
                        <div className="detail-menu-price-tag">
                          ₹{item.price}
                        </div>
                      </div>
                    ))}
                    {filteredMenu.length === 0 && (
                      <p className="text-gray-400 italic col-span-2 text-center py-8">No items in this category.</p>
                    )}
                  </div>
                </>
              ) : legacyItems ? (
                <div>
                  <p className="text-sm text-orange-600 bg-orange-50 rounded-xl px-4 py-3 mb-4 font-medium">
                    ℹ️ This restaurant hasn't set item prices yet.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {legacyItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-2xl">🍽️</span>
                        <span className="font-semibold text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic p-6 bg-gray-50 rounded-2xl text-center">
                  No menu items available yet.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar: Info + Reviews */}
          <div className="space-y-6">
            {/* Quick info card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4">📋 Restaurant Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Price Range</span>
                  <span className="font-bold text-gray-800">Up to ₹{restaurant.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Rating</span>
                  <span className="font-bold text-yellow-500">⭐ {restaurant.rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Food Type</span>
                  <span className="font-bold text-gray-800 capitalize">{restaurant.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className={`font-bold ${restaurant.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                    {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-gray-500 font-medium block mb-1">Address</span>
                  <span className="font-medium text-gray-700">📍 {restaurant.address}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Star className="text-orange-500 fill-current w-5 h-5" /> Reviews
              </h3>
              {restaurant.reviews && restaurant.reviews.length > 0 ? (
                <div className="space-y-4">
                  {restaurant.reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-800 text-sm">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm italic">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

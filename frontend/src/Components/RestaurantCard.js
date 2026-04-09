import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant, isRecommended }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      className={`relative flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border hover:-translate-y-1 ${isRecommended ? 'border-orange-500 shadow-orange-100' : 'border-gray-100'}`}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <span>👉 Recommended for you</span>
        </div>
      )}

      {/* Image Placeholder */}
      <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-200 relative overflow-hidden shrink-0">
        <img 
          src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=300`} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-md text-sm">Closed Now</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{restaurant.name}</h3>
            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 text-green-600 fill-current" />
              <span className="font-bold text-green-700 text-sm">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
            <span className="mx-2">•</span>
            <span className="font-medium shrink-0">
              {restaurant.distance ? (restaurant.distance / 1000).toFixed(1) + ' km' : 'Nearby'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {restaurant.type === 'veg' ? '🌿 Pure Veg' : restaurant.type === 'non-veg' ? '🥩 Non-Veg' : '🍲 Mixed'}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              💰 Up to ₹{restaurant.priceRange}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-1">
          {restaurant.items && restaurant.items.length > 0 ? restaurant.items.join(', ') : 'Various delicious items'}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;

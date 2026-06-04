import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../Components/RestaurantCard';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 5000,
    preference: '',
    openNow: false
  });

  // Dummy coordinates for Bangalore (to match the dummy data from the backend)
  const userLat = 12.9716;
  const userLng = 77.5946;

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // Build query string
      let params = `?lat=${userLat}&lng=${userLng}`;
      if (searchQuery) params += `&food=${searchQuery}`;
      if (filters.preference) params += `&type=${filters.preference}`;
      if (filters.openNow) params += `&isOpen=true`;
      if (filters.priceRange) params += `&maxPrice=${filters.priceRange}`;

      const response = await axios.get(`http://localhost:3001/api/restaurants${params}`);
      
      // Backend returns `{ success: true, count: X, data: [...] }`
      if (response.data.success) {
        setRestaurants(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header / Search Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          {/* Home button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-sm transition-all flex-shrink-0 border border-orange-200"
          >
            <Home className="w-4 h-4" /> Home
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-1 flex items-center">
            <Search className="absolute left-4 text-neutral-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search hotel name or food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium text-neutral-800"
            />
            <button type="submit" className="hidden"></button>
          </form>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all ${showFilters ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-orange-500 hover:text-orange-600'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Dropdown Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Preference */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Preference</label>
                <select 
                  value={filters.preference}
                  onChange={(e) => setFilters({...filters, preference: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="">All Tastes</option>
                  <option value="veg">Pure Veg 🌿</option>
                  <option value="non-veg">Non-Veg 🥩</option>
                  <option value="both">Both 🍲</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Max Price</label>
                  <span className="font-bold text-orange-600">₹{filters.priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              {/* Availability */}
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center cursor-pointer gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-orange-50 transition-colors">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={filters.openNow}
                      onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${filters.openNow ? 'bg-green-500' : 'bg-neutral-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.openNow ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="font-bold text-neutral-700">Open Now</span>
                </label>
              </div>
              
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {
                  setFilters({ priceRange: 5000, preference: '', openNow: false });
                  setSearchQuery('');
                }}
                className="text-sm font-bold text-neutral-500 hover:text-orange-600 transition-colors underline underline-offset-4"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-neutral-800">
            {searchQuery ? `Results for "${searchQuery}"` : "Nearby Restaurants"}
          </h2>
          <div className="text-neutral-500 font-medium bg-white px-4 py-1.5 rounded-full shadow-sm text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Showing {restaurants.length} places
          </div>
        </div>

        {/* Restaurant List Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard 
                key={restaurant._id} 
                restaurant={restaurant} 
                isRecommended={index === 0} // First item is the top recommendation
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-neutral-300">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">No restaurants found</h3>
            <p className="text-neutral-500">Try adjusting your filters or searching for something else.</p>
          </div>
        )}

      </div>
    </div>
  );
}

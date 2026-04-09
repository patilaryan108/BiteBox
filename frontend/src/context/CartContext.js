import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // [{ item: {_id, name, price, type, description}, quantity }]
  const [restaurant, setRestaurant] = useState(null); // current restaurant

  // Add item — returns null on success, or { conflict: true, newRestaurant } if switching restaurant
  const addToCart = useCallback((item, restaurantInfo) => {
    if (restaurant && restaurant._id !== restaurantInfo._id) {
      // Different restaurant — return conflict so UI can ask user
      return { conflict: true, newRestaurant: restaurantInfo, pendingItem: item };
    }

    setRestaurant(restaurantInfo);
    setCart(prev => {
      const existing = prev.find(c => c.item._id === item._id);
      if (existing) {
        return prev.map(c =>
          c.item._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });

    return null; // success
  }, [restaurant]);

  // Force add (clears old cart from different restaurant first)
  const forceAddToCart = useCallback((item, restaurantInfo) => {
    setRestaurant(restaurantInfo);
    setCart([{ item, quantity: 1 }]);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const updated = prev.filter(c => c.item._id !== itemId);
      if (updated.length === 0) setRestaurant(null);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId, qty) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.item._id === itemId ? { ...c, quantity: qty } : c));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setRestaurant(null);
  }, []);

  const total = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, restaurant, total, itemCount,
      addToCart, forceAddToCart, removeFromCart, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

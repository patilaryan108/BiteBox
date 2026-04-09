import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ITEM_TYPE_ICONS = {
  breakfast: '🌅',
  lunch: '🍱',
  dinner: '🌙',
  vegetable: '🥦',
  fruit: '🍎',
  dairy: '🥛',
  snack: '🍿',
  other: '🍽️',
};

export default function Cart() {
  const { cart, restaurant, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const gst = Math.round(total * 0.05);
  const deliveryFee = total > 0 ? (total > 500 ? 0 : 40) : 0;
  const grandTotal = total + gst + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/signin'); return; }
    setOrderLoading(true);
    // Simulate order processing (replace with real API call later)
    await new Promise(r => setTimeout(r, 1500));
    setOrderLoading(false);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="cart-success">
          <div className="cart-success-icon">🎉</div>
          <h1>Order Placed Successfully!</h1>
          <p>Your order from <strong>{restaurant?.name || 'the restaurant'}</strong> is being prepared.</p>
          <div className="cart-success-actions">
            <button className="auth-submit" style={{ maxWidth: 220 }} onClick={() => navigate('/')}>
              🏠 Back to Home
            </button>
            <button className="action-btn" onClick={() => navigate('/search')}>
              🔍 Order More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="cart-heading">🛒 Your Cart</h1>
        {cart.length > 0 && (
          <button className="cart-clear-btn" onClick={() => { if (window.confirm('Clear cart?')) clearCart(); }}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty state */
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse restaurants and add items to get started.</p>
          <Link to="/search" className="auth-submit" style={{ maxWidth: 220, textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
            🔍 Find Food
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left: Items */}
          <div className="cart-items-col">
            {/* Restaurant info */}
            <div className="cart-restaurant-bar">
              <span className="cart-restaurant-icon">🏪</span>
              <div>
                <div className="cart-restaurant-name">{restaurant?.name}</div>
                <div className="cart-restaurant-addr">📍 {restaurant?.address}</div>
              </div>
              <Link to={`/restaurant/${restaurant?._id}`} className="cart-view-rest-btn">
                View Menu
              </Link>
            </div>

            {/* Item list */}
            <div className="cart-items-list">
              {cart.map(({ item, quantity }) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-icon">
                    {ITEM_TYPE_ICONS[item.type] || '🍽️'}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    {item.description && (
                      <div className="cart-item-desc">{item.description}</div>
                    )}
                    <span className="cart-item-type-badge">{item.type}</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, quantity - 1)}
                        id={`qty-dec-${item._id}`}
                      >−</button>
                      <span className="qty-val">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, quantity + 1)}
                        id={`qty-inc-${item._id}`}
                      >+</button>
                    </div>
                    <div className="cart-item-price">₹{item.price * quantity}</div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Bill summary */}
          <div className="cart-bill-col">
            <div className="cart-bill-card">
              <h2 className="cart-bill-heading">🧾 Bill Summary</h2>

              <div className="cart-bill-rows">
                {cart.map(({ item, quantity }) => (
                  <div key={item._id} className="cart-bill-row">
                    <span>{item.name} × {quantity}</span>
                    <span>₹{item.price * quantity}</span>
                  </div>
                ))}
              </div>

              <div className="cart-bill-divider" />

              <div className="cart-bill-subtotals">
                <div className="cart-bill-row">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span>₹{total}</span>
                </div>
                <div className="cart-bill-row">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="cart-bill-row">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'cart-free' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="cart-free-delivery-note">🎉 Free delivery on orders above ₹500!</p>
                )}
              </div>

              <div className="cart-bill-divider" />

              <div className="cart-bill-total">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>

              {!user ? (
                <div className="cart-auth-prompt">
                  <p>🔒 Please sign in to place your order</p>
                  <Link to="/signin" className="auth-submit" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    Sign In to Order
                  </Link>
                </div>
              ) : (
                <button
                  id="place-order-btn"
                  className="cart-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? <span className="auth-spinner" /> : `🛒 Place Order · ₹${grandTotal}`}
                </button>
              )}

              <p className="cart-bill-note">
                * Prices are inclusive of all taxes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

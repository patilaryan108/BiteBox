import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const ITEM_TYPES = [
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch', label: '🍱 Lunch' },
  { value: 'dinner', label: '🌙 Dinner' },
  { value: 'vegetable', label: '🥦 Vegetable' },
  { value: 'fruit', label: '🍎 Fruit' },
  { value: 'dairy', label: '🥛 Dairy' },
  { value: 'snack', label: '🍿 Snack' },
  { value: 'other', label: '🍽️ Other' },
];

const TYPE_ICONS = {
  breakfast: '🌅', lunch: '🍱', dinner: '🌙',
  vegetable: '🥦', fruit: '🍎', dairy: '🥛', snack: '🍿', other: '🍽️',
};

// Convert a File to base64 data URL
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// Compress image to max width/height and quality
const compressImage = (base64, maxDim = 400, quality = 0.75) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });

export default function ShopkeeperDashboard() {
  const { user, token, authAxios, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [myShop, setMyShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('menu');

  const MEAL_OPTIONS = [
    { value: 'breakfast', label: '🌅 Breakfast' },
    { value: 'lunch',     label: '🍱 Lunch'     },
    { value: 'dinner',    label: '🌙 Dinner'    },
    { value: 'vegetable', label: '🥦 Vegetable' },
    { value: 'fruit',     label: '🍎 Fruit'     },
    { value: 'dairy',     label: '🥛 Dairy'     },
  ];

  // Register shop form
  const [shopForm, setShopForm] = useState({
    name: '', address: '', priceRange: '', rating: '4.0', type: 'both',
    items: '', lat: '12.9716', lng: '77.5946',
  });
  const [shopLoading, setShopLoading] = useState(false);

  // Add item form
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: '', price: '', description: '', image: '',
  });
  const [imgCompressing, setImgCompressing] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(''), 4000);
  };

  const fetchMyShop = useCallback(async (shopId) => {
    const id = shopId || user?.shopId;
    if (!id) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/api/restaurants/${id}`);
      if (res.data.success) setMyShop(res.data.data);
    } catch (e) {
      console.error('Failed to load shop:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.shopId]);

  useEffect(() => { fetchMyShop(); }, [fetchMyShop]);

  // Handle image file selection — compress → base64
  const handleImageFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showMsg('❌ Please select an image file.', true);
      return;
    }
    setImgCompressing(true);
    try {
      const raw = await fileToBase64(file);
      const compressed = await compressImage(raw, 600, 0.8);
      setItemForm(prev => ({ ...prev, image: compressed }));
    } catch {
      showMsg('❌ Failed to process image.', true);
    } finally {
      setImgCompressing(false);
    }
  };

  // Register shop
  const handleRegisterShop = async e => {
    e.preventDefault();
    setShopLoading(true);
    try {
      const payload = {
        name: shopForm.name,
        address: shopForm.address,
        priceRange: Number(shopForm.priceRange),
        rating: Number(shopForm.rating),
        type: shopForm.type,
        isOpen: true,
        items: shopForm.items.split(',').map(i => i.trim()).filter(Boolean),
        location: {
          type: 'Point',
          coordinates: [parseFloat(shopForm.lng), parseFloat(shopForm.lat)],
        },
      };
      const res = await axios.post(
        `${API_BASE}/api/auth/register-shop`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(res.data.user, res.data.token);
      setMyShop(res.data.shop);
      showMsg('✅ Shop registered successfully!');
      setActiveTab('menu');
    } catch (e) {
      showMsg('❌ ' + (e.response?.data?.detail || e.response?.data?.message || 'Failed to register shop.'), true);
    } finally {
      setShopLoading(false);
    }
  };

  // Add rich menu item
  const handleAddItem = async e => {
    e.preventDefault();
    if (!myShop) return;
    if (!itemForm.name || !itemForm.price) {
      showMsg('❌ Item name and price are required.', true);
      return;
    }
    setItemLoading(true);
    try {
      await authAxios().post(`/api/restaurants/${myShop._id}/menu`, {
        name: itemForm.name.trim(),
        price: Number(itemForm.price),
        description: itemForm.description.trim(),
        image: itemForm.image, // base64 or empty string
      });
      showMsg(`✅ "${itemForm.name}" added to your menu!`);
      setItemForm({ name: '', price: '', description: '', image: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddItem(false);
      fetchMyShop(myShop._id);
    } catch (e) {
      showMsg('❌ ' + (e.response?.data?.error || 'Failed to add item.'), true);
    } finally {
      setItemLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (itemId) => {
    if (!myShop || !window.confirm('Remove this item from your menu?')) return;
    try {
      await authAxios().delete(`/api/restaurants/${myShop._id}/menu/${itemId}`);
      fetchMyShop(myShop._id);
      showMsg('Item removed.');
    } catch (e) {
      showMsg('❌ Failed to remove item.', true);
    }
  };

  // Group menu items by type
  const groupedMenu = (myShop?.menu || []).reduce((acc, item) => {
    const t = item.type || 'other';
    if (!acc[t]) acc[t] = [];
    acc[t].push(item);
    return acc;
  }, {});

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">BITE<span>BOX</span></div>
        <div className="dashboard-user-info">
          <div className="dashboard-avatar">🏪</div>
          <div>
            <div className="dashboard-username">{user?.name}</div>
            <div className="dashboard-role-badge shopkeeper">Shopkeeper</div>
          </div>
        </div>
        <nav className="dashboard-nav">
          {myShop ? (
            <>
              <button
                id="sk-tab-menu"
                className={`dashboard-nav-item${activeTab === 'menu' ? ' active' : ''}`}
                onClick={() => setActiveTab('menu')}
              >
                <span>🍽️</span> My Menu
              </button>
              <button
                id="sk-tab-add-item"
                className={`dashboard-nav-item${activeTab === 'add-item' ? ' active' : ''}`}
                onClick={() => { setActiveTab('add-item'); setShowAddItem(true); }}
              >
                <span>➕</span> Add Item
              </button>
            </>
          ) : (
            <button
              id="sk-tab-register"
              className={`dashboard-nav-item${activeTab === 'register' ? ' active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              <span>📝</span> Register Shop
            </button>
          )}
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="dashboard-logout-btn" onClick={() => { logout(); navigate('/'); }}>
            🚪 Logout
          </button>
          <button className="dashboard-home-btn" onClick={() => navigate('/')}>
            🏠 Home
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">
            {myShop ? myShop.name : 'Shopkeeper Dashboard'}
          </h1>
          <div className="dashboard-stat-pills">
            <span className="stat-pill">🍽️ {myShop?.menu?.length || 0} Items</span>
            {myShop && (
              <span className={`stat-pill ${myShop.isOpen ? 'pill-green' : 'pill-red'}`}>
                {myShop.isOpen ? '🟢 Open' : '🔴 Closed'}
              </span>
            )}
          </div>
        </div>

        {msg && (
          <div className={`dashboard-msg${msg.isError ? ' dashboard-msg-error' : ''}`}>
            {msg.text}
          </div>
        )}

        {/* ── Register Shop ───────────────────────────────────────────── */}
        {!myShop && !loading && (activeTab === 'register' || activeTab === 'menu') && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>📝 Register Your Shop</h2>
            </div>
            <p className="sk-warning">
              ⚠️ Each account can only register <strong>one shop</strong>. Choose carefully.
            </p>
            <form onSubmit={handleRegisterShop} className="hotel-form">
              <div className="hotel-form-grid">
                <div className="auth-field">
                  <label>Shop Name</label>
                  <input type="text" value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} required placeholder="My Restaurant" />
                </div>
                <div className="auth-field">
                  <label>Address</label>
                  <input type="text" value={shopForm.address} onChange={e => setShopForm({ ...shopForm, address: e.target.value })} required placeholder="123 Main St" />
                </div>
                <div className="auth-field">
                  <label>Price Range (₹)</label>
                  <input type="number" value={shopForm.priceRange} onChange={e => setShopForm({ ...shopForm, priceRange: e.target.value })} required placeholder="500" />
                </div>
                <div className="auth-field">
                  <label>Food Type</label>
                  <select value={shopForm.type} onChange={e => setShopForm({ ...shopForm, type: e.target.value })}>
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="auth-field">
                  <label>Latitude</label>
                  <input type="number" step="any" value={shopForm.lat} onChange={e => setShopForm({ ...shopForm, lat: e.target.value })} required />
                </div>
                <div className="auth-field">
                  <label>Longitude</label>
                  <input type="number" step="any" value={shopForm.lng} onChange={e => setShopForm({ ...shopForm, lng: e.target.value })} required />
                </div>
              </div>
              <button id="sk-register-submit" type="submit" className="auth-submit" disabled={shopLoading}>
                {shopLoading ? <span className="auth-spinner" /> : '📝 Register My Shop'}
              </button>
            </form>
          </div>
        )}

        {/* ── Add Item Form ────────────────────────────────────────────── */}
        {myShop && (activeTab === 'add-item' || showAddItem) && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>➕ Add Menu Item</h2>
              <button className="icon-btn" onClick={() => { setShowAddItem(false); setActiveTab('menu'); }}>✕</button>
            </div>
            <form onSubmit={handleAddItem} className="hotel-form">
              <div className="hotel-form-grid">
                <div className="auth-field">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                    required
                    placeholder="e.g. Masala Dosa"
                  />
                </div>
                <div className="auth-field">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.price}
                    onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                    required
                    placeholder="e.g. 120"
                  />
                </div>
              </div>



              <div className="auth-field">
                <label>Description <span style={{ opacity: 0.45 }}>(optional)</span></label>
                <input
                  type="text"
                  value={itemForm.description}
                  onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="e.g. Crispy rice crepe with spiced potato filling"
                />
              </div>

              {/* ── Image upload ── */}
              <div className="auth-field">
                <label>Item Photo <span style={{ opacity: 0.45 }}>(optional)</span></label>

                {/* Upload box */}
                <div
                  className={`sk-upload-box${imgCompressing ? ' sk-upload-box--loading' : ''}`}
                  onClick={() => !imgCompressing && fileInputRef.current?.click()}
                >
                  {itemForm.image ? (
                    <img src={itemForm.image} alt="preview" className="sk-upload-preview" />
                  ) : (
                    <>
                      <div className="sk-upload-icon">📷</div>
                      <div className="sk-upload-text">
                        {imgCompressing ? 'Processing…' : 'Click to upload a photo'}
                      </div>
                      <div className="sk-upload-hint">JPG, PNG, WEBP · Max ~2MB</div>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageFile}
                />

                {itemForm.image && (
                  <button
                    type="button"
                    className="sk-remove-img-btn"
                    onClick={() => {
                      setItemForm(prev => ({ ...prev, image: '' }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    🗑️ Remove Photo
                  </button>
                )}
              </div>

              <button id="sk-add-item-submit" type="submit" className="auth-submit" disabled={itemLoading || imgCompressing}>
                {itemLoading ? <span className="auth-spinner" /> : '➕ Add to Menu'}
              </button>
            </form>
          </div>
        )}

        {/* ── Menu Display ─────────────────────────────────────────────── */}
        {myShop && activeTab === 'menu' && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>🍽️ Your Menu</h2>
              <button
                id="sk-show-add-item"
                className="action-btn"
                onClick={() => { setActiveTab('add-item'); setShowAddItem(true); }}
              >
                ➕ Add Item
              </button>
            </div>

            {loading ? (
              <div className="dashboard-loading">Loading menu…</div>
            ) : myShop.menu && myShop.menu.length > 0 ? (
              <div className="sk-menu-items">
                {(myShop.menu || []).map(item => (
                  <div key={item._id} className="sk-menu-item">
                    {/* Thumbnail */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="sk-menu-item-img"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="sk-menu-item-icon">🍽️</div>
                    )}
                    <div className="sk-menu-item-left">
                      <div className="sk-menu-item-name">{item.name}</div>
                      {item.description && (
                        <div className="sk-menu-item-desc">{item.description}</div>
                      )}
                    </div>
                    <div className="sk-menu-item-right">
                      <div className="sk-menu-item-price">₹{item.price}</div>
                      <button
                        className="item-chip-del"
                        style={{ fontSize: '1.3rem' }}
                        onClick={() => handleDeleteItem(item._id)}
                        title="Remove item"
                      >×</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <div className="empty-icon">🍽️</div>
                <h2>No menu items yet</h2>
                <p>Add your first item to start accepting orders.</p>
                <button
                  className="auth-submit"
                  style={{ maxWidth: 220, margin: '1rem auto 0' }}
                  onClick={() => { setActiveTab('add-item'); setShowAddItem(true); }}
                >
                  ➕ Add First Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="dashboard-card">
            <div className="dashboard-loading">Loading your shop…</div>
          </div>
        )}
      </main>
    </div>
  );
}

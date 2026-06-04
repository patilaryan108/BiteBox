import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';

// ── Image helpers ────────────────────────────────────────────────────────────
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

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

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'lunch',     label: 'Lunch',     icon: '🍱', color: '#c0392b' },
  { value: 'breakfast', label: 'Breakfast',  icon: '🌅', color: '#e67e22' },
  { value: 'dinner',    label: 'Dinner',     icon: '🌙', color: '#8e44ad' },
  { value: 'vegetable', label: 'Vegetables', icon: '🥦', color: '#27ae60' },
  { value: 'dairy',     label: 'Dairy',      icon: '🥛', color: '#2980b9' },
  { value: 'fruit',     label: 'Fruits',     icon: '🍎', color: '#e91e63' },
  { value: 'snack',     label: 'Snacks',     icon: '🍿', color: '#795548' },
  { value: 'other',     label: 'Other',      icon: '🍽️', color: '#607d8b' },
];

const catMap = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

// ── Homepage sections controlled by featured flag ────────────────────────────
const HOME_SECTIONS = {
  lunch:     'Lunch Section',
  vegetable: 'Vegetables Section',
  dairy:     'Dairy Section',
  breakfast: 'Breakfast (future)',
  dinner:    'Dinner (future)',
};

export default function AdminDashboard() {
  const { user, authAxios, logout } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('hotels');

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (text, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Hotel form ───────────────────────────────────────────────────────────
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: '', address: '', priceRange: '', rating: '', type: 'both',
    lat: '12.9716', lng: '77.5946',
  });
  const [hotelLoading, setHotelLoading] = useState(false);

  // ── Quick-add item form (per restaurant) ─────────────────────────────────
  const [itemInputs, setItemInputs]   = useState({});
  const [itemTypes,  setItemTypes]    = useState({});
  const [itemPrices, setItemPrices]   = useState({});
  const [itemImages, setItemImages]   = useState({});
  const [imgComp,    setImgComp]      = useState({});

  // ── Show-Items tab ───────────────────────────────────────────────────────
  const [showFilter, setShowFilter] = useState('all');   // 'all' | category value
  const [toggling,   setToggling]   = useState({});      // itemId -> bool (loading)

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchRestaurants = async () => {
    try {
      const res  = await fetch(`${API_BASE}/api/restaurants/all`);
      const data = await res.json();
      setRestaurants(data.data || []);
    } catch { setError('Failed to load restaurants.'); }
    finally  { setLoading(false); }
  };
  useEffect(() => { fetchRestaurants(); }, []);

  // ── Derived: flat list of all menu items ─────────────────────────────────
  const allItems = restaurants.flatMap(r =>
    (r.menu || []).map(m => ({ ...m, shopName: r.name, shopId: r._id }))
  );

  const filteredItems = showFilter === 'all'
    ? allItems
    : allItems.filter(i => i.type === showFilter);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel permanently?')) return;
    try {
      await authAxios().delete(`/api/restaurants/${id}`);
      setRestaurants(prev => prev.filter(r => r._id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Delete failed.'); }
  };

  const handleAddHotel = async e => {
    e.preventDefault();
    setHotelLoading(true);
    try {
      const payload = {
        name: hotelForm.name, address: hotelForm.address,
        priceRange: Number(hotelForm.priceRange), rating: Number(hotelForm.rating),
        type: hotelForm.type, isOpen: true,
        location: { type: 'Point', coordinates: [parseFloat(hotelForm.lng), parseFloat(hotelForm.lat)] },
      };
      await authAxios().post('/api/restaurants', payload);
      showToast('✅ Hotel added!');
      setHotelForm({ name: '', address: '', priceRange: '', rating: '', type: 'both', lat: '12.9716', lng: '77.5946' });
      setShowAddHotel(false);
      fetchRestaurants();
    } catch (e) { showToast('❌ ' + (e.response?.data?.error || 'Failed.'), true); }
    finally    { setHotelLoading(false); }
  };

  const handleImageChange = async (e, rid) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgComp(p => ({ ...p, [rid]: true }));
    try {
      const raw  = await fileToBase64(file);
      const comp = await compressImage(raw, 600, 0.8);
      setItemImages(p => ({ ...p, [rid]: comp }));
    } catch { alert('Image error'); }
    finally { setImgComp(p => ({ ...p, [rid]: false })); }
  };

  const handleAddItem = async (restaurantId) => {
    const name  = itemInputs[restaurantId]?.trim();
    const price = itemPrices[restaurantId] || '100';
    const image = itemImages[restaurantId] || '';
    if (!name) return;
    try {
      await authAxios().post(`/api/restaurants/${restaurantId}/menu`, { name, price: Number(price), image });
      showToast(`✅ "${name}" added!`);
      setItemInputs(p => ({ ...p, [restaurantId]: '' }));
      setItemPrices(p => ({ ...p, [restaurantId]: '' }));
      setItemImages(p => ({ ...p, [restaurantId]: '' }));
      fetchRestaurants();
    } catch (e) { showToast('❌ ' + (e.response?.data?.error || 'Failed.'), true); }
  };

  const handleDeleteItem = async (restaurantId, itemId) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await authAxios().delete(`/api/restaurants/${restaurantId}/menu/${itemId}`);
      fetchRestaurants();
      showToast('Item removed.');
    } catch { showToast('❌ Failed to remove.', true); }
  };

  // Toggle featured — controls homepage visibility
  const handleToggleFeatured = async (shopId, itemId) => {
    setToggling(p => ({ ...p, [itemId]: true }));
    try {
      await authAxios().patch(`/api/restaurants/${shopId}/menu/${itemId}/featured`);
      fetchRestaurants();
    } catch (e) { showToast('❌ ' + (e.response?.data?.error || 'Toggle failed.'), true); }
    finally    { setToggling(p => ({ ...p, [itemId]: false })); }
  };

  // ── Sidebar nav items ────────────────────────────────────────────────────
  const NAV = [
    { id: 'hotels',     icon: '🏨', label: 'All Hotels'  },
    { id: 'show-items', icon: '⭐', label: 'Show Items'  },
    { id: 'add',        icon: '➕', label: 'Add Hotel'   },
  ];

  return (
    <div className="dashboard-page">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.isError ? '#c0392b' : '#27ae60',
          color: '#fff', padding: '12px 20px', borderRadius: 10,
          fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease',
        }}>{toast.text}</div>
      )}

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">BITE<span>BOX</span></div>
        <div className="dashboard-user-info">
          <div className="dashboard-avatar">👑</div>
          <div>
            <div className="dashboard-username">{user?.name}</div>
            <div className="dashboard-role-badge admin">Admin</div>
          </div>
        </div>
        <nav className="dashboard-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              id={`admin-tab-${item.id}`}
              className={`dashboard-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(item.id); if (item.id === 'add') setShowAddHotel(true); }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="dashboard-logout-btn" onClick={() => { logout(); navigate('/'); }}>🚪 Logout</button>
          <button className="dashboard-home-btn"   onClick={() => navigate('/')}>🏠 Home</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-heading">
            {activeTab === 'hotels'     && 'Admin Dashboard'}
            {activeTab === 'show-items' && '⭐ Show Items on Homepage'}
            {activeTab === 'add'        && 'Add New Hotel'}
          </h1>
          <div className="dashboard-stat-pills">
            <span className="stat-pill">🏨 {restaurants.length} Hotels</span>
            <span className="stat-pill">🍽️ {allItems.length} Items</span>
            <span className="stat-pill" style={{ background: 'rgba(255,215,0,0.2)', color: '#f1c40f' }}>
              ⭐ {allItems.filter(i => i.featured).length} Featured
            </span>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: SHOW ITEMS
           ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'show-items' && (
          <div>
            {/* Info banner */}
            <div style={{
              background: 'rgba(241,196,15,0.12)', border: '1px solid rgba(241,196,15,0.3)',
              borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex',
              alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>⭐</span>
              <div>
                <strong style={{ color: '#f1c40f' }}>Homepage Control</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                  Toggle the <strong>⭐ Feature</strong> button on any item to immediately show or hide it
                  on the homepage <strong>Lunch</strong>, <strong>Vegetables</strong>, and <strong>Dairy</strong> sections.
                </p>
              </div>
            </div>

            {/* Category filter tabs */}
            <div style={{ marginBottom: 12 }}></div>

            {/* Items grid or empty */}
            {loading ? (
              <div className="dashboard-loading">Loading items…</div>
            ) : filteredItems.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="empty-icon">🍽️</div>
                <h2>No items in this category</h2>
                <p>Add items from the <strong>All Hotels</strong> tab first.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}>
                {filteredItems.map(item => {
                  const cat = catMap['other'];
                  const isFeatured = !!item.featured;
                  const isToggling = toggling[item._id];
                  return (
                    <div key={item._id} style={{
                      background: 'var(--bb-card-bg, rgba(255,255,255,0.04))',
                      border: isFeatured
                        ? '2px solid #f1c40f'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 14, overflow: 'hidden',
                      boxShadow: isFeatured ? '0 0 16px rgba(241,196,15,0.2)' : 'none',
                      transition: 'all 0.25s',
                    }}>
                      {/* Image */}
                      <div style={{ position: 'relative', height: 160, background: '#111', overflow: 'hidden' }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            height: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 48,
                          }}>🍽️</div>
                        )}
                        {/* Featured badge */}
                        {isFeatured && (
                          <span style={{
                            position: 'absolute', top: 10, right: 10,
                            background: '#f1c40f', color: '#000',
                            padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                          }}>⭐ On Homepage</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{item.name}</div>
                        {item.description && (
                          <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: 4 }}>{item.description}</div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 700, color: '#f1c40f', fontSize: '1.05rem' }}>₹{item.price}</span>
                          <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>🏪 {item.shopName}</span>
                        </div>



                        {/* Feature toggle button */}
                        <button
                          onClick={() => handleToggleFeatured(item.shopId, item._id)}
                          disabled={isToggling}
                          style={{
                            width: '100%', padding: '9px 0', borderRadius: 8, border: 'none',
                            cursor: isToggling ? 'not-allowed' : 'pointer',
                            background: isFeatured
                              ? 'linear-gradient(135deg, #f1c40f, #e67e22)'
                              : 'rgba(255,255,255,0.08)',
                            color: isFeatured ? '#000' : 'inherit',
                            fontWeight: 700, fontSize: '0.88rem',
                            transition: 'all 0.2s',
                          }}
                        >
                          {isToggling ? '⏳ Saving…' : isFeatured ? '⭐ Featured — Click to Hide' : '☆ Show on Homepage'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteItem(item.shopId, item._id)}
                          style={{
                            width: '100%', marginTop: 6, padding: '7px 0',
                            borderRadius: 8, border: '1px solid rgba(192,57,43,0.4)',
                            background: 'transparent', color: '#e74c3c',
                            cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                          }}
                        >🗑️ Delete Item</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: ALL HOTELS
           ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'hotels' && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>🏨 All Hotels</h2>
              <button id="admin-show-add-hotel" className="action-btn"
                onClick={() => { setShowAddHotel(v => !v); }}>
                {showAddHotel ? '✕ Close' : '➕ Add Hotel'}
              </button>
            </div>

            {/* Quick Add Hotel form */}
            {showAddHotel && (
              <form onSubmit={handleAddHotel} className="hotel-form" style={{ marginBottom: 24 }}>
                <div className="hotel-form-grid">
                  <div className="auth-field">
                    <label>Hotel Name</label>
                    <input type="text" value={hotelForm.name} onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })} required placeholder="The Grand Hotel" />
                  </div>
                  <div className="auth-field">
                    <label>Address</label>
                    <input type="text" value={hotelForm.address} onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })} required placeholder="123 Main St" />
                  </div>
                  <div className="auth-field">
                    <label>Price Range (₹)</label>
                    <input type="number" value={hotelForm.priceRange} onChange={e => setHotelForm({ ...hotelForm, priceRange: e.target.value })} required placeholder="500" />
                  </div>
                  <div className="auth-field">
                    <label>Rating (1–5)</label>
                    <input type="number" min="1" max="5" step="0.1" value={hotelForm.rating} onChange={e => setHotelForm({ ...hotelForm, rating: e.target.value })} required placeholder="4.5" />
                  </div>
                  <div className="auth-field">
                    <label>Type</label>
                    <select value={hotelForm.type} onChange={e => setHotelForm({ ...hotelForm, type: e.target.value })}>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label>Latitude</label>
                    <input type="number" step="any" value={hotelForm.lat} onChange={e => setHotelForm({ ...hotelForm, lat: e.target.value })} required />
                  </div>
                  <div className="auth-field">
                    <label>Longitude</label>
                    <input type="number" step="any" value={hotelForm.lng} onChange={e => setHotelForm({ ...hotelForm, lng: e.target.value })} required />
                  </div>
                </div>
                <button id="admin-add-hotel-submit" type="submit" className="auth-submit" disabled={hotelLoading}>
                  {hotelLoading ? <span className="auth-spinner" /> : '➕ Add Hotel'}
                </button>
              </form>
            )}

            {loading ? (
              <div className="dashboard-loading">Loading hotels…</div>
            ) : restaurants.length === 0 ? (
              <p className="dashboard-empty">No hotels found.</p>
            ) : (
              <div className="hotel-list">
                {restaurants.map(r => (
                  <div key={r._id} className="hotel-item">
                    <div className="hotel-item-header">
                      <div>
                        <h3 className="hotel-item-name">{r.name}</h3>
                        <p className="hotel-item-address">📍 {r.address}</p>
                        <div className="hotel-item-badges">
                          <span className="badge badge-rating">⭐ {r.rating}</span>
                          <span className="badge badge-price">₹{r.priceRange}</span>
                          <span className={`badge badge-type ${r.type}`}>{r.type}</span>
                          <span className={`badge ${r.isOpen ? 'badge-open' : 'badge-closed'}`}>
                            {r.isOpen ? '🟢 Open' : '🔴 Closed'}
                          </span>
                          <span className="badge badge-price" style={{ background: 'rgba(241,196,15,0.2)', color: '#f1c40f' }}>
                            ⭐ {(r.menu || []).filter(m => m.featured).length} featured
                          </span>
                        </div>
                      </div>
                      <button id={`admin-delete-hotel-${r._id}`} className="delete-btn"
                        onClick={() => handleDelete(r._id)}>🗑️ Delete</button>
                    </div>

                    {/* Quick add item */}
                    <div className="hotel-items-section">
                      <p className="hotel-items-label">
                        Menu Items ({(r.menu || []).length}) — go to
                        <button onClick={() => setActiveTab('show-items')}
                          style={{ background: 'none', border: 'none', color: '#f1c40f', cursor: 'pointer', fontWeight: 700, padding: '0 4px' }}>
                          ⭐ Show Items
                        </button>
                        to control homepage visibility
                      </p>

                      {/* mini menu chip list */}
                      <div className="hotel-items-list">
                        {(r.menu || []).slice(0, 6).map(item => (
                          <span key={item._id} className="item-chip" style={{
                            background: item.featured ? 'rgba(241,196,15,0.2)' : undefined,
                            borderColor: item.featured ? '#f1c40f' : undefined,
                          }}>
                            {item.featured ? '⭐ ' : ''}{item.name} (₹{item.price})
                            <button className="item-chip-del"
                              onClick={() => handleDeleteItem(r._id, item._id)} title={`Remove ${item.name}`}
                            >×</button>
                          </span>
                        ))}
                        {(r.menu || []).length > 6 && (
                          <span className="item-chip" style={{ opacity: 0.5 }}>+{r.menu.length - 6} more</span>
                        )}
                      </div>

                      {/* Add item row */}
                      <div className="add-item-row" style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        {itemImages[r._id] && (
                          <img src={itemImages[r._id]} alt="preview"
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                        )}
                        <label style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: 6, fontSize: 13 }}>
                          {imgComp[r._id] ? '⏳' : '📷'}
                          <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => handleImageChange(e, r._id)} />
                        </label>
                        <input type="text" placeholder="Item name…"
                          value={itemInputs[r._id] || ''}
                          onChange={e => setItemInputs(p => ({ ...p, [r._id]: e.target.value }))}
                          className="add-item-input" style={{ flex: 1, minWidth: 120 }} />
                        <input type="number" placeholder="₹ Price"
                          value={itemPrices[r._id] || ''}
                          onChange={e => setItemPrices(p => ({ ...p, [r._id]: e.target.value }))}
                          className="add-item-input" style={{ width: 80 }} />
                        <button id={`admin-add-item-${r._id}`} className="add-item-btn"
                          onClick={() => handleAddItem(r._id)}>➕ Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TAB: ADD HOTEL (redirect to inline form above)
           ═══════════════════════════════════════════════════════════════ */}
        {activeTab === 'add' && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>➕ Add New Hotel</h2>
            </div>
            <form onSubmit={handleAddHotel} className="hotel-form">
              <div className="hotel-form-grid">
                <div className="auth-field">
                  <label>Hotel Name</label>
                  <input type="text" value={hotelForm.name} onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })} required placeholder="e.g. The Grand Hotel" />
                </div>
                <div className="auth-field">
                  <label>Address</label>
                  <input type="text" value={hotelForm.address} onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })} required placeholder="123 Main St, City" />
                </div>
                <div className="auth-field">
                  <label>Price Range (₹)</label>
                  <input type="number" value={hotelForm.priceRange} onChange={e => setHotelForm({ ...hotelForm, priceRange: e.target.value })} required placeholder="e.g. 500" />
                </div>
                <div className="auth-field">
                  <label>Rating (1–5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={hotelForm.rating} onChange={e => setHotelForm({ ...hotelForm, rating: e.target.value })} required placeholder="4.5" />
                </div>
                <div className="auth-field">
                  <label>Type</label>
                  <select value={hotelForm.type} onChange={e => setHotelForm({ ...hotelForm, type: e.target.value })}>
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label>Latitude</label>
                  <input type="number" step="any" value={hotelForm.lat} onChange={e => setHotelForm({ ...hotelForm, lat: e.target.value })} required />
                </div>
                <div className="auth-field">
                  <label>Longitude</label>
                  <input type="number" step="any" value={hotelForm.lng} onChange={e => setHotelForm({ ...hotelForm, lng: e.target.value })} required />
                </div>
              </div>
              <button id="admin-add-hotel-submit-2" type="submit" className="auth-submit" disabled={hotelLoading}>
                {hotelLoading ? <span className="auth-spinner" /> : '➕ Add Hotel'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

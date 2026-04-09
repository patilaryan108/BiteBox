import React from 'react';
import { Link } from 'react-router-dom';

// Fallback shown only if admin hasn't featured any dairy items yet
const fallbackDairy = [
    { img: 'media/dairy1.png', name: 'Fresh Milk',  detail: '500ml bottle',   price: '₹28',  shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/dairy2.png', name: 'Paneer',       detail: '200g block',     price: '₹65',  shopName: 'Luxury Palace Hotel',  shopId: '' },
    { img: 'media/dairy3.png', name: 'Dahi (Curd)',  detail: 'Clay pot 400g',  price: '₹35',  shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/dairy4.png', name: 'Pure Ghee',    detail: 'Cow ghee 250ml', price: '₹180', shopName: 'The Grand Hotel',      shopId: '' },
    { img: 'media/dairy1.png', name: 'Butter Milk',  detail: '300ml cold',     price: '₹20',  shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/dairy2.png', name: 'Cheese Slice', detail: 'Processed 200g', price: '₹55',  shopName: 'Luxury Palace Hotel',  shopId: '' },
];

function Dairy() {
    const [dairyProducts, setDairyProducts] = React.useState(fallbackDairy);

    React.useEffect(() => {
        // Fetch ONLY admin-featured dairy items via the dedicated endpoint
        fetch('http://localhost:3001/api/restaurants/featured/all')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const featured = data.data.filter(m => m.type === 'dairy');
                    if (featured.length > 0) {
                        setDairyProducts(featured.map(m => ({
                            img:      m.image || 'media/dairy1.png',
                            name:     m.name,
                            detail:   m.description || 'Premium Quality',
                            price:    '₹' + m.price,
                            shopName: m.shopName,
                            shopId:   m.shopId,
                        })));
                    }
                }
            })
            .catch(err => console.error('Error fetching featured dairy items:', err));
    }, []);

    // Triplicate for seamless loop
    const scrollProducts = [...dairyProducts, ...dairyProducts, ...dairyProducts];

    return (
        <section className="bb-dairy" id="dairy">
            <div className="bb-dairy__header">
                <div className="bb-section-badge">
                    <i className="fa-solid fa-droplet"></i>
                    Daily Essentials
                </div>
                <h2 className="bb-section-title">Dairy Products</h2>
                <p className="bb-section-desc">
                    Pure, farm-sourced dairy products delivered fresh every morning.
                    No added preservatives, just clean natural goodness.
                </p>
            </div>

            <div className="marquee-container" style={{ marginTop: '40px' }}>
                <div className="marquee-content marquee-content--slow">
                    {scrollProducts.map((p, i) => (
                        <Link
                            to={p.shopId ? `/restaurant/${p.shopId}` : '#'}
                            className="bb-product-card"
                            key={i}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <img src={p.img} alt={p.name} />
                            <div className="bb-product-card__name">{p.name}</div>
                            <div className="bb-product-card__detail">{p.detail}</div>
                            <div className="bb-product-card__price">{p.price}</div>
                            <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', fontWeight: '500' }}>
                                <i className="fa-solid fa-store" style={{ marginRight: '4px' }}></i>
                                {p.shopName}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Dairy;
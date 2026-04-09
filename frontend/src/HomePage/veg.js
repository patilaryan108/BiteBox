import React from 'react';
import { Link } from 'react-router-dom';

// Fallback shown only if admin hasn't featured any vegetable items yet
const fallbackVeg = [
    { img: 'media/veg1.png', name: 'Tomatoes', detail: 'Per kg',    price: '₹40', shopName: 'The Grand Hotel',      shopId: '' },
    { img: 'media/veg2.png', name: 'Spinach',  detail: 'Per bunch', price: '₹20', shopName: 'The Grand Hotel',      shopId: '' },
    { img: 'media/veg3.png', name: 'Carrots',  detail: 'Per kg',    price: '₹35', shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/veg4.png', name: 'Broccoli', detail: 'Per piece', price: '₹60', shopName: 'The Grand Hotel',      shopId: '' },
    { img: 'media/veg1.png', name: 'Capsicum', detail: 'Per kg',    price: '₹75', shopName: 'Luxury Palace Hotel',  shopId: '' },
    { img: 'media/veg3.png', name: 'Beetroot', detail: 'Per kg',    price: '₹30', shopName: 'Sunrise Budget Hotel', shopId: '' },
];

const vegFeatures = [
    'Sourced directly from local farms',
    'Delivered within 24 hours of harvest',
    'No artificial ripening agents',
    'Washed and hygienically packed',
    'Zero pesticides guarantee',
];

function Veg() {
    const [vegProducts, setVegProducts] = React.useState(fallbackVeg);

    React.useEffect(() => {
        // Fetch ONLY admin-featured vegetable items via the dedicated endpoint
        fetch('http://localhost:3001/api/restaurants/featured/all')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const featured = data.data.filter(m => m.type === 'vegetable');
                    if (featured.length > 0) {
                        setVegProducts(featured.map(m => ({
                            img:      m.image || 'media/veg1.png',
                            name:     m.name,
                            detail:   m.description || 'Fresh Produce',
                            price:    '₹' + m.price,
                            shopName: m.shopName,
                            shopId:   m.shopId,
                        })));
                    }
                }
            })
            .catch(err => console.error('Error fetching featured vegetable items:', err));
    }, []);

    const scrollVeg = [...vegProducts, ...vegProducts, ...vegProducts];

    return (
        <section className="bb-veg" id="veggies">
            <div className="bb-veg__inner">
                {/* Left text */}
                <div>
                    <div className="bb-section-badge bb-veg__badge">
                        <i className="fa-solid fa-seedling"></i>
                        Green Living
                    </div>
                    <h2 className="bb-section-title bb-veg__title">
                        Fresh Supplies Assure<br />Superior Meals
                    </h2>
                    <p className="bb-section-desc bb-veg__desc" style={{ marginBottom: '28px' }}>
                        We believe great food starts at the source. Our vegetables are
                        picked at peak freshness and rush-delivered to your kitchen.
                    </p>
                    {vegFeatures.map((feat, i) => (
                        <div className="bb-veg__feature" key={i}>
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{feat}</span>
                        </div>
                    ))}
                    <a href="#dairy" className="bb-btn-primary" style={{ marginTop: '32px', display: 'inline-flex' }}>
                        <i className="fa-solid fa-leaf"></i>
                        Shop Vegetables
                    </a>
                </div>

                {/* Right image */}
                <div>
                    <img src="media/veg1.png" alt="Fresh Vegetables" className="bb-veg__img" />
                </div>
            </div>

            {/* Product marquee */}
            <div className="marquee-container">
                <div className="marquee-content">
                    {scrollVeg.map((v, i) => (
                        <Link
                            to={v.shopId ? `/restaurant/${v.shopId}` : '#'}
                            className="bb-product-card"
                            key={i}
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', display: 'block' }}
                        >
                            <img src={v.img} alt={v.name} />
                            <div className="bb-product-card__name" style={{ color: '#fff' }}>{v.name}</div>
                            <div className="bb-product-card__detail" style={{ color: 'rgba(255,255,255,0.5)' }}>{v.detail}</div>
                            <div className="bb-product-card__price" style={{ color: '#5ee87e' }}>{v.price}</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '6px', fontWeight: '500' }}>
                                <i className="fa-solid fa-store" style={{ marginRight: '4px' }}></i>
                                {v.shopName}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Veg;
import React from 'react';
import { Link } from 'react-router-dom';

// Shown only if admin hasn't featured any items yet
const fallbackItems = [
    { img: 'media/lunch1.png', name: 'Poori Bhaji',     price: '₹60',  shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/lunch2.png', name: 'Marathi Thali',   price: '₹120', shopName: 'The Grand Hotel',       shopId: '' },
    { img: 'media/lunch3.png', name: 'Kokani Thali',    price: '₹150', shopName: 'Sunrise Budget Hotel',  shopId: '' },
    { img: 'media/lunch4.png', name: 'Dal Khichdi',     price: '₹80',  shopName: 'The Grand Hotel',       shopId: '' },
    { img: 'media/lunch5.png', name: 'Chicken Biryani', price: '₹180', shopName: 'Luxury Palace Hotel',   shopId: '' },
];

const tags = [
    { icon: 'fa-solid fa-carrot',     label: 'Tastes Great'       },
    { icon: 'fa-brands fa-pagelines', label: 'Nature Fresh'       },
    { icon: 'fa-solid fa-cookie',     label: 'Healthy Snack'      },
    { icon: 'fa-solid fa-ban',        label: 'Non-GMO'            },
    { icon: 'fa-solid fa-lemon',      label: 'Rich Antioxidants'  },
    { icon: 'fa-solid fa-fire',       label: 'Hot & Fresh'        },
];

function Lunch() {
    const [lunchItems, setLunchItems] = React.useState(fallbackItems);

    React.useEffect(() => {
        // Fetch ONLY admin-featured lunch items via the dedicated endpoint
        fetch('http://localhost:3001/api/restaurants/featured/all')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const featured = data.data.filter(m => m.type === 'lunch');
                    if (featured.length > 0) {
                        setLunchItems(featured.map(m => ({
                            img:      m.image || 'media/lunch1.png',
                            name:     m.name,
                            price:    '₹' + m.price,
                            shopName: m.shopName,
                            shopId:   m.shopId,
                        })));
                    }
                }
            })
            .catch(err => console.error('Error fetching featured lunch items:', err));
    }, []);

    // Triplicate for seamless infinite marquee
    const scrollItems = [...lunchItems, ...lunchItems, ...lunchItems];
    const scrollTags  = [...tags, ...tags];

    return (
        <section className="bb-lunch" id="lunch">
            <div className="bb-lunch__header">
                <div className="bb-section-badge" style={{ justifyContent: 'center' }}>
                    <i className="fa-solid fa-utensils"></i>
                    Chef's Special
                </div>
                <h2 className="bb-section-title bb-section-title--white">
                    Our Lunch Plates
                </h2>
                <p className="bb-section-desc bb-section-desc--white" style={{ margin: '0 auto' }}>
                    Hearty, home-style meals crafted fresh every morning.
                    Pick your favourite platter today.
                </p>
            </div>

            {/* Food cards marquee */}
            <div className="marquee-container">
                <div className="marquee-content">
                    {scrollItems.map((item, i) => (
                        <Link
                            to={item.shopId ? `/restaurant/${item.shopId}` : '#'}
                            className="bb-food-card"
                            key={i}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="bb-food-card__img-wrap">
                                <img src={item.img} alt={item.name} className="bb-food-card__img" />
                            </div>
                            <div className="bb-food-card__name">{item.name}</div>
                            <div className="bb-food-card__price">{item.price}</div>
                            <div style={{ fontSize: '13px', color: '#666', marginTop: '6px', fontWeight: '500' }}>
                                <i className="fa-solid fa-store" style={{ marginRight: '4px' }}></i>
                                {item.shopName}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tag strip */}
            <div className="bb-tag-strip">
                <div className="bb-tag-strip__content">
                    {scrollTags.map((t, i) => (
                        <span className="bb-tag-strip__item" key={i}>
                            <i className={t.icon}></i>
                            {t.label}
                            <span style={{ opacity: 0.5 }}>·</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Lunch;
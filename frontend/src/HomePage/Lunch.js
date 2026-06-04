import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, 
  Store, 
  Carrot, 
  Leaf, 
  Cookie, 
  Ban, 
  Flame,
  ArrowRight
} from 'lucide-react';

// Shown only if admin hasn't featured any items yet
const fallbackItems = [
    { img: 'media/lunch1.png', name: 'Poori Bhaji',     price: '₹60',  shopName: 'Sunrise Budget Hotel', shopId: '' },
    { img: 'media/lunch2.png', name: 'Marathi Thali',   price: '₹120', shopName: 'The Grand Hotel',       shopId: '' },
    { img: 'media/lunch3.png', name: 'Kokani Thali',    price: '₹150', shopName: 'Sunrise Budget Hotel',  shopId: '' },
    { img: 'media/lunch4.png', name: 'Dal Khichdi',     price: '₹80',  shopName: 'The Grand Hotel',       shopId: '' },
    { img: 'media/lunch5.png', name: 'Chicken Biryani', price: '₹180', shopName: 'Luxury Palace Hotel',   shopId: '' },
];

const tags = [
    { icon: <Carrot size={16} />,     label: 'Tastes Great'       },
    { icon: <Leaf size={16} />,       label: 'Nature Fresh'       },
    { icon: <Cookie size={16} />,     label: 'Healthy Snack'      },
    { icon: <Ban size={16} />,        label: 'Non-GMO'            },
    { icon: <Leaf size={16} />,       label: 'Rich Antioxidants'  },
    { icon: <Flame size={16} />,      label: 'Hot & Fresh'        },
];

function Lunch() {
    const [lunchItems, setLunchItems] = useState(fallbackItems);

    useEffect(() => {
        // Fetch ALL admin-featured items via the dedicated endpoint
        fetch('http://localhost:3001/api/restaurants/featured/all')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const featured = data.data;
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
            .catch(err => console.error('Error fetching featured items:', err));
    }, []);

    // Triplicate for seamless infinite marquee
    const scrollItems = [...lunchItems, ...lunchItems, ...lunchItems];
    const scrollTags  = [...tags, ...tags, ...tags];

    return (
        <section className="bb-lunch" id="lunch">
            <div className="bb-lunch__header">
                <div className="bb-section-badge">
                    <Utensils size={14} />
                    Chef's Special
                </div>
                <h2 className="bb-section-title">
                    Popular Dishes
                </h2>
                <p className="bb-section-desc">
                    Hearty, delicious meals crafted fresh by local chefs.
                    Experience the signature flavors of nearby restaurants.
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
                        >
                            <div className="bb-food-card__img-wrap">
                                <img src={item.img} alt={item.name} className="bb-food-card__img" />
                            </div>
                            <div className="bb-food-card__name">{item.name}</div>
                            <div className="flex items-center justify-between w-full mt-auto">
                              <span className="bb-food-card__price">{item.price}</span>
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                                <Store size={12} className="text-primary" />
                                {item.shopName}
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between w-full text-white/60 text-xs font-semibold group-hover:text-white transition-colors">
                              View Menu
                              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tag strip - Using updated colors and spacing */}
            <div className="bb-tag-strip">
                <div className="bb-tag-strip__content">
                    {scrollTags.map((t, i) => (
                        <span className="bb-tag-strip__item" key={i}>
                            {t.icon}
                            {t.label}
                            <span className="opacity-30">/</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Lunch;
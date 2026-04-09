import React from 'react';

const features = [
    {
        icon: 'fa-solid fa-fire',
        title: 'Freshly Cooked',
        desc: 'Every meal is prepared fresh on the same day — no preservatives, no shortcuts.',
    },
    {
        icon: 'fa-solid fa-bowl-food',
        title: 'Balanced Nutrition',
        desc: 'Our chefs ensure every plate has the right balance of proteins, carbs and vitamins.',
    },
    {
        icon: 'fa-solid fa-face-grin-hearts',
        title: 'Customer Delight',
        desc: 'We have served 5,000+ happy customers across Maharashtra with 4.9★ ratings.',
    },
    {
        icon: 'fa-solid fa-mortar-pestle',
        title: 'Authentic Recipes',
        desc: 'Traditional recipes passed down through generations, cooked with pure desi ghee.',
    },
];

function Intro() {
    return (
        <section className="bb-intro" id="about">
            <div className="bb-intro__grid">
                {/* Left features */}
                <div>
                    {features.slice(0, 2).map((f, i) => (
                        <div className="bb-feature-card" key={i}>
                            <div className="bb-feature-card__icon">
                                <i className={f.icon}></i>
                            </div>
                            <div>
                                <div className="bb-feature-card__title">{f.title}</div>
                                <div className="bb-feature-card__desc">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center image */}
                <div className="bb-intro__img-wrap">
                    <img src="media/intro.png" alt="Fresh Food Bowl" className="bb-intro__img" />
                    <div className="bb-intro__img-badge">
                        <i className="fa-solid fa-leaf"></i>
                        <span>100% Farm<br />Fresh</span>
                    </div>
                </div>

                {/* Right features */}
                <div>
                    {features.slice(2).map((f, i) => (
                        <div className="bb-feature-card" key={i}>
                            <div className="bb-feature-card__icon">
                                <i className={f.icon}></i>
                            </div>
                            <div>
                                <div className="bb-feature-card__title">{f.title}</div>
                                <div className="bb-feature-card__desc">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Heading below grid */}
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <div className="bb-section-badge">
                    <i className="fa-solid fa-seedling"></i>
                    Green Living
                </div>
                <h2 className="bb-section-title" style={{ maxWidth: '560px', margin: '0 auto' }}>
                    Nurture Your Body with<br />Farm-Fresh Goodness
                </h2>
                <p className="bb-section-desc" style={{ margin: '12px auto 0', textAlign: 'center' }}>
                    We partner with local farmers to bring you the freshest produce
                    and cook every meal with love and tradition.
                </p>
            </div>
        </section>
    );
}

export default Intro;
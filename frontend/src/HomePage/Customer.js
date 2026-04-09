import React from 'react';

const reviews = [
    {
        text: '"I never knew healthy eating could taste this incredible. BiteBox has completely changed my lunch game!"',
        name: 'Priya Sharma',
        loc: 'Pune, Maharashtra',
        initial: 'P',
        stars: 5,
        color: '#e8820c',
    },
    {
        text: '"The Marathi Thali is absolutely divine. Tastes exactly like my mom\'s cooking. Highly recommended!"',
        name: 'Rohan Desai',
        loc: 'Mumbai, Maharashtra',
        initial: 'R',
        stars: 5,
        color: '#c0392b',
    },
    {
        text: '"Delivery is always on time and the food is always hot. Best food service in Pune, hands down!"',
        name: 'Sneha Patil',
        loc: 'Nasik, Maharashtra',
        initial: 'S',
        stars: 5,
        color: '#27ae60',
    },
    {
        text: '"The dairy products are so fresh! BiteBox has become a daily necessity for our family."',
        name: 'Amit Kulkarni',
        loc: 'Aurangabad, Maharashtra',
        initial: 'A',
        stars: 5,
        color: '#8e44ad',
    },
    {
        text: '"It\'s been an enlightening journey with BiteBox. Every meal feels like a celebration of Indian cuisine."',
        name: 'Kavya Joshi',
        loc: 'Kolhapur, Maharashtra',
        initial: 'K',
        stars: 5,
        color: '#2980b9',
    },
    {
        text: '"The Kokani Thali brings me back to my coastal hometown. Authentic flavours, brilliant service!"',
        name: 'Siddharth Naik',
        loc: 'Ratnagiri, Maharashtra',
        initial: 'S',
        stars: 5,
        color: '#16a085',
    },
];

const scrollReviews = [...reviews, ...reviews];

function Customer() {
    return (
        <section className="bb-reviews" id="reviews">
            <div className="bb-reviews__header">
                <div className="bb-section-badge" style={{ justifyContent: 'center' }}>
                    <i className="fa-solid fa-star"></i>
                    Testimonials
                </div>
                <h2 className="bb-section-title bb-section-title--white">
                    What Our Customers Say
                </h2>
                <p className="bb-section-desc bb-section-desc--white" style={{ margin: '0 auto' }}>
                    Over 5,000 happy customers trust BiteBox for their daily meals.
                    Here's what they love about us.
                </p>
            </div>

            <div className="marquee-container">
                <div className="marquee-content marquee-content--slow" style={{ alignItems: 'stretch' }}>
                    {scrollReviews.map((r, i) => (
                        <div className="bb-review-card" key={i}>
                            <div>
                                <div className="bb-review-card__stars">
                                    {'★'.repeat(r.stars)}
                                </div>
                                <p className="bb-review-card__text">{r.text}</p>
                            </div>
                            <div className="bb-review-card__author">
                                <div className="bb-review-card__avatar"
                                     style={{ background: r.color }}>
                                    {r.initial}
                                </div>
                                <div>
                                    <div className="bb-review-card__name">{r.name}</div>
                                    <div className="bb-review-card__loc">{r.loc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Customer;
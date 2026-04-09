import React from 'react';

function Card({ img, title, description }) {
    return (
        <div className='container '>
            <div className='row m-2 ps-5'>
                <span><i className={img}></i></span>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default Card;
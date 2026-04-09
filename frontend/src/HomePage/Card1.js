import React from 'react'

function Card1({ img }) {
    return (
        <div style={{ padding: '20px', marginRight: '10px', borderRadius: '5px', border: '2px solid #d2d2d2ff', height: '200px', width: '200px', display: 'flex', justifyContent: 'center' }}>
            <img src={img} style={{ width: '150px', height: '150px' }} />
        </div>
    );
}

export default Card1;
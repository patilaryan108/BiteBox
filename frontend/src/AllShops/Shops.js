import React from "react";
import axios from "axios";//connect to backend

export default function Shops() {
    const [shops, setShops] = React.useState([]);

    React.useEffect(() => {
        axios.get("http://localhost:3001/allShopsModel")
            .then((res) => {
                console.log(res.data);
                setShops(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div className="shop-container">
                <div className="shop-header">
                    <h1>All Shops</h1>
                </div>
                <div className="shop-body">
                    {shops.map((shop) => (
                        <div key={shop.shopid} className="shop-card">
                            <div className="shop-card-header">
                                <h2>{shop.shopname}</h2>
                            </div>
                            <div className="shop-card-body">
                                <p>{shop.shopid}</p>
                                <p>{shop.city}</p>
                                <p>{shop.state}</p>
                                <p>{shop.pin}</p>
                                <p>{shop.phone}</p>
                                <p>{shop.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
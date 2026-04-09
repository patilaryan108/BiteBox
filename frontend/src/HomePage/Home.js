import React from 'react';

import Navbar from '../Navbar';
import Hero from './Hero';
import Dairy from './Dairy';
import Veg from './veg'
import Intro from './Intro'
import Lunch from './Lunch'
import Footer from '../Footer'
import Customer from './Customer'

function Home() {
    return (
        <div className="container ">
            <Navbar />
            <Hero />
            <Intro />
            <Lunch />
            <Dairy />
            <Veg />
            <Customer />
            <Footer />
        </div>
    );
}

export default Home;
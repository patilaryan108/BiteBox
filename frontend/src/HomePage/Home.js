import React from 'react';
import Hero from './Hero';
import Lunch from './Lunch';
import Intro from './Intro';
import Customer from './Customer';
import Footer from '../Footer';

function Home() {
  return (
    <div>
      <Hero />
      <Lunch />
      <Intro />
      <Customer />
      <Footer />
    </div>
  );
}

export default Home;
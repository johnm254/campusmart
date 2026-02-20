import React from 'react';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import SafetyGuide from '../components/home/SafetyGuide';
import WhyCampusMart from '../components/home/WhyCampusMart';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />
            <div className="container">
                <WhyCampusMart />
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse by Category</h2>
                <CategoryGrid />

                <SafetyGuide />
            </div>
        </div>
    );
};

export default Home;

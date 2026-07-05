import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import Services from './Services';
import Products from './Products';
import './Hero.css';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <section className="hero" id="inicio">
      
      <div className="hero-widget-container">
        <div className="hero-tabs">
          <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Tratamientos</button>
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Productos</button>
        </div>
        <div className="hero-widget-content">
          {activeTab === 'services' ? <Services /> : <Products />}
        </div>
      </div>

      <div className="content">
        <p className="small text-gold">BIENVENIDO(A) A NUESTRO ESTUDIO</p>
        <h1 className="font-serif">Patricia<br/>Guillén Valer</h1>
        <h2 className="text-gold">ESTÉTICA & SKIN CARE</h2>
        <h3 className="font-serif">Tu piel. Tu poder.<br/>Tu mejor versión.</h3>
        <p className="lead">Belleza que transforma. Cuidado que perdura.</p>
        
        <div className="actions">
          <a className="btn" href="https://wa.me/51962324552" target="_blank" rel="noopener noreferrer">Agenda tu cita</a>
          <a className="btn2" href="#estudio">Conoce nuestro estudio</a>
        </div>
        
      </div>
      
      <ProfileCard />
    </section>
  );
};

export default Hero;

import React from 'react';
import ProfileCard from './ProfileCard';
import Services from './Services';
import Products from './Products';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <div className="overlay"></div>
      
      <div className="hero-accordions-container">
        <Services />
        <Products />
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

import React from 'react';
import ProfileCard from './ProfileCard';
import Services from './Services';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <div className="overlay"></div>
      <div className="content">
        <p className="small text-gold">BIENVENIDO(A) A NUESTRO ESTUDIO</p>
        <h1 className="font-serif">Patricia<br/>Guillén Valer</h1>
        <h2 className="text-gold">ESTÉTICA & SKIN CARE</h2>
        <h3 className="font-serif" style={{ fontFamily: '"Bona Nova", serif', fontSize: '1.8rem', lineHeight: '1.4' }}>
          Descubre el brillo que llevas dentro, donde florece la belleza y nace la confianza.
        </h3>
        
        <div className="actions">
          <a className="btn" href="https://wa.me/51962324552" target="_blank" rel="noopener noreferrer">Agenda tu cita</a>
          <a className="btn2" href="#estudio">Conoce nuestro estudio</a>
        </div>
      </div>
      
      <Services />
    </section>
  );
};

export default Hero;

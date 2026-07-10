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
        <h3 style={{ 
          fontFamily: '"Great Vibes", cursive', 
          fontSize: 'clamp(3rem, 5vw, 4.5rem)', 
          lineHeight: '1.2', 
          fontWeight: '400', 
          color: '#fff',
          margin: '20px 0',
          padding: '0 10px'
        }}>
          "Descubre el brillo que llevas dentro, donde florece la belleza y nace la confianza."
        </h3>
        
        <div className="actions">
          <a className="btn2" href="#estudio">Conoce nuestro estudio</a>
        </div>
      </div>
      
      <Services />
    </section>
  );
};

export default Hero;

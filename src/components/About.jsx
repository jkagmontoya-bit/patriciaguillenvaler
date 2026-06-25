import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="sobre-mi" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h2 className="section-title font-serif">Sobre Mí</h2>
          <h3 className="text-gold">Especialista en Estética & Skin Care</h3>
          <p>
            He creado este estudio con el propósito de acompañar a las personas en el cuidado consciente de su piel. Creo firmemente que cada piel es única y merece una atención personalizada, basada en la escucha, la confianza y el respeto por sus necesidades individuales.
          </p>
          <p>
            Mi compromiso es ofrecer una experiencia cercana, profesional y humana, permitiendo que cada persona encuentre un espacio donde pueda sentirse cómoda, segura y acompañada.
          </p>
          
          <div className="philosophy-box">
            <h4 className="text-gold">Filosofía</h4>
            <p className="font-serif italic-quote">
              "No se trata únicamente de realizar un tratamiento, sino de construir hábitos de cuidado que puedan mantenerse en el tiempo y generar bienestar real."
            </p>
            <p>
              Cada visita comienza con escucha. Cada protocolo, con respeto por los tiempos de tu piel.
            </p>
          </div>
        </div>

        <div className="brand-identity">
          <h2 className="section-title font-serif">Identidad de Marca</h2>
          <div className="identity-grid">
            <div className="identity-item">
              <span className="number text-gold">01</span>
              <h4>CERCANÍA</h4>
              <p>Trato humano y personalizado. Cada persona, única.</p>
            </div>
            <div className="identity-item">
              <span className="number text-gold">02</span>
              <h4>ELEGANCIA</h4>
              <p>Ambiente y experiencia pensados para tu comodidad.</p>
            </div>
            <div className="identity-item">
              <span className="number text-gold">03</span>
              <h4>BIENESTAR</h4>
              <p>Más allá de la estética; cuidamos tu bienestar integral.</p>
            </div>
            <div className="identity-item">
              <span className="number text-gold">04</span>
              <h4>CONFIANZA</h4>
              <p>Relaciones duraderas basadas en la honestidad profesional.</p>
            </div>
            <div className="identity-item">
              <span className="number text-gold">05</span>
              <h4>CUIDADO CONSCIENTE</h4>
              <p>Tratamientos y productos elegidos con responsabilidad.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

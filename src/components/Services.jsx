import React, { useState } from 'react';
import './Services.css';

const services = [
  {
    title: "Facial Esencial",
    description: "Limpieza profunda, exfoliación y revitalización. El punto de partida ideal para mantener la salud y luminosidad de tu piel."
  },
  {
    title: "Facial Hidratante",
    description: "Recupera la hidratación, elasticidad y frescura natural de tu piel. Ideal para pieles deshidratadas o estresadas."
  },
  {
    title: "Premium con Ácido Hialurónico",
    description: "Protocolo especializado para lograr hidratación profunda, efecto relleno y luminosidad visible desde la primera sesión."
  },
  {
    title: "Premium con Exosomas",
    description: "Tratamiento de última generación. Estimulación celular avanzada que regenera y transforma la piel desde adentro hacia afuera."
  },
  {
    title: "Limpieza Facial Profunda",
    description: "Eliminación de impurezas acumuladas y control del sebo, preparación ideal para absorber tratamientos."
  },
  {
    title: "Evaluación & Diagnóstico",
    description: "Análisis de tu tipo de piel y diseño de una rutina de cuidado adaptada a tus necesidades reales."
  }
];

const Services = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close if already open
    } else {
      setOpenIndex(index); // Open clicked
    }
  };

  return (
    <div className="hero-services-accordion">
      <h3 className="text-gold accordion-main-title">TRATAMIENTOS</h3>
      <h2 className="font-serif accordion-main-subtitle">Especializados</h2>
      
      <div className="accordion-container">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`accordion-item ${openIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="accordion-header">
              <span className="accordion-title font-serif">{service.title}</span>
              <span className="accordion-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            
            <div className={`accordion-content ${openIndex === index ? 'open' : ''}`}>
              <p>{service.description}</p>
              <button 
                className="btn" 
                style={{marginTop: '15px', padding: '8px 15px', fontSize: '0.85rem'}} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.dispatchEvent(new CustomEvent('openBooking', {detail: service.title}));
                }}
              >
                Agendar este tratamiento
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

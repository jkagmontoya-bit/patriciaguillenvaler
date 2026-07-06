import React, { useState } from 'react';
import './Services.css';

const services = [
  {
    title: "Facial Esencial",
    description: "Limpieza profunda, exfoliación y revitalización. El punto de partida ideal para mantener la salud y luminosidad de tu piel en el día a día."
  },
  {
    title: "Facial Hidratante",
    description: "Recupera la hidratación, elasticidad y frescura natural de tu piel. Ideal para pieles deshidratadas o estresadas por factores externos."
  },
  {
    title: "Facial Premium con Ácido Hialurónico",
    description: "Protocolo especializado con ingredientes activos de alta eficacia para lograr una hidratación profunda, efecto relleno y luminosidad visible desde la primera sesión."
  },
  {
    title: "Facial Premium con Exosomas",
    description: "Tratamiento de última generación. Estimulación celular avanzada que regenera, repara y transforma la piel desde adentro hacia afuera."
  },
  {
    title: "Limpieza Facial Profunda",
    description: "Eliminación de impurezas acumuladas, control del sebo y preparación de la piel para absorber mejor cualquier tratamiento posterior."
  },
  {
    title: "Evaluación & Diagnóstico Personalizado",
    description: "Análisis completo de tu tipo de piel y diseño de una rutina de cuidado adaptada a tus necesidades reales, tanto en cabina como en casa."
  }
];

const Services = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="servicios" className="services-section">
      <div className="services-header" style={{ cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-gold">TRATAMIENTOS</h3>
        <h2 className="section-title font-serif">
          Servicios Especializados {isExpanded ? '▲' : '▼'}
        </h2>
        <p className="subtitle">
          Cada servicio ha sido diseñado con protocolos personalizados para las necesidades reales de tu piel.
        </p>
      </div>

      {isExpanded && (
        <>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <h4 className="font-serif">{service.title}</h4>
                <div className="divider"></div>
                <p>{service.description}</p>
                <button 
                  className="btn" 
                  style={{marginTop: '20px', width: '100%'}} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    window.dispatchEvent(new CustomEvent('openBooking', {detail: service.title}));
                  }}
                >
                  Agendar este tratamiento
                </button>
              </div>
            ))}
          </div>
          
          <div className="services-footer">
            <p>Todos los tratamientos incluyen una evaluación inicial personalizada y recomendaciones para el cuidado en casa.</p>
          </div>
        </>
      )}
    </section>
  );
};

export default Services;

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Services.css';

const fallbackServices = [
  { title: "Facial Esencial", description: "Limpieza profunda, exfoliación y revitalización. El punto de partida ideal para mantener la salud y luminosidad de tu piel." },
  { title: "Facial Hidratante", description: "Recupera la hidratación, elasticidad y frescura natural de tu piel. Ideal para pieles deshidratadas o estresadas." },
  { title: "Facial Premium con Ácido Hialurónico", description: "Protocolo especializado para lograr hidratación profunda, efecto relleno y luminosidad visible desde la primera sesión." },
  { title: "Facial Premium con Exosomas", description: "Tratamiento de última generación. Estimulación celular avanzada que regenera y transforma la piel desde adentro hacia afuera." },
  { title: "Limpieza Facial Profunda", description: "Eliminación de impurezas acumuladas y control del sebo, preparación ideal para absorber tratamientos." },
  { title: "Evaluación & Diagnóstico Personalizado", description: "Análisis de tu tipo de piel y diseño de una rutina de cuidado adaptada a tus necesidades reales." }
];

const Services = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "treatments"));
        if (!querySnapshot.empty) {
          const fetched = querySnapshot.docs.map(doc => ({
            title: doc.data().name,
            description: doc.data().description,
            price: doc.data().price
          }));
          setServices(fetched);
        }
      } catch (error) {
        console.error("Error fetching treatments: ", error);
      }
    };
    fetchTreatments();
  }, []);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="hero-services-accordion" id="servicios">
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
              <span className="accordion-title font-serif">
                {service.title}
                {service.price && <span style={{color: '#d3b06d', fontSize: '0.85rem', marginLeft: '10px', fontWeight: 400}}>S/ {service.price.toFixed(2)}</span>}
              </span>
              <span className="accordion-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            
            <div className={`accordion-content ${openIndex === index ? 'open' : ''}`}>
              <p>{service.description}</p>
              <button 
                className="btn" 
                style={{marginTop: '12px', padding: '6px 12px', fontSize: '0.8rem', width: '100%'}} 
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

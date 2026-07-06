import React, { useEffect } from 'react';
import './Pages.css';

const SustainabilityPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="generic-page">
      <h1>Trazabilidad y Sostenibilidad</h1>
      
      <div className="generic-content">
        <h2>Cuidado Consciente</h2>
        <p>
          En Patricia Guillén Valer, todos nuestros tratamientos y productos son elegidos con profunda responsabilidad. Entendemos que el cuidado de la piel debe ser integral, seguro y respetuoso tanto con el cliente como con nuestro entorno.
        </p>

        <h2>Seguridad y Confianza</h2>
        <p>
          Tu tiempo es valioso y tu piel es tu carta de presentación. Garantizamos una atención exclusiva trabajando con protocolos responsables y productos rigurosamente seleccionados. Nuestra prioridad es brindarte resultados reales en un ambiente de total confianza.
        </p>

        <h2>Productos Profesionales</h2>
        <p>
          Trabajamos con <strong>The Ordinary</strong>, reconocida internacionalmente por sus formulaciones científicamente respaldadas, efectivas, accesibles y transparentes. Cada componente es trazable y enfocado en la salud real de la piel sin aditivos innecesarios.
        </p>
        <p>
          Además contamos con una selección de perfumes y fragancias de alta calidad, elegidos para complementar la experiencia sensorial de cada visita. Cada producto disponible en el estudio ha sido escogido con estricto criterio profesional, pensando en la calidad, la seguridad y los resultados reales que puedes esperar.
        </p>

        <div style={{marginTop: '50px', padding: '30px', background: 'rgba(211, 176, 109, 0.05)', border: '1px solid rgba(211, 176, 109, 0.2)', borderRadius: '8px'}}>
          <h3 style={{color: '#d3b06d', marginBottom: '15px', fontFamily: 'serif', fontSize: '1.5rem'}}>Nuestro Compromiso</h3>
          <p style={{marginBottom: 0}}>
            Asegurarnos de que todo lo que aplicamos en tu piel tenga un origen confiable, ingredientes activos demostrados y un impacto positivo en tu bienestar a largo plazo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;

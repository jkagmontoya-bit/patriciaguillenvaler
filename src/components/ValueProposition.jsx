import React from 'react';
import './ValueProposition.css';

const ValueProposition = () => {
  return (
    <section id="estudio" className="value-section">
      <div className="value-container">
        
        <div className="value-header">
          <h3 className="text-gold">DIFERENCIADORES</h3>
          <h2 className="section-title font-serif">Propuesta de Valor</h2>
          <p className="subtitle">
            Una experiencia diferente, donde el cuidado personal va acompañado de confianza, bienestar y profesionalismo. Un espacio tranquilo, organizado y pensado exclusivamente para ti.
          </p>
        </div>

        <div className="value-cards">
          <div className="v-card">
            <h4 className="text-gold">Atención<br/>Personalizada</h4>
            <p>Cada persona recibe un protocolo diseñado para ella.</p>
          </div>
          <div className="v-card">
            <h4 className="text-gold">Solo con<br/>Cita Previa</h4>
            <p>Tu tiempo es valioso. Garantizamos una atención exclusiva.</p>
          </div>
          <div className="v-card">
            <h4 className="text-gold">Seguridad<br/>y Confianza</h4>
            <p>Protocolos responsables y productos seleccionados.</p>
          </div>
        </div>

        <div className="experience-future-grid">
          <div className="experience-box">
            <h3 className="text-gold">VIVENCIA</h3>
            <h2 className="section-title font-serif">Experiencia del Cliente</h2>
            <p>
              Desde el momento en que llegas al estudio, quiero que sientas que has encontrado un espacio pensado para ti. Un lugar donde puedas hacer una pausa real, dejar la rutina diaria y dedicarte un tiempo de calidad.
            </p>
            <p className="font-serif italic-quote" style={{ marginTop: '20px' }}>
              "Quiero que cada persona se sienta bienvenida, escuchada y acompañada."
            </p>
            <p>
              Mi intención es que cada visita sea una experiencia tranquila y personalizada, donde puedas sentirte en confianza para expresar tus necesidades, resolver tus dudas y aprender a conocer mejor tu piel. Aquí no solo cuidamos la apariencia; trabajamos en tu bienestar integral.
            </p>
          </div>

          <div className="future-box">
            <h3 className="text-gold">FUTURO</h3>
            <h2 className="section-title font-serif">Proyección del Estudio</h2>
            <p>
              Mi deseo es que este espacio evolucione y pueda acompañar a más personas, manteniendo siempre la cercanía, la calidad y la atención personalizada que le dan identidad.
            </p>
            <ul className="future-list">
              <li>
                <strong>Más servicios:</strong> Nuevos protocolos especializados según las necesidades del mercado.
              </li>
              <li>
                <strong>Presencia digital:</strong> Web y redes sociales en crecimiento activo.
              </li>
              <li>
                <strong>Comunidad:</strong> Talleres y contenido educativo sobre el cuidado de la piel.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ValueProposition;

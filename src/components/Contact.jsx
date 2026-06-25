import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contacto" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h3 className="text-gold">CONTACTO</h3>
          <h2 className="section-title font-serif">Agenda tu Cita</h2>
          <p className="subtitle">
            La atención se realiza únicamente con cita previa. Simplemente, comunícate por WhatsApp y coordinaremos juntos el día y la hora que mejor se adapten a ti.
          </p>
        </div>

        <div className="contact-table">
          <div className="c-row">
            <div className="c-label text-gold">WHATSAPP</div>
            <div className="c-value">+51 962 324 552</div>
          </div>
          <div className="c-row">
            <div className="c-label text-gold">DIRECCIÓN</div>
            <div className="c-value">Mz. J Lt. 4, Claveles, Lurigancho-Chosica 15464</div>
          </div>
          <div className="c-row">
            <div className="c-label text-gold">ATENCIÓN</div>
            <div className="c-value">Exclusivamente con cita previa</div>
          </div>
          <div className="c-row">
            <div className="c-label text-gold">INSTAGRAM</div>
            <div className="c-value">Próximamente</div>
          </div>
          <div className="c-row">
            <div className="c-label text-gold">WEB</div>
            <div className="c-value">Próximamente</div>
          </div>
        </div>

        <div className="contact-action">
          <a className="btn" href="https://wa.me/51962324552" target="_blank" rel="noopener noreferrer">Agenda tu cita ahora</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;

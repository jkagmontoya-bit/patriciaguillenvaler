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
          <a className="btn" href="https://wa.me/51962324552" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center'}}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{marginRight: '8px'}}>
              <path d="M12.031 0C5.385 0 0 5.388 0 12.04c0 2.128.552 4.195 1.603 6.012L.15 23.411l5.525-1.447A11.96 11.96 0 0 0 12.031 24c6.643 0 12.03-5.388 12.03-12.04C24.062 5.388 18.673 0 12.031 0zm3.922 17.202c-.596 1.688-2.822 2.185-3.826 2.378-1.01.196-2.585.344-4.218-.328-1.344-.555-2.898-1.503-4.526-3.136-1.627-1.631-2.576-3.18-3.128-4.522-.67-1.63-.522-3.203-.324-4.212.195-1.002.695-3.226 2.385-3.82 1.547-.544 2.802-.124 3.25.101.448.225.865.753 1.22 1.487.355.732.553 1.25.752 1.662.199.414.249.782.164 1.134-.085.353-.298.802-.638 1.233-.34.432-.619.684-.798.887-.179.204-.378.432-.178.77.2.338.892 1.464 1.91 2.378 1.018.913 2.146 1.602 2.483 1.802.339.201.568.002.77-.178.204-.179.456-.458.887-.798.431-.34.88-.553 1.234-.638.352-.085.72.035 1.134.164.414.199.93.397 1.662.752.735.355 1.263.772 1.488 1.22.225.448.644 1.703.1 3.25z"/>
            </svg>
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;

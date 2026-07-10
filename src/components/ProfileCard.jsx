import React, { useState } from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <img src="/profile2.png" alt="Patricia Guillén" className="card-img" />
        <div className="card-content" style={{ padding: '25px', textAlign: 'left' }}>
          <h3 style={{ fontFamily: '"Great Vibes", cursive', fontSize: '3rem', color: '#fff', marginBottom: '15px', textAlign: 'center' }}>Bienvenidos</h3>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', lineHeight: '1.6', color: '#fff' }}>
            <p style={{ marginBottom: '12px' }}>
              Es un placer recibirte en este espacio, donde el cuidado de tu piel se une al conocimiento, la dedicación y el respeto.
            </p>
            <p style={{ marginBottom: '12px' }}>
              Cada piel es única y merece una atención personalizada. Mi compromiso es ayudarte a revelar la mejor versión de tu piel con tratamientos pensados para su salud, luminosidad y bienestar.
            </p>
            <p style={{ marginBottom: '15px', fontWeight: '600', color: '#fff' }}>
              Porque cuidar tu piel no es un lujo, es una inversión en ti.
            </p>
            <p style={{ fontStyle: 'italic', color: '#fff', marginBottom: '10px' }}>
              Gracias por confiar en mí. Será un honor acompañarte en este camino hacia una piel sana y radiante.
            </p>
          </div>
          <div className="firma" style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2.2rem', color: '#fff', marginTop: '15px', textAlign: 'right' }}>
            Patricia Guillén
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

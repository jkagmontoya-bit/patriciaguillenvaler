import React, { useState } from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <img src="/patricia.jpg" alt="Patricia Guillén" className="card-img" />
        <div className="card-content" style={{ padding: '25px', textAlign: 'left' }}>
          <h3 style={{ fontFamily: '"Great Vibes", cursive', fontSize: '3rem', color: '#d3b06d', marginBottom: '15px', textAlign: 'center' }}>Bienvenidos</h3>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            <p style={{ marginBottom: '12px' }}>
              Es un placer recibirlos en este espacio, creado para quienes desean cuidar su piel con dedicación, conocimiento y respeto.
            </p>
            <p style={{ marginBottom: '12px' }}>
              Cada piel cuenta una historia y merece una atención personalizada. Mi compromiso es acompañarte con tratamientos pensados para realzar tu belleza natural, fortalecer la salud de tu piel y ayudarte a sentirte bien contigo mismo.
            </p>
            <p style={{ marginBottom: '15px', fontWeight: '600', color: '#222' }}>
              Porque cuidar tu piel no es un lujo, es una inversión en tu bienestar, tu confianza y tu amor propio.
            </p>
            <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '10px' }}>
              Gracias por confiar en mí. Será un honor acompañarte en este camino hacia una piel más sana, luminosa y llena de vida.
            </p>
          </div>
          <div className="firma" style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2.2rem', color: '#d3b06d', marginTop: '15px', textAlign: 'right' }}>
            Con cariño,<br/>Patricia ♥
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

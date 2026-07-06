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
        <div className="card-content">
          <h3 className="font-serif">Hola,</h3>
          <p>Gracias por estar aquí. Estoy feliz de acompañarte en este camino hacia tu mejor versión.</p>
          <div className="firma font-serif">
            Con cariño,<br/>Patricia ♥
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

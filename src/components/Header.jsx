import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BookAppointmentModal from './BookAppointmentModal';
import CartModal from './CartModal';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    const handleOpenBooking = (e) => {
      if (e.detail) {
        setSelectedService(e.detail);
      } else {
        setSelectedService('');
      }
      setIsModalOpen(true);
    };
    window.addEventListener('openBooking', handleOpenBooking);
    return () => window.removeEventListener('openBooking', handleOpenBooking);
  }, []);

  return (
    <header className="header">
      <Link to="/"><img className="logo" src="/LOGO_transparent.png" alt="Patricia Guillén Valer Logo" /></Link>
      <nav className="nav">
        <a href="/#inicio">Inicio</a>
        <a href="/#sobre-mi">Sobre mí</a>
        <a href="/#servicios">Servicios</a>
        <Link to="/productos">Productos</Link>
        <a href="/#estudio">Estudio</a>
        <a href="/#contacto">Contacto</a>
      </nav>
      <div className="header-actions" style={{display: 'flex', alignItems: 'center'}}>
        {user ? (
          <>
            <span className="user-greeting" style={{color: '#d3b06d', marginRight: '15px', fontWeight: 'bold'}}>
              {user.email.split('@')[0]}
            </span>
            <button className="btn2" onClick={logout} style={{cursor: 'pointer'}}>Salir</button>
          </>
        ) : (
          <Link className="btn" to="/login">Acceder</Link>
        )}
      </div>
      <button className="btn2" style={{marginLeft: '15px'}} onClick={() => setIsCartOpen(true)}>
        🛒 ({totalItems})
      </button>
      <button className="btn" style={{marginLeft: '10px'}} onClick={() => setIsModalOpen(true)}>Agenda tu cita</button>
      
      <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialService={selectedService} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;

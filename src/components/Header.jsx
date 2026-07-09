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
  const [isScrolled, setIsScrolled] = useState(false);

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
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('openBooking', handleOpenBooking);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={isScrolled ? 'header scrolled' : 'header'}>
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
              <Link to="/dashboard" className="user-greeting" style={{color: '#d3b06d', marginRight: '15px', fontWeight: 'bold', textDecoration: 'none'}}>
                Mi Cuenta
              </Link>
              <button className="btn2" onClick={logout} style={{cursor: 'pointer'}}>Salir</button>
            </>
          ) : (
            <Link className="btn" to="/login">Acceder</Link>
          )}
          <button className="btn2" style={{marginLeft: '15px'}} onClick={() => setIsCartOpen(true)}>
            🛒 ({totalItems})
          </button>
          <button className="btn" style={{marginLeft: '10px'}} onClick={() => setIsModalOpen(true)}>Agenda tu cita</button>
        </div>
      </header>
      
      <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialService={selectedService} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;

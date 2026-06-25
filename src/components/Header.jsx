import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/"><img className="logo" src="/LOGO_transparent.png" alt="Patricia Guillén Valer Logo" /></Link>
      <nav className="nav">
        <a href="/#inicio">Inicio</a>
        <a href="/#sobre-mi">Sobre mí</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#productos">Productos</a>
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
    </header>
  );
};

export default Header;

import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img className="logo" src="/LOGO_transparent.png" alt="Patricia Guillén Valer Logo" />
      <nav className="nav">
        <a href="#inicio">Inicio</a>
        <a href="#sobre-mi">Sobre mí</a>
        <a href="#servicios">Servicios</a>
        <a href="#productos">Productos</a>
        <a href="#estudio">Estudio</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <a className="btn" href="https://wa.me/51962324552" target="_blank" rel="noopener noreferrer">Agenda tu cita</a>
    </header>
  );
};

export default Header;

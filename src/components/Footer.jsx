import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-item">
        <span role="img" aria-label="Phone">📞</span> +51 962 324 552
      </div>
      <div className="footer-item">
        <span role="img" aria-label="Location">📍</span> Lurigancho - Chosica
      </div>
      <div className="footer-item">
        Instagram • Facebook
      </div>
    </footer>
  );
};

export default Footer;

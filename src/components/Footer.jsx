import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-mega">
      <div className="footer-container">
        
        <div className="footer-column">
          <h4>NUESTRA EMPRESA</h4>
          <ul>
            <li><Link to="/acerca-de">Acerca de</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>CATEGORÍAS</h4>
          <ul>
            <li><a href="/productos">Hidratación & Humectación</a></li>
            <li><a href="/productos">Líneas finas y arrugas</a></li>
            <li><a href="/productos">Masajes faciales</a></li>
            <li><a href="/productos">Necesidades</a></li>
            <li><a href="/productos">Pack Make Up</a></li>
            <li><a href="/productos">Skincare</a></li>
            <li><a href="/productos">Rostro</a></li>
            <li><a href="/productos">Tratamientos</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>PARA USTEDES</h4>
          <ul>
            <li><a href="/#">Ofertas</a></li>
            <li><a href="/#">Novedades</a></li>
            <li><a href="/#">Los más vendidos</a></li>
            <li><a href="/#">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>INFORMACIÓN</h4>
          <ul>
            <li><a href="/#">Delivery</a></li>
            <li><a href="/#">Política de Cambios y Devoluciones</a></li>
            <li><a href="/#">Preguntas frecuentes</a></li>
            <li><a href="/#">Políticas de Privacidad y Cookies</a></li>
            <li><a href="/#">Términos y Condiciones</a></li>
          </ul>
        </div>
        
        <div className="footer-column contact-col">
          <h4>CONTACTO</h4>
          <p>📞 +51 962 324 552</p>
          <p>✉️ ventas@patriciaguillen.pe</p>
          <div className="social-icons">
            <span>f</span> 
            <span>IG</span> 
            <span>YT</span>
          </div>
          <div className="libro-reclamaciones">
            <div style={{border: '1px solid #d3b06d', padding: '10px', textAlign: 'center', background: '#fff', color: '#000', borderRadius: '4px', cursor: 'pointer', maxWidth: '180px', marginTop: '20px', fontWeight: 'bold'}}>
              <span style={{color: '#0066cc'}}>Libro de Reclamaciones</span>
              <br/>
              📖
            </div>
          </div>
        </div>
        
      </div>
      <div style={{textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '0.85rem'}}>
        © {new Date().getFullYear()} Patricia Guillén Valer. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;

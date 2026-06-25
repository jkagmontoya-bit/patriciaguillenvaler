import React from 'react';
import './Products.css';

const Products = () => {
  return (
    <section id="productos" className="products-section">
      <div className="products-container">
        
        <div className="products-text">
          <h3 className="text-gold">PRODUCTOS</h3>
          <h2 className="section-title font-serif">Productos Profesionales</h2>
          
          <p>
            Trabajamos con <strong>The Ordinary</strong>, marca reconocida internacionalmente por sus formulaciones científicamente respaldadas, efectivas y accesibles. 
          </p>
          <p>
            Además, contamos con una selección de <strong>perfumes y fragancias</strong> de alta calidad, elegidos para complementar la experiencia sensorial de cada visita.
          </p>
          <p>
            Cada producto disponible en el estudio ha sido escogido con criterio profesional, pensando en la calidad, la seguridad y los resultados reales que puedes esperar.
          </p>
        </div>

        <div className="products-image">
          {/* We can use the vela.jpg or another image to represent products */}
          <img src="/ordinary.jpg" alt="Productos The Ordinary" />
        </div>

      </div>
    </section>
  );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Products.css';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([
    // Fallback static products in case database is empty
    { id: '1', name: 'Niacinamide 10% + Zinc 1%', price: 45.00, stock: 10, image: '/ordinary.jpg' },
    { id: '2', name: 'Hyaluronic Acid 2% + B5', price: 48.00, stock: 15, image: '/ordinary.jpg' },
    { id: '3', name: 'AHA 30% + BHA 2% Peeling Solution', price: 55.00, stock: 8, image: '/ordinary.jpg' }
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        if (!querySnapshot.empty) {
          const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching inventory for store: ", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="productos" className="products-section">
      <div className="products-container" style={{marginBottom: '50px'}}>
        <div className="products-text">
          <h3 className="text-gold">PRODUCTOS</h3>
          <h2 className="section-title font-serif">Productos Profesionales</h2>
          <p>
            Trabajamos con <strong>The Ordinary</strong>, marca reconocida internacionalmente por sus formulaciones científicamente respaldadas, efectivas y accesibles. 
          </p>
          <p>
            Cada producto disponible en el estudio ha sido escogido con criterio profesional, pensando en la calidad, la seguridad y los resultados reales que puedes esperar.
          </p>
        </div>
        <div className="products-image">
          <img src="/ordinary.jpg" alt="Productos The Ordinary" />
        </div>
      </div>

      {/* Grid de Productos Comprables */}
      <div className="store-grid" style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {products.map(product => (
          <div key={product.id} className="store-card" style={{
            background: '#110d0a', 
            border: '1px solid rgba(211, 176, 109, 0.2)', 
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <img src={product.image || '/ordinary.jpg'} alt={product.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px'}} />
            <h4 style={{fontSize: '1.1rem', marginBottom: '10px'}}>{product.name}</h4>
            <p className="text-gold" style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px'}}>S/ {product.price.toFixed(2)}</p>
            <button className="btn" style={{width: '100%'}} onClick={() => addToCart(product)} disabled={product.stock <= 0}>
              {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;

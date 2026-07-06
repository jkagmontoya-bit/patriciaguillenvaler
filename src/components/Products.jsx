import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Products.css';

const Products = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="public-modal-overlay">
      <div className="public-modal-content" style={{maxWidth: '1000px', width: '90%', maxHeight: '90vh', overflowY: 'auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px'}}>
          <div className="products-text">
            <h3 className="text-gold" style={{letterSpacing: '3px', fontSize: '0.9rem', marginBottom: '10px'}}>PRODUCTOS</h3>
            <h2 className="section-title font-serif" style={{fontSize: '2.5rem', marginBottom: '15px'}}>Productos Profesionales</h2>
            <p style={{color: '#bbb', marginBottom: '15px'}}>
              Trabajamos con <strong>The Ordinary</strong>, marca reconocida internacionalmente por sus formulaciones científicamente respaldadas, efectivas y accesibles. 
            </p>
            <p style={{color: '#bbb'}}>
              Cada producto disponible en el estudio ha sido escogido con criterio profesional, pensando en la calidad, la seguridad y los resultados reales que puedes esperar.
            </p>
          </div>
          <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', padding: '0 15px'}}>&times;</button>
        </div>

        <div className="store-grid" style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product.id} className="store-card" style={{
              background: 'rgba(25, 20, 15, 0.4)', 
              border: '1px solid rgba(211, 176, 109, 0.2)', 
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <img src={product.image || '/ordinary.jpg'} alt={product.name} style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px'}} />
              <h4 className="font-serif" style={{fontSize: '1.2rem', marginBottom: '10px'}}>{product.name}</h4>
              <p className="text-gold" style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px'}}>S/ {product.price.toFixed(2)}</p>
              <button className="btn" style={{width: '100%', padding: '10px'}} onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

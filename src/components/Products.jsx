import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Products.css';

const Products = () => {
  const [openIndex, setOpenIndex] = useState(null);
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

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="hero-services-accordion" id="productos">
      <h3 className="text-gold accordion-main-title">PRODUCTOS</h3>
      <h2 className="font-serif accordion-main-subtitle">Profesionales</h2>
      
      <div className="accordion-container">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`accordion-item ${openIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="accordion-header">
              <span className="accordion-title font-serif" style={{ fontSize: '0.95rem' }}>{product.name}</span>
              <span className="accordion-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            
            <div className={`accordion-content ${openIndex === index ? 'open' : ''}`} style={{ maxHeight: openIndex === index ? '150px' : '0' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px', paddingBottom: '10px' }}>
                <img src={product.image || '/ordinary.jpg'} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <p className="text-gold" style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>S/ {product.price.toFixed(2)}</p>
                  <button 
                    className="btn" 
                    style={{ padding: '6px 15px', fontSize: '0.8rem', width: 'auto' }} 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

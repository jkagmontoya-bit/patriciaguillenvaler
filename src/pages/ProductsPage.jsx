import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './ProductsPage.css';

const categories = [
  "Todo",
  "Skincare",
  "Limpieza",
  "Tratamientos",
  "Hidratación",
  "Protector Solar",
  "Packs"
];

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([
    { id: '1', name: 'Niacinamide 10% + Zinc 1%', price: 45.00, stock: 10, image: '/ordinary.jpg', category: 'Tratamientos' },
    { id: '2', name: 'Hyaluronic Acid 2% + B5', price: 48.00, stock: 15, image: '/ordinary.jpg', category: 'Hidratación' },
    { id: '3', name: 'AHA 30% + BHA 2% Peeling Solution', price: 55.00, stock: 8, image: '/ordinary.jpg', category: 'Tratamientos' }
  ]);
  const [activeCategory, setActiveCategory] = useState('Todo');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
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

  const filteredProducts = activeCategory === 'Todo' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="products-page">
      <div className="products-page-header">
        <h1 className="font-serif">Productos Profesionales</h1>
        <p>The Ordinary & Más - Resultados clínicamente probados</p>
      </div>

      <div className="products-page-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <h3 className="font-serif sidebar-title">Categorías</h3>
          <ul className="category-list">
            {categories.map((cat, idx) => (
              <li 
                key={idx} 
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span className="plus-icon">{activeCategory === cat ? '−' : '+'}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="products-main">
          <div className="products-main-toolbar">
            <h2 className="font-serif" style={{fontWeight: 400, fontSize: '2.5rem', margin: 0}}>{activeCategory}</h2>
            <div className="toolbar-controls">
              <span className="text-gold" style={{marginRight: '20px'}}>{filteredProducts.length} productos</span>
              <select className="sort-select">
                <option>Ordenar por: Relevancia</option>
                <option>Menor a Mayor Precio</option>
                <option>Mayor a Menor Precio</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="products-card">
                <div className="products-card-img-wrapper">
                  <img src={product.image || '/ordinary.jpg'} alt={product.name} />
                </div>
                <h4 className="font-serif">{product.name}</h4>
                <p className="price">S/ {product.price.toFixed(2)}</p>
                <button 
                  className="btn" 
                  onClick={() => addToCart(product)} 
                  disabled={product.stock <= 0}
                  style={{width: '100%', marginTop: '10px'}}
                >
                  {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                </button>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div style={{textAlign: 'center', padding: '50px', color: '#888'}}>
              No hay productos en esta categoría por el momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

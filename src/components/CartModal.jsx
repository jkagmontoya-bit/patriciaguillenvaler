import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  if (!isOpen) return null;

  const handleCheckout = () => {
    window.location.href = "https://www.loubotanicals.pe/pedido";
  };

  // Para el diseño solicitado, mostraremos el último producto añadido en detalle,
  // y el resumen del carrito a la derecha.
  const lastItem = cart.length > 0 ? cart[cart.length - 1] : null;

  return (
    <div className="public-modal-overlay">
      <div className="public-modal-content" style={{maxWidth: '850px', width: '90%', padding: 0, overflow: 'hidden'}}>
        
        <div style={{padding: '20px 30px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{fontSize: '1.4rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{color: '#28a745'}}>✓</span> Producto añadido correctamente a su carrito de compra
          </h2>
          <button onClick={onClose} style={{background: 'none', border: 'none', color: '#999', fontSize: '2rem', cursor: 'pointer', lineHeight: 1}}>&times;</button>
        </div>

        {cart.length === 0 ? (
           <p style={{textAlign: 'center', padding: '40px', color: '#aaa'}}>Tu carrito está vacío.</p>
        ) : (
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            
            {/* Lado Izquierdo: Detalles del Producto */}
            <div style={{flex: '1 1 300px', padding: '30px', borderRight: '1px solid #333', display: 'flex', gap: '20px'}}>
              <div style={{width: '120px', height: '120px', backgroundColor: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {lastItem?.image ? (
                  <img src={lastItem.image} alt={lastItem.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                ) : (
                  <span style={{fontSize: '3rem'}}>🧴</span>
                )}
              </div>
              <div style={{flex: 1}}>
                <h3 style={{fontSize: '1rem', textTransform: 'uppercase', marginBottom: '10px', color: '#eee'}}>{lastItem?.name}</h3>
                <p style={{fontSize: '1.1rem', marginBottom: '15px', color: '#d3b06d'}}>S/ {lastItem?.price?.toFixed(2)}</p>
                <p style={{color: '#aaa', fontSize: '0.9rem'}}>Cantidad: {lastItem?.quantity}</p>
              </div>
            </div>

            {/* Lado Derecho: Resumen */}
            <div style={{flex: '1 1 300px', padding: '30px', display: 'flex', flexDirection: 'column'}}>
              <p style={{marginBottom: '20px', fontSize: '1.05rem'}}><strong>Tienes {cart.length} producto{cart.length !== 1 ? 's' : ''} en tu carrito.</strong></p>
              
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#ccc', fontSize: '0.95rem'}}>
                <span>Subtotal</span>
                <span><strong>S/ {cartTotal.toFixed(2)}</strong></span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#ccc', fontSize: '0.95rem', paddingBottom: '15px', borderBottom: '1px dashed #444'}}>
                <span>Transporte</span>
                <span><strong>Por confirmar</strong></span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '1.1rem'}}>
                <span>Total (impuestos inc.)</span>
                <span className="text-gold"><strong>S/ {cartTotal.toFixed(2)}</strong></span>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto'}}>
                <button 
                  onClick={onClose}
                  style={{padding: '15px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', transition: '0.3s'}}
                  onMouseOver={(e) => e.target.style.background = '#444'}
                  onMouseOut={(e) => e.target.style.background = '#333'}
                >
                  CONTINUAR COMPRANDO
                </button>
                <button 
                  onClick={handleCheckout}
                  style={{padding: '15px', background: '#d3b06d', color: '#111', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', transition: '0.3s'}}
                  onMouseOver={(e) => e.target.style.background = '#c7a450'}
                  onMouseOut={(e) => e.target.style.background = '#d3b06d'}
                >
                  COMPRAR AHORA
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

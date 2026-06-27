import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para procesar tu compra.");
      return;
    }
    
    setLoading(true);
    try {
      const sale = {
        userId: user.uid,
        userEmail: user.email,
        items: cart,
        total: cartTotal,
        date: serverTimestamp(),
        status: 'Pagado' // Simplificado para este ERP Lite
      };
      
      await addDoc(collection(db, "sales"), sale);
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      alert("Error procesando el checkout.");
    }
    setLoading(false);
  };

  return (
    <div className="public-modal-overlay">
      <div className="public-modal-content" style={{maxWidth: '500px'}}>
        {success ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <h3 style={{color: '#d3b06d', marginBottom: '15px'}}>¡Compra Exitosa!</h3>
            <p>Se ha registrado la venta y se descontará del inventario.</p>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 className="font-serif text-gold">Tu Carrito</h3>
              <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
            </div>
            
            {cart.length === 0 ? (
              <p style={{textAlign: 'center', padding: '20px'}}>Tu carrito está vacío.</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {cart.map(item => (
                  <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
                    <div>
                      <h4 style={{fontSize: '1rem', marginBottom: '5px'}}>{item.name}</h4>
                      <p style={{color: '#aaa', fontSize: '0.9rem'}}>S/ {item.price} x {item.quantity}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>+</button>
                      <button onClick={() => removeFromCart(item.id)} style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', marginLeft: '10px'}}>Eliminar</button>
                    </div>
                  </div>
                ))}
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold'}}>
                  <span>Total:</span>
                  <span className="text-gold">S/ {cartTotal.toFixed(2)}</span>
                </div>
                
                <button onClick={handleCheckout} className="btn" disabled={loading} style={{marginTop: '15px', width: '100%'}}>
                  {loading ? 'Procesando...' : 'Finalizar Compra'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;

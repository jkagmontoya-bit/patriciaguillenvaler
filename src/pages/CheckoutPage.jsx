import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    department: '',
    province: '',
    district: '',
    address: '',
    reference: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    setLoading(true);
    try {
      const sale = {
        userId: user?.uid || 'guest',
        customerInfo: formData,
        items: cart,
        total: cartTotal,
        date: serverTimestamp(),
        status: 'Pendiente de Pago'
      };
      
      await addDoc(collection(db, "sales"), sale);
      clearCart();
      alert("¡Pedido realizado con éxito! Nos contactaremos contigo.");
      navigate('/');
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error procesando el pedido.");
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 20px'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '20px', fontFamily: '"Cormorant Garamond", serif', color: '#d3b06d'}}>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/productos')} className="btn" style={{padding: '12px 25px', background: '#d3b06d', color: '#111', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          VOLVER A LA TIENDA
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '100px 5%', minHeight: '100vh', background: '#090909', color: '#fff', fontFamily: 'Montserrat, sans-serif'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '50px'}}>
        
        {/* Lado Izquierdo - Formulario */}
        <div style={{flex: '1 1 600px'}}>
          <h2 style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#d3b06d', marginBottom: '30px'}}>Checkout</h2>
          
          <form onSubmit={handlePlaceOrder} style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
            {/* Datos de Contacto */}
            <div style={{background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '8px', border: '1px solid #222'}}>
              <h3 style={{fontSize: '1.2rem', marginBottom: '20px', color: '#eee'}}>1. Datos de Contacto</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo Electrónico" style={inputStyle} />
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombres" style={{...inputStyle, flex: 1, minWidth: '200px'}} />
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" style={{...inputStyle, flex: 1, minWidth: '200px'}} />
                </div>
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                  <input required type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI / CE" style={{...inputStyle, flex: 1, minWidth: '200px'}} />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono / Celular" style={{...inputStyle, flex: 1, minWidth: '200px'}} />
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div style={{background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '8px', border: '1px solid #222'}}>
              <h3 style={{fontSize: '1.2rem', marginBottom: '20px', color: '#eee'}}>2. Dirección de Envío</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                  <input required type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Departamento" style={{...inputStyle, flex: 1, minWidth: '150px'}} />
                  <input required type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Provincia" style={{...inputStyle, flex: 1, minWidth: '150px'}} />
                  <input required type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Distrito" style={{...inputStyle, flex: 1, minWidth: '150px'}} />
                </div>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Dirección exacta (Calle, Nro, Dpto)" style={inputStyle} />
                <input type="text" name="reference" value={formData.reference} onChange={handleChange} placeholder="Referencia" style={inputStyle} />
              </div>
            </div>

            {/* Método de Pago */}
            <div style={{background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '8px', border: '1px solid #222'}}>
              <h3 style={{fontSize: '1.2rem', marginBottom: '20px', color: '#eee'}}>3. Método de Pago</h3>
              <div style={{padding: '15px', border: '1px solid #d3b06d', borderRadius: '4px', background: 'rgba(211, 176, 109, 0.1)', color: '#d3b06d'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input type="radio" checked readOnly style={{accentColor: '#d3b06d'}} />
                  <span>Transferencia Bancaria / Yape / Plin</span>
                </label>
              </div>
              <p style={{marginTop: '15px', fontSize: '0.9rem', color: '#aaa', lineHeight: '1.5'}}>
                Al finalizar el pedido, te mostraremos los números de cuenta y códigos QR. Tu pedido será procesado una vez confirmado el abono.
              </p>
            </div>

            <button type="submit" disabled={loading} style={{
              background: '#d3b06d', color: '#111', padding: '20px', fontSize: '1.1rem', fontWeight: 'bold', 
              border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              {loading ? 'Procesando...' : 'Finalizar Pedido'}
            </button>
            
          </form>
        </div>

        {/* Lado Derecho - Resumen */}
        <div style={{flex: '1 1 350px'}}>
          <div style={{position: 'sticky', top: '100px', background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '8px', border: '1px solid #222'}}>
            <h3 style={{fontSize: '1.3rem', marginBottom: '25px', color: '#d3b06d', borderBottom: '1px solid #333', paddingBottom: '15px'}}>Resumen del Pedido</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px'}}>
              {cart.map(item => (
                <div key={item.id} style={{display: 'flex', gap: '15px'}}>
                  <div style={{width: '60px', height: '60px', background: '#222', borderRadius: '4px', overflow: 'hidden'}}>
                     {item.image ? <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>🧴</div>}
                  </div>
                  <div style={{flex: 1}}>
                    <h4 style={{fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '5px', color: '#eee'}}>{item.name}</h4>
                    <p style={{color: '#aaa', fontSize: '0.85rem'}}>Cant: {item.quantity}</p>
                  </div>
                  <div style={{fontWeight: 'bold'}}>
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#aaa', fontSize: '0.95rem'}}>
              <span>Subtotal</span>
              <span>S/ {cartTotal.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#aaa', fontSize: '0.95rem', paddingBottom: '20px', borderBottom: '1px solid #333'}}>
              <span>Costo de Envío</span>
              <span>Por calcular</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#d3b06d'}}>
              <span>Total</span>
              <span>S/ {cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const inputStyle = {
  padding: '15px',
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '4px',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  outline: 'none'
};

export default CheckoutPage;

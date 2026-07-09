import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(
      collection(db, 'sales'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar localmente por fecha descendente
      ordersData.sort((a, b) => b.date?.toDate() - a.date?.toDate());
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', color: '#333', padding: '100px 5%', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#111', margin: 0 }}>Mi Cuenta</h1>
            <p style={{ color: '#666', marginTop: '5px' }}>Hola, {user?.displayName || user?.email || 'Usuario'}</p>
          </div>
          <button 
            onClick={logout}
            style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            Historial de Compras
          </h2>

          {loading ? (
            <p>Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
              <p>Aún no has realizado ninguna compra.</p>
              <a href="/productos" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', background: '#d3b06d', color: '#111', textDecoration: 'none', fontWeight: 'bold' }}>
                IR A LA TIENDA
              </a>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '15px' }}>ID Pedido</th>
                    <th style={{ padding: '15px' }}>Fecha</th>
                    <th style={{ padding: '15px' }}>Total</th>
                    <th style={{ padding: '15px' }}>Método Envío</th>
                    <th style={{ padding: '15px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>#{order.id.slice(0,6).toUpperCase()}</td>
                      <td style={{ padding: '15px' }}>{order.date ? order.date.toDate().toLocaleDateString('es-PE') : 'N/A'}</td>
                      <td style={{ padding: '15px' }}>S/ {order.total?.toFixed(2)}</td>
                      <td style={{ padding: '15px', textTransform: 'capitalize' }}>{order.customerInfo?.metodoEnvio || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          background: order.status === 'Pagado' ? '#e6f4ea' : '#fef7e0', 
                          color: order.status === 'Pagado' ? '#1e8e3e' : '#b06000',
                          padding: '5px 10px', 
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {order.status || 'Pendiente de Pago'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;

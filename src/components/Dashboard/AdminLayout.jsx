import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './AdminLayout.css';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const [alerts, setAlerts] = useState({ count: 0, critical: 0, text: '' });

  useEffect(() => {
    const checkExpiry = async () => {
      try {
        const snap = await getDocs(collection(db, "inventory"));
        let count = 0;
        let critical = 0; // Vencidos
        const today = new Date();
        today.setHours(0,0,0,0);
        
        snap.forEach(doc => {
          const data = doc.data();
          if (data.expiryDate) {
            const [y, m, d] = data.expiryDate.split('-');
            const expDate = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
              critical++;
            } else if (diffDays <= 90) { // 3 meses
              count++;
            }
          }
        });

        if (critical > 0) {
          setAlerts({ count, critical, text: `¡ATENCIÓN! Tienes ${critical} producto(s) VENCIDO(S) en stock. Revisa el Inventario.` });
        } else if (count > 0) {
          setAlerts({ count, critical, text: `Aviso: Tienes ${count} producto(s) que vencerán en los próximos 3 meses.` });
        } else {
          setAlerts({ count: 0, critical: 0, text: '' });
        }
      } catch (error) {
        console.error("Error checking expiry: ", error);
      }
    };
    checkExpiry();
  }, []); // Run only once on mount

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/LOGO_transparent.png" alt="PGV Logo" />
          <h2 className="font-serif">ERP Lite</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`} onClick={() => setActiveTab('citas')}>🗓️ Citas</button>
          <button className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setActiveTab('inventario')}>📦 Inventario</button>
          <button className={`nav-item ${activeTab === 'ventas' ? 'active' : ''}`} onClick={() => setActiveTab('ventas')}>💰 Ventas</button>
          <button className={`nav-item ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>🛒 Compras</button>
          <button className={`nav-item ${activeTab === 'contabilidad' ? 'active' : ''}`} onClick={() => setActiveTab('contabilidad')}>📊 Contabilidad</button>
          <div style={{height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0'}}></div>
          <button className={`nav-item ${activeTab === 'tratamientos' ? 'active' : ''}`} onClick={() => setActiveTab('tratamientos')}>💆 Tratamientos</button>
          <button className={`nav-item ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>🛍️ Productos</button>
          <button className={`nav-item ${activeTab === 'disponibilidad' ? 'active' : ''}`} onClick={() => setActiveTab('disponibilidad')}>📅 Disponibilidad</button>
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/" className="btn-outline" style={{width: '100%', marginBottom: '10px', textAlign: 'center'}}>Ir a Web</Link>
          <button onClick={logout} className="btn2" style={{width: '100%'}}>Salir</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-header">
          <h1 className="font-serif text-gold">Dashboard Administrativo</h1>
          <div className="admin-user-info">
            <span>{user?.email}</span>
          </div>
        </header>
        
        {/* ALERT BANNER */}
        {alerts.text && (
          <div style={{ 
            background: alerts.critical > 0 ? '#ff4d4d' : '#ffcc00', 
            color: alerts.critical > 0 ? '#fff' : '#000', 
            padding: '12px 20px', 
            fontWeight: 'bold', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ {alerts.text}</span>
            <button 
              onClick={() => setActiveTab('productos')} 
              style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'inherit', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Ir a revisar
            </button>
          </div>
        )}

        <div className="admin-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

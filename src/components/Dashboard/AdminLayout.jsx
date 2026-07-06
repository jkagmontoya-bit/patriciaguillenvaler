import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/LOGO_transparent.png" alt="PGV Logo" />
          <h2 className="font-serif">ERP Lite</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`}
            onClick={() => setActiveTab('citas')}
          >
            🗓️ Citas
          </button>
          <button 
            className={`nav-item ${activeTab === 'inventario' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventario')}
          >
            📦 Inventario
          </button>
          <button 
            className={`nav-item ${activeTab === 'ventas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ventas')}
          >
            💰 Ventas
          </button>
          <button 
            className={`nav-item ${activeTab === 'compras' ? 'active' : ''}`}
            onClick={() => setActiveTab('compras')}
          >
            🛒 Compras
          </button>
          <button 
            className={`nav-item ${activeTab === 'contabilidad' ? 'active' : ''}`}
            onClick={() => setActiveTab('contabilidad')}
          >
            📊 Contabilidad
          </button>
          <div style={{height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0'}}></div>
          <button 
            className={`nav-item ${activeTab === 'tratamientos' ? 'active' : ''}`}
            onClick={() => setActiveTab('tratamientos')}
          >
            💆 Tratamientos
          </button>
          <button 
            className={`nav-item ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            🛍️ Productos
          </button>
          <button 
            className={`nav-item ${activeTab === 'disponibilidad' ? 'active' : ''}`}
            onClick={() => setActiveTab('disponibilidad')}
          >
            📅 Disponibilidad
          </button>
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
        <div className="admin-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

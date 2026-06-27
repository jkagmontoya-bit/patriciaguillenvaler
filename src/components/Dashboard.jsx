import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from './Dashboard/AdminLayout';
import AppointmentsTable from './Dashboard/AppointmentsTable';
import InventoryTable from './Dashboard/InventoryTable';
import SalesTable from './Dashboard/SalesTable';
import PurchasesTable from './Dashboard/PurchasesTable';
import AccountingReport from './Dashboard/AccountingReport';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('citas');

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Verificar si es administrador
  if (user.email === 'jkag.montoya@gmail.com') {
    return (
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'citas' && <AppointmentsTable />}
        {activeTab === 'inventario' && <InventoryTable />}
        {activeTab === 'ventas' && <SalesTable />}
        {activeTab === 'compras' && <PurchasesTable />}
        {activeTab === 'contabilidad' && <AccountingReport />}
      </AdminLayout>
    );
  }

  // Si no es administrador, mostrar pantalla de clientes
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090909', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <h1 className="font-serif text-gold" style={{ fontSize: '3rem', marginBottom: '20px' }}>¡Bienvenido(a)!</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
        Estamos trabajando en tu panel de cliente privado. Pronto podrás ver tu historial de compras y tratamientos.
      </p>
      <img src="/LOGO_transparent.png" alt="PGV Logo" style={{ width: '150px', marginTop: '40px', opacity: 0.5 }} />
      <button 
        className="btn" 
        style={{ marginTop: '30px' }}
        onClick={() => window.location.href = '/'}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Dashboard;

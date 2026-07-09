import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from './Dashboard/AdminLayout';
import AppointmentsTable from './Dashboard/AppointmentsTable';
import InventoryTable from './Dashboard/InventoryTable';
import SalesTable from './Dashboard/SalesTable';
import PurchasesTable from './Dashboard/PurchasesTable';
import AccountingReport from './Dashboard/AccountingReport';
import TreatmentsManager from './Dashboard/TreatmentsManager';
import ProductsManager from './Dashboard/ProductsManager';
import AvailabilityManager from './Dashboard/AvailabilityManager';
import CustomerDashboard from './Dashboard/CustomerDashboard';

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
        <div style={{ display: activeTab === 'citas' ? 'block' : 'none' }}><AppointmentsTable /></div>
        <div style={{ display: activeTab === 'inventario' ? 'block' : 'none' }}><InventoryTable /></div>
        <div style={{ display: activeTab === 'ventas' ? 'block' : 'none' }}><SalesTable /></div>
        <div style={{ display: activeTab === 'compras' ? 'block' : 'none' }}><PurchasesTable /></div>
        <div style={{ display: activeTab === 'contabilidad' ? 'block' : 'none' }}><AccountingReport /></div>
        <div style={{ display: activeTab === 'tratamientos' ? 'block' : 'none' }}><TreatmentsManager /></div>
        <div style={{ display: activeTab === 'productos' ? 'block' : 'none' }}><ProductsManager /></div>
        <div style={{ display: activeTab === 'disponibilidad' ? 'block' : 'none' }}><AvailabilityManager /></div>
      </AdminLayout>
    );
  }

  // Si no es administrador, mostrar pantalla de clientes
  return <CustomerDashboard />;
};

export default Dashboard;

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
        {activeTab === 'citas' && <AppointmentsTable />}
        {activeTab === 'inventario' && <InventoryTable />}
        {activeTab === 'ventas' && <SalesTable />}
        {activeTab === 'compras' && <PurchasesTable />}
        {activeTab === 'contabilidad' && <AccountingReport />}
        {activeTab === 'tratamientos' && <TreatmentsManager />}
        {activeTab === 'productos' && <ProductsManager />}
        {activeTab === 'disponibilidad' && <AvailabilityManager />}
      </AdminLayout>
    );
  }

  // Si no es administrador, mostrar pantalla de clientes
  return <CustomerDashboard />;
};

export default Dashboard;

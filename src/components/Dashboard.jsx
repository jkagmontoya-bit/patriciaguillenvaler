import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#090909', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <h1 className="font-serif text-gold" style={{ fontSize: '3rem', marginBottom: '20px' }}>¡Bienvenido(a)!</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
        Estamos trabajando en el panel de administración privado. Pronto habrá más novedades aquí.
      </p>
      <img src="/LOGO_transparent.png" alt="PGV Logo" style={{ width: '150px', marginTop: '40px', opacity: 0.5 }} />
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import './AppointmentsTable.css';

const AppointmentsTable = () => {
  // Datos de ejemplo por ahora. Luego los conectaremos a Firebase.
  const [appointments, setAppointments] = useState([
    { id: 1, client: 'María López', service: 'Facial Esencial', date: '2026-06-28', time: '10:00 AM', status: 'Pendiente' },
    { id: 2, client: 'Ana García', service: 'Tratamiento Premium', date: '2026-06-28', time: '02:00 PM', status: 'Confirmada' },
  ]);

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Gestión de Citas</h3>
        <button className="btn" style={{padding: '8px 15px', fontSize: '0.9rem'}}>+ Nueva Cita Manual</button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.client}</td>
                <td>{appt.service}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  <span className={`status-badge ${appt.status.toLowerCase()}`}>
                    {appt.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn view">Ver</button>
                  <button className="action-btn edit">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;

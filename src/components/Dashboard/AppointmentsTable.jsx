import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './AppointmentsTable.css';

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client: '', service: '', date: '', time: '', status: 'Pendiente' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort upcoming first
      items.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
      setAppointments(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "appointments"), formData);
      setShowModal(false);
      setFormData({ client: '', service: '', date: '', time: '', status: 'Pendiente' });
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar esta cita?')) {
      try {
        await deleteDoc(doc(db, "appointments", id));
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Gestión de Citas</h3>
        <button className="btn" onClick={() => setShowModal(true)} style={{padding: '8px 15px', fontSize: '0.9rem'}}>+ Nueva Cita</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h4>Agendar Cita</h4>
            <form onSubmit={handleSave}>
              <input type="text" placeholder="Nombre del Cliente" required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
              <input type="text" placeholder="Servicio" required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando citas...</p> : (
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
              {appointments.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No hay citas registradas</td></tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.client}</td>
                    <td>{appt.service}</td>
                    <td>{appt.date}</td>
                    <td>{appt.time}</td>
                    <td>
                      <select 
                        value={appt.status} 
                        onChange={(e) => updateStatus(appt.id, e.target.value)}
                        className={`status-select ${appt.status.toLowerCase()}`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Completada">Completada</option>
                      </select>
                    </td>
                    <td>
                      <button className="action-btn delete" onClick={() => handleDelete(appt.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppointmentsTable;

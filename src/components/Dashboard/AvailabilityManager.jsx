import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const AvailabilityManager = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "availability"));
      const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by date then startTime
      items.sort((a, b) => {
        if (a.date === b.date) return (a.startTime || '').localeCompare(b.startTime || '');
        return (a.date || '').localeCompare(b.date || '');
      });
      setSlots(items);
    } catch (error) {
      console.error("Error fetching availability: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "availability"), {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      setShowModal(false);
      setFormData({ date: '', startTime: '', endTime: '' });
      fetchSlots();
    } catch (error) {
      console.error("Error saving availability: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este horario?')) {
      try {
        await deleteDoc(doc(db, "availability", id));
        fetchSlots();
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return `${days[dateObj.getDay()]} ${d}/${m}/${y}`;
  };

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dateStr.split('-');
    const slotDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return slotDate < today;
  };

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Gestión de Disponibilidad</h3>
        <button className="btn" onClick={() => setShowModal(true)}>+ Agregar Horario</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ maxWidth: '450px' }}>
            <h4>Nuevo Horario Disponible</h4>
            <form onSubmit={handleSave}>
              <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '5px' }}>Fecha</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        {loading ? <p style={{ color: '#d3b06d' }}>Cargando disponibilidad...</p> : (
          Object.keys(groupedSlots).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <p style={{ fontSize: '1.1rem' }}>No hay horarios configurados.</p>
              <p style={{ fontSize: '0.9rem' }}>Agrega fechas y horarios para que tus clientes puedan reservar.</p>
            </div>
          ) : (
            Object.entries(groupedSlots).map(([date, dateSlots]) => (
              <div key={date} style={{
                marginBottom: '20px',
                padding: '15px 20px',
                background: isPast(date) ? 'rgba(255,255,255,0.02)' : 'rgba(211, 176, 109, 0.03)',
                borderRadius: '8px',
                border: `1px solid ${isPast(date) ? 'rgba(255,255,255,0.05)' : 'rgba(211, 176, 109, 0.15)'}`,
                opacity: isPast(date) ? 0.5 : 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: isPast(date) ? '#888' : '#d3b06d', margin: 0, fontSize: '1rem' }}>
                    📅 {formatDate(date)}
                    {isPast(date) && <span style={{ fontSize: '0.75rem', marginLeft: '10px', color: '#666' }}>(Pasado)</span>}
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {dateSlots.map(slot => (
                    <div key={slot.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#1a1a1a',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ color: '#fff' }}>🕐 {slot.startTime} — {slot.endTime}</span>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '0 4px',
                          lineHeight: 1
                        }}
                        title="Eliminar horario"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;

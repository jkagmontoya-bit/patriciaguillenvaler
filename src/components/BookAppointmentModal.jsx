import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './BookAppointmentModal.css';

const BookAppointmentModal = ({ isOpen, onClose, initialService }) => {
  const [formData, setFormData] = useState({ client: '', service: initialService || '', date: '', time: '', status: 'Pendiente' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, service: initialService || '' }));
    }
  }, [isOpen, initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ client: '', service: '', date: '', time: '', status: 'Pendiente' });
      }, 3000);
    } catch (error) {
      console.error("Error agendando cita: ", error);
      alert("Hubo un error al agendar tu cita. Por favor, intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="public-modal-overlay">
      <div className="public-modal-content">
        {success ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <h3 style={{color: '#d3b06d', marginBottom: '15px'}}>¡Cita Agendada con Éxito!</h3>
            <p>Nos pondremos en contacto contigo pronto para confirmarla.</p>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 className="font-serif text-gold">Reserva tu Cita</h3>
              <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="public-modal-form">
              <input type="text" placeholder="Tu Nombre Completo" required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
              <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                <option value="" disabled>Selecciona un Tratamiento</option>
                <option value="Facial Esencial">Facial Esencial</option>
                <option value="Facial Hidratante">Facial Hidratante</option>
                <option value="Facial Premium con Ácido Hialurónico">Facial Premium con Ácido Hialurónico</option>
                <option value="Facial Premium con Exosomas">Facial Premium con Exosomas</option>
                <option value="Limpieza Facial Profunda">Limpieza Facial Profunda</option>
                <option value="Evaluación & Diagnóstico Personalizado">Evaluación & Diagnóstico Personalizado</option>
                <option value="Consulta Dermatológica">Consulta Dermatológica</option>
              </select>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              <button type="submit" className="btn" disabled={loading} style={{marginTop: '15px', width: '100%'}}>
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentModal;

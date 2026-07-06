import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './BookAppointmentModal.css';

const BookAppointmentModal = ({ isOpen, onClose, initialService }) => {
  const [formData, setFormData] = useState({ client: '', service: initialService || '', date: '', time: '', status: 'Pendiente' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // Fetch treatments and availability from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const treatSnap = await getDocs(collection(db, "treatments"));
        if (!treatSnap.empty) {
          setTreatments(treatSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
        const availSnap = await getDocs(collection(db, "availability"));
        if (!availSnap.empty) {
          setAvailability(availSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, service: initialService || '' }));
    }
  }, [isOpen, initialService]);

  // When date changes, filter available time slots
  useEffect(() => {
    if (formData.date && availability.length > 0) {
      const daySlots = availability.filter(s => s.date === formData.date);
      setAvailableTimes(daySlots);
      // Reset time when date changes
      setFormData(prev => ({ ...prev, time: '' }));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, availability]);

  if (!isOpen) return null;

  // Get unique available dates
  const today = new Date().toISOString().split('T')[0];
  const availableDates = [...new Set(availability.filter(s => s.date >= today).map(s => s.date))].sort();

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

  // Fallback treatment options if none in Firestore
  const treatmentOptions = treatments.length > 0
    ? treatments
    : [
        { name: 'Facial Esencial' },
        { name: 'Facial Hidratante' },
        { name: 'Facial Premium con Ácido Hialurónico' },
        { name: 'Facial Premium con Exosomas' },
        { name: 'Limpieza Facial Profunda' },
        { name: 'Evaluación & Diagnóstico Personalizado' }
      ];

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
                {treatmentOptions.map((t, i) => (
                  <option key={i} value={t.name}>
                    {t.name}{t.price ? ` — S/ ${t.price.toFixed(2)}` : ''}
                  </option>
                ))}
              </select>

              {availability.length > 0 ? (
                <>
                  <select required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}>
                    <option value="" disabled>Selecciona una Fecha Disponible</option>
                    {availableDates.map(date => {
                      const [y, m, d] = date.split('-');
                      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                      return (
                        <option key={date} value={date}>
                          {days[dateObj.getDay()]} {d}/{m}/{y}
                        </option>
                      );
                    })}
                  </select>

                  {formData.date && (
                    <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                      <option value="" disabled>Selecciona un Horario</option>
                      {availableTimes.map(slot => (
                        <option key={slot.id} value={slot.startTime}>
                          {slot.startTime} — {slot.endTime}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              ) : (
                <>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </>
              )}

              <div style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentModal;

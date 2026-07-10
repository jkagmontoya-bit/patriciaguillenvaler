import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import './BookAppointmentModal.css';

const BookAppointmentModal = ({ isOpen, onClose, initialService }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // 0: Form, 1: Payment
  const [formData, setFormData] = useState({ client: '', service: initialService || '', date: '', time: '', metodoPago: 'tarjeta' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Data from DB
  const [treatments, setTreatments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [blockouts, setBlockouts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Calculated state
  const [availableTimes, setAvailableTimes] = useState([]);

  // Fetch all required scheduling data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treatSnap, tempSnap, blockSnap, apptSnap] = await Promise.all([
          getDocs(collection(db, "treatments")),
          getDocs(collection(db, "schedule_templates")),
          getDocs(collection(db, "schedule_blockouts")),
          getDocs(collection(db, "appointments"))
        ]);
        
        if (!treatSnap.empty) setTreatments(treatSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (!tempSnap.empty) {
          setTemplates(tempSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          // Fallback to prevent empty calendar if admin hasn't opened Availability settings yet
          setTemplates([
            { dayOfWeek: 0, active: false, startTime: '09:00', endTime: '13:00' },
            { dayOfWeek: 1, active: true, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 2, active: true, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 3, active: true, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 4, active: true, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 5, active: true, startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 6, active: true, startTime: '10:00', endTime: '14:00' }
          ]);
        }
        if (!blockSnap.empty) setBlockouts(blockSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (!apptSnap.empty) setAppointments(apptSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [isOpen]); // Refetch when modal opens to get fresh appointments

  useEffect(() => {
    const fetchUserName = async () => {
      let clientName = '';
      if (user) {
        clientName = user.displayName || user.email; // Fallback
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().name) {
            clientName = userDoc.data().name;
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      return clientName;
    };

    if (isOpen) {
      fetchUserName().then(clientName => {
        setFormData(prev => ({ ...prev, service: initialService || '', date: '', time: '', client: clientName }));
      });
      setCurrentStep(0);
      setSuccess(false);
    }
  }, [isOpen, initialService, user]);

  // Calculate available time slots when date changes
  useEffect(() => {
    if (formData.date && templates.length > 0) {
      // 1. Is it a blockout?
      if (blockouts.some(b => b.date === formData.date)) {
        setAvailableTimes([]);
        setFormData(prev => ({...prev, time: ''}));
        return;
      }
      
      // 2. Get Day of Week
      const [y, m, d] = formData.date.split('-');
      const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
      const dayOfWeek = dateObj.getDay();
      
      // 3. Get Template
      const template = templates.find(t => t.dayOfWeek === dayOfWeek);
      if (!template || !template.active) {
        setAvailableTimes([]);
        setFormData(prev => ({...prev, time: ''}));
        return;
      }
      
      // 4. Calculate Slots (1 hour intervals)
      const slots = [];
      let currentHour = parseInt(template.startTime.split(':')[0]);
      const endHour = parseInt(template.endTime.split(':')[0]);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const currentRealHour = new Date().getHours();

      while (currentHour < endHour) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:00`;
        
        // Prevent booking past hours if it's today
        if (formData.date === todayStr && currentHour <= currentRealHour) {
          currentHour++;
          continue;
        }

        // Prevent double booking (Check against existing appointments)
        const isBooked = appointments.some(a => a.date === formData.date && a.time === timeStr);
        if (!isBooked) {
          slots.push(timeStr);
        }
        currentHour++;
      }
      setAvailableTimes(slots);
      setFormData(prev => ({...prev, time: ''}));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, templates, blockouts, appointments]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.client || !formData.service || !formData.date || !formData.time) {
      alert("Por favor completa todos los campos.");
      return;
    }
    setCurrentStep(1);
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    try {
      const finalAppointment = {
        client: formData.client,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        status: 'Pagado - Adelanto S/ 20',
        metodoPago: formData.metodoPago,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "appointments"), finalAppointment);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setCurrentStep(0);
      }, 3000);
    } catch (error) {
      console.error("Error agendando cita: ", error);
      alert("Hubo un error procesando el pago. Por favor intenta de nuevo.");
    }
    setLoading(false);
  };

  // Generate an array of next 30 days for the date picker options
  const getNext30Days = () => {
    const dates = [];
    const today = new Date();
    for(let i=0; i<30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      
      // Filter out blockouts immediately
      if(!blockouts.some(b => b.date === isoStr)) {
        // Filter out inactive days
        const t = templates.find(temp => temp.dayOfWeek === d.getDay());
        if(t && t.active) {
          dates.push({
            iso: isoStr,
            display: d.toLocaleDateString('es-PE', { weekday: 'short', month: 'short', day: 'numeric' })
          });
        }
      }
    }
    return dates;
  };

  const availableDatesOptions = getNext30Days();

  // Fallback treatments if empty DB
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

  if (!isOpen) return null;

  const paymentOptionStyle = {
    display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '15px', 
    border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', background: '#222'
  };
  const payBadge = {
    background: '#444', padding: '2px 6px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold'
  };

  return (
    <div className="public-modal-overlay">
      <div className="public-modal-content" style={{ maxWidth: currentStep === 1 ? '500px' : '450px' }}>
        {success ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <h3 style={{color: '#d3b06d', marginBottom: '15px', fontSize: '1.5rem'}}>¡Reserva Confirmada!</h3>
            <p>Hemos recibido tu adelanto de garantía.<br/>Te esperamos el <strong>{formData.date} a las {formData.time}</strong>.</p>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3 className="font-serif text-gold">{currentStep === 0 ? 'Reserva tu Cita' : 'Confirmar Reserva'}</h3>
              <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
            </div>
            
            {currentStep === 0 ? (
              /* PASO 0: SELECCIÓN DE DATOS */
              <form onSubmit={handleNextStep} className="public-modal-form">
                <input 
                  type="text" 
                  placeholder="Tu Nombre Completo" 
                  required 
                  value={formData.client} 
                  onChange={e => setFormData({...formData, client: e.target.value})} 
                />
                
                <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                  <option value="" disabled>Selecciona un Tratamiento</option>
                  {treatmentOptions.map((t, i) => (
                    <option key={i} value={t.name}>
                      {t.name}{t.price ? ` — S/ ${t.price.toFixed(2)}` : ''}
                    </option>
                  ))}
                </select>

                <select required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}>
                  <option value="" disabled>Selecciona una Fecha Disponible</option>
                  {availableDatesOptions.map(d => (
                    <option key={d.iso} value={d.iso}>
                      {d.display.charAt(0).toUpperCase() + d.display.slice(1)}
                    </option>
                  ))}
                </select>

                {formData.date && (
                  <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                    <option value="" disabled>Selecciona un Horario</option>
                    {availableTimes.length > 0 ? (
                      availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    ) : (
                      <option value="" disabled>No hay horarios libres este día</option>
                    )}
                  </select>
                )}

                <div style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}>
                  <button type="submit" className="btn" style={{ width: '100%' }}>
                    Continuar al Pago
                  </button>
                </div>
              </form>
            ) : (
              /* PASO 1: PAGO DE GARANTIA */
              <div>
                <div style={{ background: 'rgba(211, 176, 109, 0.1)', border: '1px solid #d3b06d', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <p style={{ marginBottom: '10px' }}>
                    Para confirmar tu cita requerimos un pago de garantía de <strong>S/ 20.00</strong>, el cual será descontado del costo total de tu servicio el día de tu atención.
                  </p>
                  <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
                    <em>* Importante: En caso de cancelación de último minuto o inasistencia, este monto no es reembolsable.</em>
                  </p>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '25px'}}>
                  <label style={{...paymentOptionStyle, borderColor: formData.metodoPago === 'tarjeta' ? '#d3b06d' : '#333'}}>
                    <input type="radio" name="metodoPago" value="tarjeta" onChange={e => setFormData({...formData, metodoPago: e.target.value})} checked={formData.metodoPago === 'tarjeta'} style={{accentColor: '#d3b06d'}} />
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', color: '#fff'}}>Tarjeta de crédito y/o débito</div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <span style={{...payBadge, color: '#fff'}}>VISA</span>
                        <span style={{...payBadge, color: '#fff'}}>MC</span>
                        <span style={{...payBadge, color: '#fff'}}>AMEX</span>
                      </div>
                    </div>
                  </label>

                  <label style={{...paymentOptionStyle, borderColor: formData.metodoPago === 'qr' ? '#d3b06d' : '#333'}}>
                    <input type="radio" name="metodoPago" value="qr" onChange={e => setFormData({...formData, metodoPago: e.target.value})} checked={formData.metodoPago === 'qr'} style={{accentColor: '#d3b06d'}} />
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', color: '#fff'}}>Código QR (Billetera digital)</div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <span style={{...payBadge, background: '#742384', color: '#fff'}}>Yape</span>
                        <span style={{...payBadge, background: '#00d7d2', color: '#fff'}}>Plin</span>
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => setCurrentStep(0)} style={{ flex: 1, padding: '12px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    VOLVER
                  </button>
                  <button onClick={handleConfirmReservation} disabled={loading} style={{ flex: 2, padding: '12px', background: '#c7a450', color: '#111', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Procesando...' : 'PAGAR S/ 20 Y RESERVAR'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentModal;

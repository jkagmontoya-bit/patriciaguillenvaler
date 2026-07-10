import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AvailabilityManager = () => {
  const [activeTab, setActiveTab] = useState('template');
  const [loading, setLoading] = useState(true);
  
  // Plantilla Semanal
  const [templates, setTemplates] = useState([]);
  
  // Bloqueos
  const [blockouts, setBlockouts] = useState([]);
  const [blockoutDate, setBlockoutDate] = useState('');
  const [blockoutReason, setBlockoutReason] = useState('');

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    const unsubscribeTemplates = onSnapshot(collection(db, "schedule_templates"), (tempSnap) => {
      let fetchedTemplates = tempSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (fetchedTemplates.length === 0) {
        const defaultData = [
          { id: '0', dayOfWeek: 0, active: false, startTime: '09:00', endTime: '13:00' }, // Dom
          { id: '1', dayOfWeek: 1, active: true, startTime: '09:00', endTime: '18:00' }, // Lun
          { id: '2', dayOfWeek: 2, active: true, startTime: '09:00', endTime: '18:00' }, // Mar
          { id: '3', dayOfWeek: 3, active: true, startTime: '09:00', endTime: '18:00' }, // Mie
          { id: '4', dayOfWeek: 4, active: true, startTime: '09:00', endTime: '18:00' }, // Jue
          { id: '5', dayOfWeek: 5, active: true, startTime: '09:00', endTime: '18:00' }, // Vie
          { id: '6', dayOfWeek: 6, active: true, startTime: '10:00', endTime: '14:00' }, // Sab
        ];
        
        Promise.all(defaultData.map(t => setDoc(doc(db, "schedule_templates", t.id), t))).catch(e => console.error("Error seeding templates:", e));
        fetchedTemplates = defaultData;
      }
      
      fetchedTemplates.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      setTemplates(fetchedTemplates);
    }, (error) => {
      console.error("Error fetching schedules: ", error);
      setLoading(false);
    });

    const unsubscribeBlockouts = onSnapshot(collection(db, "schedule_blockouts"), (blockSnap) => {
      const fetchedBlockouts = blockSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      fetchedBlockouts.sort((a, b) => {
        const dateA = typeof a.date === 'string' ? a.date : '';
        const dateB = typeof b.date === 'string' ? b.date : '';
        return dateA.localeCompare(dateB);
      });
      setBlockouts(fetchedBlockouts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching blockouts: ", error);
      setLoading(false);
    });

    return () => {
      unsubscribeTemplates();
      unsubscribeBlockouts();
    };
  }, []);

  const handleTemplateChange = (dayIndex, field, value) => {
    const updated = [...templates];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setTemplates(updated);
  };

  const saveTemplates = async () => {
    setLoading(true);
    try {
      await Promise.all(templates.map(t => setDoc(doc(db, "schedule_templates", t.id), t)));
      alert("Plantilla semanal guardada con éxito.");
    } catch (error) {
      console.error("Error saving templates: ", error);
      alert("Hubo un error al guardar.");
    }
    setLoading(false);
  };

  const handleAddBlockout = async (e) => {
    e.preventDefault();
    if (!blockoutDate) return;
    try {
      await addDoc(collection(db, "schedule_blockouts"), {
        date: blockoutDate,
        reason: blockoutReason || 'Feriado / Cerrado'
      });
      setBlockoutDate('');
      setBlockoutReason('');
    } catch (error) {
      console.error("Error saving blockout: ", error);
    }
  };

  const handleDeleteBlockout = async (id) => {
    if (window.confirm('¿Eliminar este día bloqueado?')) {
      try {
        await deleteDoc(doc(db, "schedule_blockouts", id));
      } catch (error) {
        console.error("Error deleting blockout: ", error);
      }
    }
  };

  const isPast = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)) < today;
  };

  return (
    <div className="appointments-module">
      <div className="module-header" style={{ marginBottom: '20px' }}>
        <h3>Configuración de Horarios</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={activeTab === 'template' ? "btn" : "btn2"} 
            onClick={() => setActiveTab('template')}
            style={{ padding: '8px 15px', fontSize: '0.9rem' }}
          >
            Plantilla Semanal
          </button>
          <button 
            className={activeTab === 'blockouts' ? "btn" : "btn2"} 
            onClick={() => setActiveTab('blockouts')}
            style={{ padding: '8px 15px', fontSize: '0.9rem' }}
          >
            Días Bloqueados
          </button>
        </div>
      </div>

      {loading ? <p style={{ color: '#d3b06d' }}>Cargando datos...</p> : (
        <>
          {/* TAB: PLANTILLA SEMANAL */}
          {activeTab === 'template' && (
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>
                Define tu horario de atención regular. Este horario se repetirá todas las semanas automáticamente.
                Puedes apagar un día entero (ej. Domingos) para que el sistema no permita citas ese día.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {templates.map((t, i) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: t.active ? '#1a1a1a' : 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '4px', opacity: t.active ? 1 : 0.5 }}>
                    <div style={{ width: '120px', fontWeight: 'bold', color: t.active ? '#d3b06d' : '#666' }}>
                      {daysOfWeek[t.dayOfWeek]}
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', color: '#fff', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={t.active} 
                        onChange={(e) => handleTemplateChange(i, 'active', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#d3b06d' }}
                      />
                      {t.active ? 'Abierto' : 'Cerrado'}
                    </label>

                    {t.active && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                        <input 
                          type="time" 
                          value={t.startTime} 
                          onChange={(e) => handleTemplateChange(i, 'startTime', e.target.value)}
                          style={{ padding: '8px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontFamily: 'inherit' }}
                        />
                        <span style={{ color: '#666' }}>hasta</span>
                        <input 
                          type="time" 
                          value={t.endTime} 
                          onChange={(e) => handleTemplateChange(i, 'endTime', e.target.value)}
                          style={{ padding: '8px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontFamily: 'inherit' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '25px', textAlign: 'right' }}>
                <button className="btn" onClick={saveTemplates}>Guardar Plantilla Base</button>
              </div>
            </div>
          )}

          {/* TAB: DIAS BLOQUEADOS */}
          {activeTab === 'blockouts' && (
            <div style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>
                Usa esta sección para bloquear fechas específicas que caen dentro de tu horario laboral, por ejemplo feriados o vacaciones. Ningún cliente podrá reservar en estos días.
              </p>

              <form onSubmit={handleAddBlockout} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #222' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#aaa' }}>Fecha a bloquear</label>
                  <input 
                    type="date" 
                    required 
                    value={blockoutDate} 
                    onChange={e => setBlockoutDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#aaa' }}>Motivo (Opcional, ej. Feriado)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Fiestas Patrias"
                    value={blockoutReason} 
                    onChange={e => setBlockoutReason(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontFamily: 'inherit' }}
                  />
                </div>
                <button type="submit" className="btn" style={{ padding: '10px 20px' }}>Bloquear Día</button>
              </form>

              <div>
                <h4 style={{ color: '#fff', marginBottom: '15px' }}>Días Bloqueados Registrados</h4>
                {blockouts.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>No hay días bloqueados registrados.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {blockouts.map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a', padding: '12px 20px', borderRadius: '4px', border: '1px solid #222', opacity: isPast(b.date) ? 0.4 : 1 }}>
                        <div>
                          <strong style={{ color: isPast(b.date) ? '#888' : '#d3b06d', marginRight: '15px' }}>{b.date}</strong>
                          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{b.reason}</span>
                          {isPast(b.date) && <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: '#555' }}>(Pasado)</span>}
                        </div>
                        <button 
                          onClick={() => handleDeleteBlockout(b.id)}
                          style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
                          title="Quitar bloqueo"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityManager;

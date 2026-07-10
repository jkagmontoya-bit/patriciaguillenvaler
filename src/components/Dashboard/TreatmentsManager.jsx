import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, limit } from 'firebase/firestore';

const CATEGORIES = ['Faciales', 'Cejas y Pestañas', 'Maquillaje'];

const TreatmentsManager = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: CATEGORIES[0], active: true });

  const [limitCount, setLimitCount] = useState(20);

  useEffect(() => {
    const q = query(collection(db, "treatments"), limit(limitCount));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by category then name
      items.sort((a, b) => {
        const catA = a.category || '';
        const catB = b.category || '';
        if (catA === catB) return (a.name || '').localeCompare(b.name || '');
        return catA.localeCompare(catB);
      });
      setTreatments(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching treatments: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limitCount]);

  const openNew = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', category: CATEGORIES[0], active: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || '', price: String(item.price || ''), active: item.active !== false });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      active: formData.active
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "treatments", editingId), payload);
      } else {
        await addDoc(collection(db, "treatments"), payload);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', price: '', active: true });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving treatment: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este tratamiento?')) {
      try {
        await deleteDoc(doc(db, "treatments", id));
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Gestión de Tratamientos</h3>
        <button className="btn" onClick={openNew}>+ Nuevo Tratamiento</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{maxWidth: '500px'}}>
            <h4>{editingId ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}</h4>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Nombre del Tratamiento"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Descripción del tratamiento"
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio (S/)"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.9rem', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={formData.active} 
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#d3b06d' }}
                />
                Tratamiento Activo (Visible en el sitio web principal)
              </label>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{ color: '#d3b06d' }}>Cargando tratamientos...</p> : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tratamiento</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay tratamientos registrados. Añade el primero.</td></tr>
                ) : (
                  treatments.map((item) => (
                    <tr key={item.id} style={{ opacity: item.active !== false ? 1 : 0.6 }}>
                      <td style={{ fontWeight: '600', color: '#d3b06d' }}>{item.name}</td>
                      <td style={{ maxWidth: '300px', fontSize: '0.9rem', color: '#aaa' }}>{item.description}</td>
                      <td style={{ fontWeight: '600' }}>S/ {(item.price || 0).toFixed(2)}</td>
                      <td>
                        <span style={{ 
                          padding: '3px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          background: item.active !== false ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 77, 77, 0.2)',
                          color: item.active !== false ? '#28a745' : '#ff4d4d'
                        }}>
                          {item.active !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => openEdit(item)}>Editar</button>
                        <button className="action-btn delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {treatments.length >= limitCount && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn" onClick={() => setLimitCount(prev => prev + 20)}>Cargar más resultados</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TreatmentsManager;

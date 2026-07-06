import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const TreatmentsManager = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "treatments"));
      const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTreatments(items);
    } catch (error) {
      console.error("Error fetching treatments: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || '', price: String(item.price || '') });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price)
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "treatments", editingId), payload);
      } else {
        await addDoc(collection(db, "treatments"), payload);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', price: '' });
      setEditingId(null);
      fetchTreatments();
    } catch (error) {
      console.error("Error saving treatment: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este tratamiento?')) {
      try {
        await deleteDoc(doc(db, "treatments", id));
        fetchTreatments();
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
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tratamiento</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {treatments.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay tratamientos registrados. Añade el primero.</td></tr>
              ) : (
                treatments.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '600', color: '#d3b06d' }}>{item.name}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.9rem', color: '#aaa' }}>{item.description}</td>
                    <td style={{ fontWeight: '600' }}>S/ {(item.price || 0).toFixed(2)}</td>
                    <td>
                      <button className="action-btn" onClick={() => openEdit(item)}>Editar</button>
                      <button className="action-btn delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
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

export default TreatmentsManager;

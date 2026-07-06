import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const CATEGORIES = ['Skincare', 'Limpieza', 'Tratamientos', 'Hidratación', 'Protector Solar', 'Packs'];

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', price: '', stock: '', image: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(items);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', category: '', price: '', stock: '', image: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: String(item.price || ''),
      stock: String(item.stock || ''),
      image: item.image || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "inventory", editingId), payload);
      } else {
        await addDoc(collection(db, "inventory"), payload);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', category: '', price: '', stock: '', image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, "inventory", id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Gestión de Productos</h3>
        <button className="btn" onClick={openNew}>+ Nuevo Producto</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ maxWidth: '550px' }}>
            <h4>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h4>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Nombre del Producto"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Descripción del producto"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontFamily: 'inherit',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" disabled>Selecciona una Categoría</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio (S/)"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <input
                type="url"
                placeholder="URL de la Imagen del Producto"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.image && (
                <div style={{ textAlign: 'center', padding: '10px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <img
                    src={formData.image}
                    alt="Vista previa"
                    style={{ maxHeight: '120px', borderRadius: '6px', objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{ color: '#d3b06d' }}>Cargando productos...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay productos registrados.</td></tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #333' }}
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', background: '#1a1a1a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#555' }}>
                          Sin img
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{item.name}</div>
                      {item.description && <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '3px' }}>{item.description.substring(0, 60)}...</div>}
                    </td>
                    <td>
                      <span style={{ background: 'rgba(211, 176, 109, 0.1)', color: '#d3b06d', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                        {item.category || '—'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>S/ {(item.price || 0).toFixed(2)}</td>
                    <td>
                      <span style={{ color: (item.stock || 0) <= 5 ? '#ff4d4d' : '#28a745', fontWeight: 'bold' }}>
                        {item.stock || 0} uds.
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
        )}
      </div>
    </div>
  );
};

export default ProductsManager;

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const CATEGORIES = ['Skincare', 'Limpieza', 'Tratamientos', 'Hidratación', 'Protector Solar', 'Packs'];

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Note: New products are now created via Purchases (ERP). We keep Edit/Delete here.
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', price: '', wholesalePrice: '', stock: '', image: '', sku: '', batch: '', expiryDate: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: String(item.price || ''),
      wholesalePrice: String(item.wholesalePrice || ''),
      stock: String(item.stock || ''),
      image: item.image || '',
      sku: item.sku || '',
      batch: item.batch || '',
      expiryDate: item.expiryDate || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingId) return; // Only editing allowed here, creation is via Purchases
    
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      wholesalePrice: parseFloat(formData.wholesalePrice || 0),
      stock: parseInt(formData.stock),
      image: formData.image,
      sku: formData.sku,
      batch: formData.batch,
      expiryDate: formData.expiryDate
    };
    
    try {
      await updateDoc(doc(db, "inventory", editingId), payload);
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto permanentemente?')) {
      try {
        await deleteDoc(doc(db, "inventory", id));
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { color: '#888', label: 'Sin Vencimiento', bg: 'transparent' };
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const [y, m, d] = expiryDate.split('-');
    const expDate = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: '#ff4d4d', label: '¡Vencido!', bg: 'rgba(255, 77, 77, 0.1)' };
    if (diffDays <= 90) return { color: '#ffcc00', label: 'Por Vencer (< 3 meses)', bg: 'rgba(255, 204, 0, 0.1)' };
    return { color: '#28a745', label: 'Ok (> 3 meses)', bg: 'rgba(40, 167, 69, 0.1)' };
  };

  return (
    <div className="appointments-module">
      <div className="module-header" style={{ marginBottom: '15px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Catálogo e Inventario (ERP)</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#888' }}>
            Los productos nuevos se crean automáticamente desde el <strong>Módulo de Compras</strong>. Aquí puedes editar descripciones y precios.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal" style={{ overflowY: 'auto' }}>
          <div className="admin-modal-content" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h4 style={{ color: '#d3b06d', marginBottom: '20px' }}>Editar Producto en Inventario</h4>
            <form onSubmit={handleSave}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Código SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Categoría</label>
                  <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Selecciona Categoría</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Nombre del Producto</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Descripción Comercial</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', minHeight: '80px' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>P. Venta Público (S/)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>P. Venta Mayorista (S/)</label>
                  <input type="number" step="0.01" value={formData.wholesalePrice} onChange={e => setFormData({ ...formData, wholesalePrice: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Stock Físico</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid #222' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Lote Actual</label>
                  <input type="text" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Fecha Vencimiento (Lote)</label>
                  <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: '#aaa' }}>URL de la Imagen</label>
                <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Guardar Cambios</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{ color: '#d3b06d' }}>Cargando inventario...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Precios (S/)</th>
                <th>Stock</th>
                <th>Lote / Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay productos registrados. Ingresa una compra.</td></tr>
              ) : (
                products.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  return (
                    <tr key={item.id} style={{ background: expiryStatus.bg }}>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: '#333', padding: '3px 6px', borderRadius: '4px', color: '#fff', fontFamily: 'monospace' }}>
                          {item.sku || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#666' }}>IMG</div>
                          )}
                          <div>
                            <div style={{ fontWeight: '600' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#d3b06d' }}>{item.category || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>Púb: <strong>{(item.price || 0).toFixed(2)}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>May: {(item.wholesalePrice || 0).toFixed(2)}</div>
                      </td>
                      <td>
                        <span style={{ color: (item.stock || 0) <= 5 ? '#ff4d4d' : '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {item.stock || 0}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Lote: {item.batch || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: expiryStatus.color, fontWeight: 'bold', marginTop: '2px' }}>
                          {item.expiryDate ? `${item.expiryDate} (${expiryStatus.label})` : '—'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="action-btn" onClick={() => openEdit(item)}>Editar</button>
                          <button className="action-btn delete" onClick={() => handleDelete(item.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductsManager;

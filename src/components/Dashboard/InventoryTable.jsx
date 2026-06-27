import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inventory"), {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      setShowModal(false);
      setFormData({ name: '', price: '', stock: '' });
      fetchInventory();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, "inventory", id));
        fetchInventory();
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Control de Inventario</h3>
        <button className="btn" onClick={() => setShowModal(true)}>+ Añadir Producto</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h4>Nuevo Producto</h4>
            <form onSubmit={handleSave}>
              <input type="text" placeholder="Nombre del Producto" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="number" step="0.01" placeholder="Precio (S/)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input type="number" placeholder="Stock Inicial" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando inventario...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>No hay productos en inventario</td></tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>S/ {item.price.toFixed(2)}</td>
                    <td>
                      <span style={{color: item.stock <= 5 ? '#ff4d4d' : '#28a745', fontWeight: 'bold'}}>
                        {item.stock} uds.
                      </span>
                    </td>
                    <td>
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

export default InventoryTable;

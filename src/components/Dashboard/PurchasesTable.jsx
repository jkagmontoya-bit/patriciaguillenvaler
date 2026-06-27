import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const PurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ supplier: '', description: '', amount: '' });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "purchases"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(items);
    } catch (error) {
      console.error("Error fetching purchases: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "purchases"), {
        ...formData,
        amount: parseFloat(formData.amount),
        date: serverTimestamp()
      });
      setShowModal(false);
      setFormData({ supplier: '', description: '', amount: '' });
      fetchPurchases();
    } catch (error) {
      console.error("Error adding purchase: ", error);
    }
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Registro de Compras (Proveedores)</h3>
        <button className="btn" onClick={() => setShowModal(true)}>+ Nueva Factura</button>
      </div>

      {showModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h4>Registrar Compra</h4>
            <form onSubmit={handleSave}>
              <input type="text" placeholder="Proveedor (RUC/Nombre)" required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
              <input type="text" placeholder="Descripción de la compra" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input type="number" step="0.01" placeholder="Monto Total (S/)" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn">Guardar</button>
                <button type="button" className="btn2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando compras...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Descripción</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center'}}>No hay compras registradas</td></tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.description}</td>
                    <td style={{color: '#ff4d4d', fontWeight: 'bold'}}>- S/ {purchase.amount.toFixed(2)}</td>
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

export default PurchasesTable;

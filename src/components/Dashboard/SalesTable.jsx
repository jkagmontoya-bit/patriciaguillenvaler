import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    try {
      // Nota: orderBy requiere un índice en Firestore si la colección es grande.
      const q = query(collection(db, "sales"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(items);
    } catch (error) {
      console.error("Error fetching sales: ", error);
      // Fallback por si falta el índice de date
      const snapshot = await getDocs(collection(db, "sales"));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Registro de Ventas</h3>
      </div>

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando ventas...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente (Email)</th>
                <th>Artículos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No hay ventas registradas</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id.slice(0, 8)}...</td>
                    <td>{sale.userEmail}</td>
                    <td>{sale.items?.length || 0} items</td>
                    <td className="text-gold" style={{fontWeight: 'bold'}}>S/ {sale.total?.toFixed(2) || '0.00'}</td>
                    <td><span className="status-badge confirmada">{sale.status}</span></td>
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

export default SalesTable;

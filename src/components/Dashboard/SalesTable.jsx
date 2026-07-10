import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limitCount, setLimitCount] = useState(20);

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("date", "desc"), limit(limitCount));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSales(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sales: ", error);
      // Fallback si falta indice
      const unsubscribeFallback = onSnapshot(query(collection(db, "sales"), limit(limitCount)), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSales(items);
        setLoading(false);
      });
      return () => unsubscribeFallback();
    });

    return () => unsubscribe();
  }, [limitCount]);

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Registro de Ventas</h3>
      </div>

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando ventas...</p> : (
          <>
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
                      <td className="text-gold" style={{fontWeight: 'bold'}}>S/ {Number(sale.total || 0).toFixed(2)}</td>
                      <td><span className="status-badge confirmada">{sale.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {sales.length >= limitCount && (
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

export default SalesTable;

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const AccountingReport = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeSales = onSnapshot(collection(db, "sales"), (salesSnap) => {
      setSales(salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const unsubscribePurchases = onSnapshot(collection(db, "purchases"), (purchSnap) => {
        setPurchases(purchSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }, (error) => {
        console.error("Error fetching purchases for accounting: ", error);
        setLoading(false);
      });
      
      return () => unsubscribePurchases();
    }, (error) => {
      console.error("Error fetching sales for accounting: ", error);
      setLoading(false);
    });

    return () => unsubscribeSales();
  }, []);

  // Cálculos para el Régimen Especial (PDT 621)
  // Nota: En Perú el IGV es 18%
  const TASA_IGV = 0.18;
  const FACTOR_DIVISION = 1 + TASA_IGV; // 1.18

  const totalVentas = sales.reduce((acc, sale) => acc + (sale.total || 0), 0);
  const baseImponibleVentas = totalVentas / FACTOR_DIVISION;
  const igvVentas = totalVentas - baseImponibleVentas;

  const totalCompras = purchases.reduce((acc, purch) => acc + (purch.amount || 0), 0);
  const baseImponibleCompras = totalCompras / FACTOR_DIVISION;
  const igvCompras = totalCompras - baseImponibleCompras;

  const igvAPagar = igvVentas - igvCompras;
  const rentaAPagar = baseImponibleVentas * 0.015; // 1.5% Cuota Régimen Especial

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Reporte Contable (PDT 621 - Régimen Especial)</h3>
        <button className="btn" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
      </div>

      {loading ? <p style={{color: '#d3b06d'}}>Calculando...</p> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div style={{background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid rgba(211, 176, 109, 0.3)'}}>
              <h4 className="text-gold" style={{marginBottom: '15px'}}>Resumen de Ventas</h4>
              <p style={{marginBottom: '10px'}}><strong>Total Ingresos (Inc. IGV):</strong> S/ {totalVentas.toFixed(2)}</p>
              <p style={{marginBottom: '10px'}}><strong>Base Imponible:</strong> S/ {baseImponibleVentas.toFixed(2)}</p>
              <p><strong>IGV Ventas (18%):</strong> S/ {igvVentas.toFixed(2)}</p>
            </div>

            <div style={{background: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid rgba(211, 176, 109, 0.3)'}}>
              <h4 className="text-gold" style={{marginBottom: '15px'}}>Resumen de Compras</h4>
              <p style={{marginBottom: '10px'}}><strong>Total Egresos (Inc. IGV):</strong> S/ {totalCompras.toFixed(2)}</p>
              <p style={{marginBottom: '10px'}}><strong>Base Imponible:</strong> S/ {baseImponibleCompras.toFixed(2)}</p>
              <p><strong>IGV Compras (18%):</strong> S/ {igvCompras.toFixed(2)}</p>
            </div>
          </div>

          <div style={{background: '#110d0a', padding: '20px', borderRadius: '10px', border: '1px solid #d3b06d'}}>
            <h4 className="text-gold" style={{marginBottom: '20px', fontSize: '1.2rem', textAlign: 'center'}}>Obligaciones Tributarias Estimadas</h4>
            
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <div style={{textAlign: 'center'}}>
                <p style={{color: '#aaa', marginBottom: '5px'}}>IGV a Pagar (Ventas - Compras)</p>
                <h2 style={{color: igvAPagar > 0 ? '#ffc107' : '#28a745'}}>S/ {Math.max(0, igvAPagar).toFixed(2)}</h2>
                {igvAPagar < 0 && <small style={{color: '#28a745'}}>Crédito Fiscal a favor</small>}
              </div>
              
              <div style={{height: '50px', width: '1px', background: '#333'}}></div>
              
              <div style={{textAlign: 'center'}}>
                <p style={{color: '#aaa', marginBottom: '5px'}}>Renta (1.5% Base Imponible Ventas)</p>
                <h2 style={{color: '#ffc107'}}>S/ {rentaAPagar.toFixed(2)}</h2>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default AccountingReport;

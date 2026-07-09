import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore';

const CATEGORIES = ['Skincare', 'Limpieza', 'Tratamientos', 'Hidratación', 'Protector Solar', 'Packs'];

const generateSKU = (category) => {
  const prefix = category ? category.substring(0, 3).toUpperCase() : 'GEN';
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
};

const PurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Factura State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ ruc: '', supplier: '', invoiceNumber: '', date: '', total: '' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  
  // Item Form State (dentro del modal de factura)
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemType, setItemType] = useState('existing'); // 'existing' | 'new'
  const [itemData, setItemData] = useState({
    existingId: '', qty: '', 
    name: '', category: '', description: '', purchasePrice: '', salePrice: '', wholesalePrice: '', image: '', batch: '', expiryDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const purchSnap = await getDocs(collection(db, "purchases"));
      const pItems = purchSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      pItems.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      setPurchases(pItems);
    } catch (error) {
      console.error("Error fetching purchases: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchInventoryIfNeeded = async () => {
    if (inventory.length === 0) {
      try {
        const invSnap = await getDocs(collection(db, "inventory"));
        setInventory(invSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching inventory: ", error);
      }
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemType === 'existing') {
      const prod = inventory.find(i => i.id === itemData.existingId);
      if (!prod) return alert("Seleccione un producto");
      setInvoiceItems([...invoiceItems, { 
        type: 'existing', 
        id: prod.id, 
        name: prod.name, 
        qty: parseInt(itemData.qty), 
        batch: itemData.batch,
        expiryDate: itemData.expiryDate,
        subtotal: parseFloat(itemData.purchasePrice) * parseInt(itemData.qty)
      }]);
    } else {
      setInvoiceItems([...invoiceItems, {
        type: 'new',
        name: itemData.name,
        category: itemData.category,
        description: itemData.description,
        qty: parseInt(itemData.qty),
        purchasePrice: parseFloat(itemData.purchasePrice),
        price: parseFloat(itemData.salePrice),
        wholesalePrice: parseFloat(itemData.wholesalePrice || 0),
        image: itemData.image,
        batch: itemData.batch,
        expiryDate: itemData.expiryDate,
        sku: generateSKU(itemData.category),
        subtotal: parseFloat(itemData.purchasePrice) * parseInt(itemData.qty)
      }]);
    }
    setShowItemForm(false);
    resetItemData();
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const resetItemData = () => {
    setItemData({
      existingId: '', qty: '', 
      name: '', category: '', description: '', purchasePrice: '', salePrice: '', wholesalePrice: '', image: '', batch: '', expiryDate: ''
    });
  };

  const handleSaveInvoice = async (e) => {
    e.preventDefault();
    if (invoiceItems.length === 0) return alert("Debe agregar al menos un producto a la factura.");
    
    setLoading(true);
    try {
      // 1. Guardar la factura en purchases
      const newPurchase = {
        ruc: invoiceData.ruc,
        supplier: invoiceData.supplier,
        invoiceNumber: invoiceData.invoiceNumber,
        date: invoiceData.date,
        total: parseFloat(invoiceData.total),
        items: invoiceItems,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "purchases"), newPurchase);

      // 2. Procesar el Inventario
      for (const item of invoiceItems) {
        if (item.type === 'existing') {
          // Obtener current stock
          const prod = inventory.find(i => i.id === item.id);
          const newStock = (parseInt(prod.stock) || 0) + item.qty;
          
          // Actualizar stock, lote y vencimiento del producto existente
          const updatePayload = { stock: newStock };
          if (item.batch) updatePayload.batch = item.batch;
          if (item.expiryDate) updatePayload.expiryDate = item.expiryDate;
          
          await updateDoc(doc(db, "inventory", item.id), updatePayload);
        } else if (item.type === 'new') {
          // Crear nuevo producto
          await addDoc(collection(db, "inventory"), {
            name: item.name,
            category: item.category,
            description: item.description,
            stock: item.qty,
            purchasePrice: item.purchasePrice,
            price: item.price,
            wholesalePrice: item.wholesalePrice,
            image: item.image,
            batch: item.batch,
            expiryDate: item.expiryDate,
            sku: item.sku
          });
        }
      }

      setShowInvoiceModal(false);
      setInvoiceData({ ruc: '', supplier: '', invoiceNumber: '', date: '', total: '' });
      setInvoiceItems([]);
      fetchData();
      alert("Factura registrada e inventario actualizado exitosamente.");
    } catch (error) {
      console.error("Error saving invoice: ", error);
      alert("Hubo un error al guardar la factura.");
    }
    setLoading(false);
  };

  const openNewInvoice = () => {
    fetchInventoryIfNeeded();
    setInvoiceData({ ruc: '', supplier: '', invoiceNumber: '', date: new Date().toISOString().split('T')[0], total: '' });
    setInvoiceItems([]);
    setShowInvoiceModal(true);
  };

  return (
    <div className="appointments-module">
      <div className="module-header">
        <h3>Módulo de Compras (ERP)</h3>
        <button className="btn" onClick={openNewInvoice}>+ Nueva Factura</button>
      </div>

      {showInvoiceModal && (
        <div className="admin-modal" style={{ overflowY: 'auto' }}>
          <div className="admin-modal-content" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h4 style={{ marginBottom: '20px', color: '#d3b06d' }}>Registrar Factura de Compra</h4>
            
            <form onSubmit={handleSaveInvoice}>
              {/* Cabecera de Factura */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>RUC del Proveedor</label>
                  <input type="text" required value={invoiceData.ruc} onChange={e => setInvoiceData({...invoiceData, ruc: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Nombre / Razón Social</label>
                  <input type="text" required value={invoiceData.supplier} onChange={e => setInvoiceData({...invoiceData, supplier: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Nº de Factura</label>
                  <input type="text" required value={invoiceData.invoiceNumber} onChange={e => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '5px' }}>Fecha de Emisión</label>
                  <input type="date" required value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} style={{ width: '100%' }} />
                </div>
              </div>

              {/* Lista de Productos de la Factura */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h5 style={{ color: '#fff', margin: 0 }}>Detalle de Productos</h5>
                  {!showItemForm && (
                    <button type="button" className="btn2" onClick={() => setShowItemForm(true)} style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
                      + Agregar Ítem
                    </button>
                  )}
                </div>

                {/* Tabla de ítems agregados */}
                {invoiceItems.length > 0 ? (
                  <table className="admin-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Lote</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name} <span style={{ color: '#888', fontSize: '0.75rem' }}>({item.type === 'new' ? 'Nuevo' : 'Existente'})</span></td>
                          <td>{item.qty}</td>
                          <td>{item.batch || '—'}</td>
                          <td>S/ {item.subtotal ? item.subtotal.toFixed(2) : '—'}</td>
                          <td>
                            <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Quitar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', background: '#1a1a1a', borderRadius: '4px', border: '1px dashed #444', color: '#666', fontSize: '0.9rem' }}>
                    No has agregado ningún producto a la factura.
                  </div>
                )}
              </div>

              {/* Formulario para agregar un ítem */}
              {showItemForm && (
                <div style={{ background: 'rgba(211, 176, 109, 0.05)', padding: '20px', borderRadius: '8px', border: '1px solid #d3b06d', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <label style={{ color: '#fff', fontSize: '0.9rem' }}>
                      <input type="radio" checked={itemType === 'existing'} onChange={() => setItemType('existing')} style={{ marginRight: '5px', accentColor: '#d3b06d' }} />
                      Reabastecer Existente
                    </label>
                    <label style={{ color: '#fff', fontSize: '0.9rem' }}>
                      <input type="radio" checked={itemType === 'new'} onChange={() => setItemType('new')} style={{ marginRight: '5px', accentColor: '#d3b06d' }} />
                      Crear Producto Nuevo
                    </label>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {itemType === 'existing' ? (
                      <>
                        <select value={itemData.existingId} onChange={e => setItemData({...itemData, existingId: e.target.value})} style={{ width: '100%' }}>
                          <option value="">-- Selecciona producto del almacén --</option>
                          {inventory.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Stock actual: {p.stock || 0})</option>
                          ))}
                        </select>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Cantidad a ingresar</label>
                            <input type="number" placeholder="Cant." value={itemData.qty} onChange={e => setItemData({...itemData, qty: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Precio Compra Unit. (S/)</label>
                            <input type="number" step="0.01" placeholder="Costo" value={itemData.purchasePrice} onChange={e => setItemData({...itemData, purchasePrice: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Lote (Opcional)</label>
                            <input type="text" placeholder="Lote" value={itemData.batch} onChange={e => setItemData({...itemData, batch: e.target.value})} />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Fecha Vencimiento (Opcional)</label>
                            <input type="date" value={itemData.expiryDate} onChange={e => setItemData({...itemData, expiryDate: e.target.value})} style={{ width: '100%' }} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                          <input type="text" placeholder="Nombre del Producto Nuevo" value={itemData.name} onChange={e => setItemData({...itemData, name: e.target.value})} />
                          <select value={itemData.category} onChange={e => setItemData({...itemData, category: e.target.value})}>
                            <option value="">Categoría</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <textarea placeholder="Descripción del producto" value={itemData.description} onChange={e => setItemData({...itemData, description: e.target.value})} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Cantidad</label>
                            <input type="number" placeholder="Cant." value={itemData.qty} onChange={e => setItemData({...itemData, qty: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Precio Compra</label>
                            <input type="number" step="0.01" placeholder="S/" value={itemData.purchasePrice} onChange={e => setItemData({...itemData, purchasePrice: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Precio Venta</label>
                            <input type="number" step="0.01" placeholder="S/" value={itemData.salePrice} onChange={e => setItemData({...itemData, salePrice: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>P. Por Mayor</label>
                            <input type="number" step="0.01" placeholder="S/" value={itemData.wholesalePrice} onChange={e => setItemData({...itemData, wholesalePrice: e.target.value})} />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Lote</label>
                            <input type="text" placeholder="Código Lote" value={itemData.batch} onChange={e => setItemData({...itemData, batch: e.target.value})} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Fecha Vencimiento</label>
                            <input type="date" value={itemData.expiryDate} onChange={e => setItemData({...itemData, expiryDate: e.target.value})} style={{ width: '100%' }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#aaa' }}>URL de Foto</label>
                          <input type="url" placeholder="https://..." value={itemData.image} onChange={e => setItemData({...itemData, image: e.target.value})} style={{ width: '100%' }} />
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="button" className="btn" onClick={handleAddItem} style={{ padding: '8px 15px' }}>✓ Agregar a la Factura</button>
                      <button type="button" className="btn2" onClick={() => setShowItemForm(false)} style={{ padding: '8px 15px' }}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Factura y Guardar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ color: '#aaa', fontWeight: 'bold' }}>Monto Total Factura (S/):</label>
                  <input type="number" step="0.01" required value={invoiceData.total} onChange={e => setInvoiceData({...invoiceData, total: e.target.value})} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d3b06d', width: '150px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn2" onClick={() => setShowInvoiceModal(false)}>Cancelar Todo</button>
                  <button type="submit" className="btn" disabled={loading}>{loading ? 'Guardando...' : 'GUARDAR COMPRA DEFINITIVA'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        {loading ? <p style={{color: '#d3b06d'}}>Cargando histórico de compras...</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Factura</th>
                <th>Proveedor (RUC)</th>
                <th>Ítems</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No hay compras registradas</td></tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.date || purchase.createdAt?.substring(0,10) || '—'}</td>
                    <td><strong>{purchase.invoiceNumber || '—'}</strong></td>
                    <td>{purchase.supplier} <br/><span style={{fontSize: '0.75rem', color: '#888'}}>{purchase.ruc}</span></td>
                    <td>{(purchase.items || []).length} prod(s)</td>
                    <td style={{color: '#ff4d4d', fontWeight: 'bold'}}>- S/ {(purchase.total || 0).toFixed(2)}</td>
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

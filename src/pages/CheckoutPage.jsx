import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  marginTop: '10px',
  borderRadius: '4px'
};

const defaultCenter = {
  lat: -12.0464, // Lima, Peru
  lng: -77.0428
};

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Paso actual (1: Direcciones, 2: Envío, 3: Pago)
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    celular: '',
    dni: '',
    pais: 'Perú',
    departamento: '',
    ciudad: '',
    distrito: '',
    direccion: '',
    direccionComplementaria: '',
    usarParaFactura: true,
    metodoEnvio: 'recojo',
    aceptaTerminos: false,
    metodoPago: '' // tarjeta, yape, etc
  });

  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Cargamos el script de Google Maps usando la API Key de entorno
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [e.target.name]: value});
  };

  const onLoad = (autocomplete) => {
    setAutocompleteRef(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef !== null) {
      const place = autocompleteRef.getPlace();
      if (place && place.formatted_address) {
        setFormData(prev => ({ ...prev, direccion: place.formatted_address }));
        
        // Si el lugar tiene coordenadas (geometry), actualizamos el mapa
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMapCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
        }
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    
    // Opcionalmente, podrías usar Geocoding inverso aquí para obtener el nombre de la calle, 
    // pero requeriría habilitar la API de Geocoding. Por ahora, solo ponemos el pin.
  };

  const handleNextStep = (step, e) => {
    if(e) e.preventDefault();
    setCurrentStep(step);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    if (!formData.aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);
    try {
      const sale = {
        userId: user?.uid || 'guest',
        customerInfo: formData,
        items: cart,
        total: cartTotal,
        date: serverTimestamp(),
        status: 'Pendiente de Pago'
      };
      
      await addDoc(collection(db, "sales"), sale);
      clearCart();
      setShowPaymentModal(false);
      alert("¡Pedido realizado con éxito! Nos contactaremos contigo para confirmar el pago.");
      navigate('/');
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error procesando el pedido.");
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 20px'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '20px', fontFamily: '"Cormorant Garamond", serif', color: '#d3b06d'}}>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/productos')} className="btn" style={{padding: '12px 25px', background: '#d3b06d', color: '#111', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          VOLVER A LA TIENDA
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '100px 5%', minHeight: '100vh', background: '#f5f5f5', color: '#333', fontFamily: 'Montserrat, sans-serif'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px'}}>
        
        {/* Lado Izquierdo - Acordeón de Pasos */}
        <div style={{flex: '1 1 600px'}}>
          <h2 style={{fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#111', marginBottom: '30px'}}>Finalizar Compra</h2>
          
          {/* PASO 1: DIRECCIONES */}
          <div style={stepContainerStyle(currentStep === 1)}>
            <div style={stepHeaderStyle} onClick={() => setCurrentStep(1)}>
              <h3 style={{fontSize: '1.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px'}}>1. DIRECCIONES</h3>
            </div>
            
            {currentStep === 1 && (
              <div style={stepBodyStyle}>
                <p style={{marginBottom: '20px', color: '#666', fontSize: '0.9rem'}}>La dirección seleccionada se utilizará tanto como de dirección personal (para la factura) como de dirección de entrega.</p>
                <form onSubmit={(e) => handleNextStep(2, e)} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Nombre</label>
                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Apellidos</label>
                    <input required type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Celular</label>
                    <input required type="tel" name="celular" value={formData.celular} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>DNI</label>
                    <input required type="text" name="dni" value={formData.dni} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>País</label>
                    <select name="pais" value={formData.pais} onChange={handleChange} style={inputStyle}>
                      <option value="Perú">Perú</option>
                    </select>
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Departamento</label>
                    <select required name="departamento" value={formData.departamento} onChange={handleChange} style={inputStyle}>
                      <option value="">-- por favor, seleccione --</option>
                      <option value="Lima">Lima</option>
                      <option value="Callao">Callao</option>
                    </select>
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Ciudad</label>
                    <input required type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Distrito</label>
                    <input required type="text" name="distrito" value={formData.distrito} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{...formRowStyle, alignItems: 'flex-start', flexDirection: 'column', marginBottom: '20px'}}>
                    <label style={{...labelStyle, width: '100%', marginBottom: '5px', fontWeight: 'bold'}}>Dirección de Entrega</label>
                    {isLoaded ? (
                      <div style={{width: '100%'}}>
                        <Autocomplete 
                          onLoad={onLoad} 
                          onPlaceChanged={onPlaceChanged} 
                          style={{width: '100%'}}
                          options={{ componentRestrictions: { country: 'pe' } }}
                        >
                          <input 
                            required 
                            type="text" 
                            name="direccion" 
                            value={formData.direccion} 
                            onChange={handleChange} 
                            placeholder="Empieza a escribir tu calle y selecciona una opción..." 
                            style={{...inputStyle, width: '100%', padding: '12px'}} 
                          />
                        </Autocomplete>
                        
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={mapCenter}
                          zoom={14}
                          onClick={handleMapClick}
                          options={{ streetViewControl: false, mapTypeControl: false }}
                        >
                          {markerPosition && (
                            <Marker position={markerPosition} />
                          )}
                        </GoogleMap>
                        <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
                          *Escribe tu dirección arriba para autocompletar. Puedes verificar tu ubicación en el mapa.
                        </p>
                      </div>
                    ) : (
                      <input 
                        required 
                        type="text" 
                        name="direccion" 
                        value={formData.direccion} 
                        onChange={handleChange} 
                        style={{...inputStyle, width: '100%'}} 
                        placeholder="Cargando mapa de Google..."
                      />
                    )}
                  </div>
                  <div style={formRowStyle}>
                    <label style={labelStyle}>Dirección Complementaria</label>
                    <input type="text" name="direccionComplementaria" value={formData.direccionComplementaria} onChange={handleChange} placeholder="Opcional" style={inputStyle} />
                  </div>
                  
                  <div style={{marginTop: '10px'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem'}}>
                      <input type="checkbox" name="usarParaFactura" checked={formData.usarParaFactura} onChange={handleChange} />
                      Utilizar esta dirección para facturas también
                    </label>
                  </div>

                  <div style={{marginTop: '20px'}}>
                    <button type="submit" style={btnDarkStyle}>CONTINUAR</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* PASO 2: MÉTODO DE ENVÍO */}
          <div style={stepContainerStyle(currentStep === 2)}>
            <div style={stepHeaderStyle} onClick={() => { if(formData.nombre) setCurrentStep(2) }}>
              <h3 style={{fontSize: '1.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px'}}>2. MÉTODO DE ENVÍO</h3>
            </div>
            
            {currentStep === 2 && (
              <div style={stepBodyStyle}>
                <form onSubmit={(e) => handleNextStep(3, e)}>
                  
                  {/* Opción 1: Recojo */}
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '15px'}}>
                    <input type="radio" name="metodoEnvio" value="recojo" checked={formData.metodoEnvio === 'recojo'} onChange={handleChange} style={{marginTop: '5px'}} />
                    <div style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <strong>Recojo en Estudio</strong>
                        <p style={{color: '#666', fontSize: '0.9rem', marginTop: '5px', lineHeight: '1.5'}}>
                          Recoge en Lurigancho - Chosica, Lima.<br/>
                          Con previa cita coordinada.<br/>
                          Válido para compras en la web con cualquier medio de pago. Puedes recoger tu pedido al día siguiente.
                        </p>
                      </div>
                      <div style={{fontWeight: 'bold', color: '#555'}}>Gratis</div>
                    </div>
                  </div>

                  {/* Opción 2: Delivery */}
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '15px'}}>
                    <input type="radio" name="metodoEnvio" value="delivery" checked={formData.metodoEnvio === 'delivery'} onChange={handleChange} style={{marginTop: '5px'}} />
                    <div style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <strong>Delivery</strong>
                        <p style={{color: '#666', fontSize: '0.9rem', marginTop: '5px', lineHeight: '1.5'}}>
                          Envío directo a tu domicilio en Lima Metropolitana y Callao.<br/>
                          El costo de envío se coordinará internamente tras tu compra.
                        </p>
                      </div>
                      <div style={{fontWeight: 'bold', color: '#555'}}>Por coordinar</div>
                    </div>
                  </div>

                  {/* Opción 3: Envío por Agencia */}
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                    <input type="radio" name="metodoEnvio" value="agencia" checked={formData.metodoEnvio === 'agencia'} onChange={handleChange} style={{marginTop: '5px'}} />
                    <div style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                        <strong>Envío por Agencia</strong>
                        <p style={{color: '#666', fontSize: '0.9rem', marginTop: '5px', lineHeight: '1.5'}}>
                          Para envíos a provincias de todo el Perú (Shalom, Olva Courier, etc.).<br/>
                          Pago del flete en destino o según coordinación.
                        </p>
                      </div>
                      <div style={{fontWeight: 'bold', color: '#555'}}>Pago en destino</div>
                    </div>
                  </div>

                  <div style={{marginTop: '25px', display: 'flex', justifyContent: 'flex-end'}}>
                    <button type="submit" style={btnDarkStyle}>CONTINUAR</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* PASO 3: PAGO */}
          <div style={stepContainerStyle(currentStep === 3)}>
            <div style={stepHeaderStyle} onClick={() => { if(formData.metodoEnvio) setCurrentStep(3) }}>
              <h3 style={{fontSize: '1.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px'}}>3. PAGO</h3>
            </div>
            
            {currentStep === 3 && (
              <div style={stepBodyStyle}>
                <form onSubmit={(e) => { e.preventDefault(); setShowSummaryModal(true); }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                    <input required type="radio" name="pagoOpcion" value="tarjeta_yape" defaultChecked style={{accentColor: '#333'}} />
                    <span style={{fontSize: '0.95rem'}}>Paga con tarjeta de crédito/débito, Yape o Plin</span>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px'}}>
                    <input required type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleChange} style={{accentColor: '#333'}} />
                    <span style={{fontSize: '0.9rem'}}>
                      Estoy de acuerdo con los <span onClick={() => setShowTermsModal(true)} style={{textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}}>términos del servicio</span> y los acepto sin reservas.
                    </span>
                  </div>

                  <div>
                    <button type="submit" style={{...btnDarkStyle, padding: '15px 30px', fontSize: '0.9rem'}}>REALIZAR PEDIDO</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho - Resumen */}
        <div style={{flex: '1 1 350px'}}>
          <div style={{background: '#fff', padding: '30px', border: '1px solid #ddd'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '25px', color: '#111', paddingBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px'}}>Resumen del Pedido</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px'}}>
              {cart.map(item => (
                <div key={item.id} style={{display: 'flex', gap: '15px', alignItems: 'center', position: 'relative'}}>
                  <div style={{width: '60px', height: '60px', background: '#f5f5f5', border: '1px solid #eee', flexShrink: 0}}>
                     {item.image ? <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>🧴</div>}
                  </div>
                  <div style={{flex: 1}}>
                    <h4 style={{fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: '#333', paddingRight: '15px', fontWeight: 'bold'}}>{item.name}</h4>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{display: 'flex', alignItems: 'center', border: '1px solid #ddd', background: '#fff'}}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{background: 'none', border: 'none', color: '#333', padding: '2px 8px', cursor: 'pointer'}}>-</button>
                        <span style={{fontSize: '0.85rem', width: '20px', textAlign: 'center'}}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{background: 'none', border: 'none', color: '#333', padding: '2px 8px', cursor: 'pointer'}}>+</button>
                      </div>
                      <span style={{color: '#111', fontWeight: 'bold', fontSize: '0.85rem'}}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} style={{position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1rem', lineHeight: 1}}>
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '0.9rem'}}>
              <span>Subtotal</span>
              <span>S/ {cartTotal.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#555', fontSize: '0.9rem', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
              <span>Transporte</span>
              <span>S/ 0.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: '#111'}}>
              <span>Total (impuestos inc.)</span>
              <span>S/ {cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTermsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowTermsModal(false)} style={modalCloseStyle}>&times;</button>
            <h2 style={{fontSize: '1.5rem', marginBottom: '20px', fontFamily: '"Cormorant Garamond", serif', color: '#d3b06d'}}>Política de Cambios y Devoluciones</h2>
            
            <div style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px'}}>
              <p style={{marginBottom: '15px'}}>Si eres nueva en nuestra comunidad, te contamos que todos nuestros productos están hechos a base de ACEITES NATURALES, por ello, te recomendamos que revises la descripción, ingredientes y detalles del producto que deseas adquirir para que quedes satisfecha con tu compra.</p>
              
              <p style={{marginBottom: '15px'}}>Cuando llegue tu pedido, inspecciona el paquete para ver si tiene daños que se puedan haber producido durante el transporte. Es normal que las cajas de cartón muestren un poco de desgaste, pero si se produjo algún daño en los artículos durante el envío, conserve la caja, el material de embalaje y los artículos incluidos, y póngase en contacto con nosotros de inmediato a <strong>contacto@patriciaguillenvaler.com</strong></p>
              
              <p style={{marginBottom: '15px'}}>Antes de solicitar una devolución o cambio de producto, ten en cuenta que los colores y texturas de nuestros productos pueden variar dependiendo del batch producido debido a la consistencia de los insumos y la temperatura.</p>
              
              <h4 style={{fontSize: '1.1rem', color: '#fff', marginTop: '20px', marginBottom: '10px'}}>Cómo devolver o cambiar un producto</h4>
              <p style={{marginBottom: '15px'}}>Si no estás satisfecho con los productos que compraste por algún desperfecto que pudieran presentar, tienes 7 días para exigir la devolución de tu dinero o para pedir un cambio, siempre y cuando cumplas con las siguientes condiciones:</p>
              <ul style={{marginLeft: '20px', marginBottom: '15px', listStyleType: 'disc'}}>
                <li>Todos los productos tienen que venir en su empaque original y con todas las etiquetas intactas.</li>
                <li>Todos los productos tienen que estar nuevos y sin usar.</li>
                <li>Tienes 7 días útiles, desde que recibiste el producto, para devolverlo a nuestras oficinas.</li>
              </ul>
              <p style={{marginBottom: '15px'}}>Al devolver o cambiar un producto, es muy importante que envíes un correo a contacto@patriciaguillenvaler.com con la información de por qué deseas realizar la devolución y esperar nuestra respuesta aprobando tu solicitud.</p>

              <h4 style={{fontSize: '1.1rem', color: '#fff', marginTop: '20px', marginBottom: '10px'}}>Política de pedidos no recogidos en Estudio</h4>
              <p style={{marginBottom: '15px'}}>Los pedidos seleccionados bajo la modalidad de recojo deberán ser recogidos dentro de un plazo máximo de 90 días calendario desde la fecha de compra.</p>
              <p style={{marginBottom: '15px'}}>Transcurrido dicho plazo sin que el cliente haya realizado el recojo del pedido, Patricia Guillén Valer podrá proceder con la cancelación automática del mismo.</p>
              <p style={{marginBottom: '15px'}}>En estos casos, el cliente podrá solicitar la emisión de una nota de crédito equivalente al monto pagado, la cual podrá ser utilizada en futuras compras. Para gestionar la nota de crédito, el cliente deberá comunicarse con nuestros canales oficiales de atención.</p>
            </div>
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button onClick={() => setShowTermsModal(false)} style={{padding: '10px 20px', background: '#d3b06d', color: '#111', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}>ACEPTAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resumen de Datos */}
      {showSummaryModal && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, background: '#fff', color: '#333', maxWidth: '500px'}}>
            <button onClick={() => setShowSummaryModal(false)} style={{...modalCloseStyle, color: '#999'}}>&times;</button>
            <h2 style={{fontSize: '1.4rem', marginBottom: '20px', fontFamily: '"Cormorant Garamond", serif', color: '#111'}}>¿Tus datos son correctos?</h2>
            
            <div style={{fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '25px', background: '#f9f9f9', padding: '20px', border: '1px solid #eee'}}>
              <p><strong>Nombre:</strong> {formData.nombre} {formData.apellidos}</p>
              <p><strong>Celular:</strong> {formData.celular}</p>
              <p><strong>DNI:</strong> {formData.dni}</p>
              <p><strong>Dirección:</strong> {formData.direccion}</p>
              <p><strong>Ubicación:</strong> {formData.distrito}, {formData.ciudad}, {formData.departamento}, {formData.pais}</p>
              {formData.direccionComplementaria && <p><strong>Ref:</strong> {formData.direccionComplementaria}</p>}
              <p style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd'}}>
                <strong>Envío:</strong> {
                  formData.metodoEnvio === 'recojo' ? 'Recojo en Estudio' :
                  formData.metodoEnvio === 'delivery' ? 'Delivery' : 'Envío por Agencia'
                }
              </p>
            </div>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={() => {
                setShowSummaryModal(false);
                setCurrentStep(1); // Regresa a direcciones
              }} style={{flex: 1, padding: '12px', background: '#eee', color: '#333', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}>
                EDITAR DATOS
              </button>
              
              <button onClick={() => {
                setShowSummaryModal(false);
                setShowPaymentModal(true);
              }} style={{flex: 1, padding: '12px', background: '#111', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}>
                SÍ, CONTINUAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago (Fake Payment Gateway) */}
      {showPaymentModal && (
        <div style={modalOverlayStyle}>
          <div style={{...modalContentStyle, background: '#eee', color: '#333', maxWidth: '400px', textAlign: 'center'}}>
            <button onClick={() => setShowPaymentModal(false)} style={{...modalCloseStyle, color: '#666'}}>&times;</button>
            <h3 style={{fontSize: '1.1rem', marginBottom: '25px', color: '#555'}}>Elige un medio de pago</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left'}}>
              
              <label style={paymentOptionStyle}>
                <input type="radio" name="gateway" value="tarjeta" defaultChecked style={{accentColor: '#111'}} />
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px'}}>Tarjeta de crédito y/o débito</div>
                  <div style={{fontSize: '0.8rem', color: '#666', marginBottom: '10px'}}>Realiza tu pago en cuotas o directo</div>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <span style={payBadge}>VISA</span>
                    <span style={payBadge}>MC</span>
                    <span style={payBadge}>AMEX</span>
                  </div>
                </div>
              </label>

              <label style={paymentOptionStyle}>
                <input type="radio" name="gateway" value="qr" style={{accentColor: '#111'}} />
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px'}}>Código QR Usando tu billetera</div>
                  <div style={{display: 'flex', gap: '5px'}}>
                    <span style={{...payBadge, background: '#742384', color: '#fff'}}>Yape</span>
                    <span style={{...payBadge, background: '#00d7d2', color: '#fff'}}>Plin</span>
                  </div>
                </div>
              </label>

            </div>

            <button onClick={handlePlaceOrder} disabled={loading} style={{
              background: '#0d1117', color: '#fff', width: '100%', padding: '15px', marginTop: '25px', 
              border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              {loading ? 'PROCESANDO...' : 'Continuar'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// Styles
const stepContainerStyle = (isActive) => ({
  background: '#fff',
  border: '1px solid #ddd',
  marginBottom: '20px',
  opacity: isActive ? 1 : 0.6,
  transition: 'opacity 0.3s'
});
const stepHeaderStyle = {
  padding: '20px 30px',
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
  background: '#fafafa'
};
const stepBodyStyle = {
  padding: '30px'
};
const formRowStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px'
};
const labelStyle = {
  width: '180px',
  fontSize: '0.9rem',
  color: '#555'
};
const inputStyle = {
  flex: 1,
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '2px',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  background: '#fff',
  color: '#333',
  outline: 'none'
};
const btnDarkStyle = {
  background: '#333',
  color: '#fff',
  border: 'none',
  padding: '12px 25px',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  letterSpacing: '1px'
};
const modalOverlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
  display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
};
const modalContentStyle = {
  background: '#1a1a1a', padding: '40px', borderRadius: '8px', position: 'relative',
  width: '100%', maxWidth: '700px'
};
const modalCloseStyle = {
  position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none',
  color: '#aaa', fontSize: '2rem', cursor: 'pointer', lineHeight: 1
};
const paymentOptionStyle = {
  display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '15px', 
  border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#fafafa'
};
const payBadge = {
  background: '#ddd', padding: '2px 6px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold'
};

export default CheckoutPage;

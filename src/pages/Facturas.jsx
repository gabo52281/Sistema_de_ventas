// ✅ Facturas.jsx Mejorado con formato COP y total en tiempo real
import React, { useEffect, useState, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axios';
import { ToastContext } from '../context/ToastContext';

// ✅ Función para formatear moneda COP
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const Facturas = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [items, setItems] = useState([]);
  const [suggestionsIndex, setSuggestionsIndex] = useState(-1);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cedulaBusqueda, setCedulaBusqueda] = useState('');
  const [facturaCreada, setFacturaCreada] = useState(null);
  const [pagoCliente, setPagoCliente] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const { addToast } = useContext(ToastContext);

  // ✅ Cargar productos y clientes
  useEffect(() => {
    api.get('/productos').then(r => setProductos(r.data));
    api.get('/clientes').then(r => setClientes(r.data));
  }, []);

  // ✅ Total actual en tiempo real
  const totalActual = items.reduce((sum, item) => {
    const producto = productos.find(p => p.id_producto == item.id_producto);
    return sum + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  // ✅ Calcular vuelto con totalActual
  useEffect(() => {
    const pago = Number(pagoCliente) || 0;
    setVuelto(pago - totalActual);
  }, [pagoCliente, totalActual]);

  const addItem = () =>
  setItems([...items, { id_producto: '', cantidad: 1, query: '' }]);

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    // normalizar cantidad a número
    if (field === 'cantidad') {
      newItems[idx][field] = Number(value);
    } else {
      newItems[idx][field] = value;
    }
    setItems(newItems);
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const crearFactura = async (e) => {
    e.preventDefault();
    const payload = {
      productos: items.map(i => ({ id_producto: Number(i.id_producto), cantidad: Number(i.cantidad) })),
      id_cliente: clienteSeleccionado || null,
    };
    const res = await api.post('/facturas/crear', payload);
    setFacturaCreada(res.data);
    setItems([]);
    setClienteSeleccionado('');
    setPagoCliente('');
  };

  const buscarClientePorCedula = () => {
    const ced = cedulaBusqueda.trim();
    if (!ced) return addToast('Ingresa la cédula a buscar', 'error');
    const encontrado = clientes.find(c => String(c.cedula) === ced);
    if (encontrado) {
      setClienteSeleccionado(encontrado.id_cliente);
      setCedulaBusqueda('');
    } else {
      addToast('Cliente no encontrado', 'error');
    }
  };

  const clienteObj = clientes.find(c => String(c.id_cliente) === String(clienteSeleccionado));
const clearItems = () => {
  setItems([]);
};

const assignIdByName = (idx) => {
  const text = items[idx].query?.trim().toLowerCase();
  if (!text) return;
  const matched = productos.find(p => p.nombre.toLowerCase() === text);
  if (matched) {
    updateItem(idx, 'id_producto', matched.id_producto);
  }
};


  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-2">
        <h1 className="text-2xl font-bold mb-2">Crear Factura</h1>

        <form onSubmit={crearFactura}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
           {/* Left: productos (col-span 8) */}
<div className="md:col-span-8 bg-white p-6 rounded-xl shadow max-h-[80vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Productos</h2>
              <div className="space-y-2">
                {items.map((it, idx) => {
                  const q = String(it.query || '');
                  const filtered = productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()));
                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="flex-1 relative">
                   <input
  className={`w-full border p-2 rounded-lg
    ${it.id_producto ? 'border-green-400' : 'border-red-600'}`}
  value={it.query || ''}
  onChange={e => {
    const value = e.target.value;
    updateItem(idx, 'query', value);
    updateItem(idx, 'id_producto', ''); // resetear id mientras escribe
  }}
  onFocus={() => setSuggestionsIndex(idx)}
  onBlur={() => {
    setTimeout(() => setSuggestionsIndex(-1), 150);
    assignIdByName(idx); // asignar id si el nombre coincide
  }}
  placeholder="Escribe para buscar producto..."
/>

                        {suggestionsIndex === idx && filtered.length > 0 && (
                          <ul className="absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-auto w-full shadow-lg left-0 right-0">
                            {filtered.map(p => (
                              <li key={p.id_producto} className="p-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => {
                                  // seleccionar producto
                                  updateItem(idx, 'id_producto', p.id_producto);
                                  updateItem(idx, 'query', p.nombre);
                                  setSuggestionsIndex(-1);
                                }}>
                                {p.nombre} — {formatCurrency(p.precio)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <input type="number" className="w-24 border border-gray-300 p-2 rounded-lg " value={it.cantidad}
                        onChange={e => updateItem(idx, 'cantidad', e.target.value)} />
                      <button type="button" onClick={() => removeItem(idx)} className="ml-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded">Eliminar</button>
                    </div>
                  );
                })}
              </div>
                <div className="mt-3  flex gap-2">
                  <button type="button" onClick={addItem} className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">Añadir producto</button>
                   {items.length > 0 && (
    <button
      type="button"
      onClick={clearItems}
      className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
    >
      Limpiar todo
    </button>
  )}
                </div>
              </div>

            {/* Right: cliente + total (col-span 4) */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-3">Datos del Cliente</h2>
                <label className="block text-sm text-black-400 mb-1">Cliente (opcional):</label>
                <select className="w-full border border-gray-300 p-2 rounded-lg mb-3" value={clienteSeleccionado} onChange={e => setClienteSeleccionado(e.target.value)}>
                  <option value="">Sin cliente</option>
                  {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
                </select>

                <label className="block text-sm text-black-400 mb-1">Buscar por cédula:</label>
                <div className="flex gap-2 mb-3">
                  <input className="flex-1 min-w-0 border-gray-300 p-2 rounded-lg" value={cedulaBusqueda} onChange={e => setCedulaBusqueda(e.target.value)} placeholder="Cédula" />
                  <button type="button" onClick={buscarClientePorCedula} className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg cursor-pointer">Buscar</button>
                </div>

                {clienteObj && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                    <p className="font-medium">{clienteObj.nombre}</p>
                    <p className="text-sm text-black-400">Cédula: {clienteObj.cedula}</p>
                    <button type="button" onClick={() => setClienteSeleccionado('')} className="text-sm text-red-600 mt-2 cursor-pointer">Quitar</button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-lg font-semibold mb-2">Total</p>
                <p className="text-2xl font-bold mb-4">{formatCurrency(totalActual)}</p>
                {/* ✅ Detalle de productos agregados */}
                  {items.length > 0 && (
                    <div className="mb-4 border-t pt-3">
                      <p className="text-sm font-semibold mb-2">Detalle:</p>
                      <ul className="space-y-1 max-h-32 overflow-auto text-sm">
                        {items.map((it, idx) => {
                          const p = productos.find(prod => prod.id_producto == it.id_producto);
                          if (!p) return null;
                          return (
                            <li key={idx} className="flex justify-between">
                              <span>{it.cantidad} × {p.nombre}</span>
                              <span>{formatCurrency(p.precio * it.cantidad)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                <label className="block text-sm text-black-400 mb-1 ">Monto pagado</label>
                <input type="text" className="w-full p-2 rounded-lg mb-3 border border-black"
                  placeholder="Ej: 50.000"
                  value={pagoCliente ? formatCurrency(pagoCliente) : ''}
                  onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ''); setPagoCliente(raw); }} />
                <p className="text-sm text-black-400">Vuelto: {formatCurrency(vuelto)}</p>
              </div>

              <div className="sticky bottom-6">
                <button
                  type="submit"
                  disabled={items.length === 0 || (Number(pagoCliente) || 0) < totalActual}
                  className={`cursor-pointer w-full py-3 rounded-lg text-white font-semibold ${
                    items.length === 0 || (Number(pagoCliente) || 0) < totalActual
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Crear factura
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal simple para factura creada */}
        {facturaCreada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
              <h2 className="text-xl font-semibold mb-3">Factura #{facturaCreada.id_factura}</h2>
              <p>Total: {formatCurrency(facturaCreada.total)}</p>
              <p>Cliente: {facturaCreada.cliente || 'N/A'}</p>
              <p>Fecha: {new Date(facturaCreada.fecha).toLocaleString()}</p>
              <p>Vuelto: {formatCurrency(vuelto)}</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setFacturaCreada(null)} className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Facturas;

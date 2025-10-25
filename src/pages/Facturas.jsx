// ✅ Facturas.jsx Mejorado con formato COP, total en tiempo real y validación de stock
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
  const [resumenFactura, setResumenFactura] = useState(null);

  // ✅ Cargar productos y clientes
  useEffect(() => {
    api.get('/productos').then(r => setProductos(r.data));
    api.get('/clientes').then(r => setClientes(r.data));
  }, []);

  // ✅ Total actual en tiempo real
  const totalActual = items.reduce((sum, item) => {
    const producto = productos.find(p => p.id_producto === item.id_producto);
    return sum + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  // ✅ Calcular vuelto con totalActual
  useEffect(() => {
    const pago = Number(pagoCliente) || 0;
    setVuelto(pago - totalActual);
  }, [pagoCliente, totalActual]);

  // ✅ Añadir un producto vacío
  const addItem = () => setItems([...items, { id_producto: '', cantidad: 1, query: '' }]);

  // ✅ Actualizar item
  const updateItem = (idx, field, value) => {
    const newItems = [...items];

    if (field === 'cantidad') {
      newItems[idx][field] = value === '' ? '' : Number(value);
    } else {
      newItems[idx][field] = value;
    }

    setItems(newItems);
  };

  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const clearItems = () => setItems([]);

  // ✅ Buscar cliente por cédula
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

  // ✅ Asignar ID de producto según el nombre
  const assignIdByName = (idx) => {
    const text = items[idx].query?.trim().toLowerCase();
    if (!text) return;
    const matched = productos.find(p => p.nombre.toLowerCase() === text);
    if (matched) {
      updateItem(idx, 'id_producto', matched.id_producto);
    }
  };

  // ✅ Validar stock de todos los productos
  const stockSuficiente = items.every(item => {
    const producto = productos.find(p => p.id_producto === item.id_producto);
    return producto && item.cantidad <= producto.stock;
  });

  // ✅ Crear factura
  const crearFactura = async (e) => {
    e.preventDefault();

    // Validar stock antes de enviar
    const itemConStockInsuficiente = items.find(item => {
      const p = productos.find(prod => prod.id_producto === item.id_producto);
      return p && item.cantidad > p.stock;
    });
    if (itemConStockInsuficiente) {
      addToast(`Stock insuficiente para "${productos.find(p => p.id_producto === itemConStockInsuficiente.id_producto)?.nombre}"`, 'error');
      return;
    }

    const payload = {
      productos: items.map(i => ({ id_producto: Number(i.id_producto), cantidad: Number(i.cantidad) })),
      id_cliente: clienteSeleccionado || null,
    };

    const res = await api.post('/facturas/crear', payload);

    setResumenFactura({
      total: totalActual,
      pago: Number(pagoCliente),
      vuelto: Number(vuelto),
    });

    setFacturaCreada(res.data);

    setItems([]);
    setClienteSeleccionado('');
    setPagoCliente('');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-2">
        <h1 className="text-2xl font-bold mb-2">Crear Factura</h1>

        <form onSubmit={crearFactura}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Productos */}
            <div className="md:col-span-8 bg-white p-6 rounded-xl shadow max-h-[80vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Productos</h2>
              <div className="space-y-2">
                {items.map((it, idx) => {
                  const q = String(it.query || '');
                  const filtered = productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()));
                  const producto = productos.find(p => p.id_producto === it.id_producto);
                  const stockInsuficiente = producto && it.cantidad > producto.stock;

                  return (
                    <div key={idx} className="flex gap-4 items-center flex-col md:flex-row">
                      <div className="flex-1 relative w-full">
                        <input
                          className={`w-full border p-2 rounded-lg
                            ${it.id_producto ? 'border-green-400' : 'border-red-600'}`}
                          value={it.query || ''}
                          onChange={e => {
                            const value = e.target.value;
                            updateItem(idx, 'query', value);
                            updateItem(idx, 'id_producto', '');
                          }}
                          onFocus={() => setSuggestionsIndex(idx)}
                          onBlur={() => {
                            setTimeout(() => setSuggestionsIndex(-1), 150);
                            assignIdByName(idx);
                          }}
                          placeholder="Escribe para buscar producto..."
                        />
                        {suggestionsIndex === idx && filtered.length > 0 && (
                          <ul className="absolute z-50 bg-white border rounded mt-1 max-h-60 overflow-auto w-full shadow-lg left-0 right-0">
                            {filtered.map(p => (
                              <li
                                key={p.id_producto}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => {
                                  updateItem(idx, 'id_producto', p.id_producto);
                                  updateItem(idx, 'query', p.nombre);
                                  setSuggestionsIndex(-1);
                                }}
                              >
                                {p.nombre} — {formatCurrency(p.precio)} ({p.stock} disponibles)
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <input
                          type="number"
                          className="w-24 border border-gray-300 p-2 rounded-lg"
                          value={it.cantidad === '' ? '' : it.cantidad}
                          onChange={(e) => updateItem(idx, 'cantidad', e.target.value)}
                        />
                        {stockInsuficiente && (
                          <p className="text-red-600 text-sm">Stock insuficiente ({producto.stock} disponibles)</p>
                        )}

                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="ml-0 md:ml-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded mt-1 md:mt-0"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-2">
                <button type="button" onClick={addItem} className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                  Añadir producto
                </button>
                {items.length > 0 && (
                  <button type="button" onClick={clearItems} className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                    Limpiar todo
                  </button>
                )}
              </div>
            </div>

            {/* Right: Cliente + Total */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-3">Datos del Cliente</h2>
                <label className="block text-sm text-black-400 mb-1">Cliente (opcional):</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-lg mb-3"
                  value={clienteSeleccionado}
                  onChange={e => setClienteSeleccionado(e.target.value)}
                >
                  <option value="">Sin cliente</option>
                  {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
                </select>

                <label className="block text-sm text-black-400 mb-1">Buscar por cédula:</label>
                <div className="flex gap-2 mb-3">
                  <input
                    className="flex-1 min-w-0 border-gray-300 p-2 rounded-lg"
                    value={cedulaBusqueda}
                    onChange={e => setCedulaBusqueda(e.target.value)}
                    placeholder="Cédula"
                  />
                  <button
                    type="button"
                    onClick={buscarClientePorCedula}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg cursor-pointer"
                  >
                    Buscar
                  </button>
                </div>

                {clienteObj && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                    <p className="font-medium">{clienteObj.nombre}</p>
                    <p className="text-sm text-black-400">Cédula: {clienteObj.cedula}</p>
                    <button
                      type="button"
                      onClick={() => setClienteSeleccionado('')}
                      className="text-sm text-red-600 mt-2 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-lg font-semibold mb-2">Total</p>
                <p className="text-2xl font-bold mb-4">{formatCurrency(totalActual)}</p>

                {items.length > 0 && (
                  <div className="mb-4 border-t pt-3">
                    <p className="text-sm font-semibold mb-2">Detalle:</p>
                    <ul className="space-y-1 max-h-32 overflow-auto text-sm">
                      {items.map((it, idx) => {
                        const p = productos.find(prod => prod.id_producto === it.id_producto);
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

                <label className="block text-sm text-black-400 mb-1">Monto pagado</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg mb-3 border border-black"
                  placeholder="Ej: 50.000"
                  value={pagoCliente ? formatCurrency(pagoCliente) : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setPagoCliente(raw);
                  }}
                />

                {pagoCliente !== '' && (
                  Number(pagoCliente) >= totalActual ? (
                    <p className="text-sm font-medium text-green-600">Vuelto: {formatCurrency(vuelto)}</p>
                  ) : (
                    <p className="text-sm font-medium text-red-600">Falta: {formatCurrency(totalActual - Number(pagoCliente))}</p>
                  )
                )}
              </div>

              {/* ✅ Botón Crear Factura con validación stock */}
              <div className="sticky bottom-6">
                <button
                  type="submit"
                  disabled={items.length === 0 || (Number(pagoCliente) || 0) < totalActual || !stockSuficiente}
                  className={`cursor-pointer w-full py-3 rounded-lg text-white font-semibold ${
                    items.length === 0 || (Number(pagoCliente) || 0) < totalActual || !stockSuficiente
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

        {/* Modal Factura Creada */}
        {facturaCreada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Factura Creada</h2>
                  <p className="text-blue-100 text-sm mt-1">#{facturaCreada.id_factura}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Cliente:</span>
                    <span className="font-semibold text-gray-900">{facturaCreada.cliente || 'General'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Fecha:</span>
                    <span className="text-sm text-gray-900">{new Date(facturaCreada.fecha).toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Total a pagar</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(resumenFactura?.total || facturaCreada.total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pago recibido</span>
                    <span className="text-lg font-semibold text-green-600">{formatCurrency(resumenFactura?.pago || 0)}</span>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">Vuelto a devolver</span>
                      <span className="text-2xl font-bold text-green-700">{formatCurrency(resumenFactura?.vuelto || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFacturaCreada(null);
                    setResumenFactura(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Facturas;

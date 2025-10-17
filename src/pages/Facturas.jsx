import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'

const Facturas = () => {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [items, setItems] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  const [facturaCreada, setFacturaCreada] = useState(null)

  useEffect(()=>{ api.get('/productos').then(r=>setProductos(r.data)); api.get('/clientes').then(r=>setClientes(r.data)) }, [])

  const addItem = () => setItems([...items, { id_producto: productos[0]?.id_producto, cantidad: 1 }])
  const updateItem = (idx, field, value) => { const copy = [...items]; copy[idx][field] = value; setItems(copy) }

  const crearFactura = async (e) => {
    e.preventDefault()
    const payload = {
      productos: items.map(i => ({ id_producto: i.id_producto, cantidad: Number(i.cantidad) })),
      id_cliente: clienteSeleccionado || null
    }
    const res = await api.post('/facturas/crear', payload)
    setFacturaCreada(res.data)
    setItems([])
    setClienteSeleccionado('')
  }

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Crear Factura</h1>
        <form onSubmit={crearFactura}>
          <div className="mb-4">
            <label>Cliente (opcional)</label>
            <select className="block w-full border p-2 rounded" value={clienteSeleccionado} onChange={e=>setClienteSeleccionado(e.target.value)}>
              <option value="">Sin cliente</option>
              {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
            </select>
          </div>

          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <select className="flex-1 border p-2 rounded" value={it.id_producto} onChange={e=>updateItem(idx,'id_producto', e.target.value)}>
                {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} — {p.precio}</option>)}
              </select>
              <input className="w-24 border p-2 rounded" type="number" value={it.cantidad} onChange={e=>updateItem(idx,'cantidad', e.target.value)} />
            </div>
          ))}

          <div className="flex gap-2 mb-4">
            <button type="button" onClick={addItem} className="bg-green-600 text-white px-4 py-2 rounded">Añadir producto</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Crear factura</button>
          </div>
        </form>

        {facturaCreada && (
          <div className="bg-white p-4 rounded shadow my-4">
            <h2 className="text-xl font-semibold mb-2">Factura #{facturaCreada.id_factura}</h2>
            <p>Total: ${facturaCreada.total}</p>
            <p>Cliente: {facturaCreada.cliente || 'N/A'}</p>
            <p>Fecha: {new Date(facturaCreada.fecha).toLocaleString()}</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
export default Facturas
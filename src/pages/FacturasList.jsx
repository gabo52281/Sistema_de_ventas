import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'

const FacturasList = () => {
  const [facturas, setFacturas] = useState([])

  useEffect(() => {
    api.get('/facturas').then(res => setFacturas(res.data))
  }, [])

  const [search, setSearch] = useState('')
  const facturasFiltradas = facturas.filter(f =>
  f.cliente.toLowerCase().includes(search.toLowerCase()) ||
  f.vendedor.toLowerCase().includes(search.toLowerCase())
)


  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Listado de Facturas</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por cliente o vendedor..." />

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {facturasFiltradas.map(f => (
              <tr key={f.id_factura} className="border-t">
                <td className="p-2">{f.id_factura}</td>
                <td className="p-2">{f.cliente || 'N/A'}</td>
                <td className="p-2">${f.total}</td>
                <td className="p-2">{new Date(f.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}
export default FacturasList

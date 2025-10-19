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
        <table className="min-w-full w-full table-fixed text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 w-12 text-left align-middle">ID</th>
              <th className="p-2 w-1/3 text-left align-middle">Cliente</th>
              <th className="p-2 w-24 text-right align-middle">Total</th>
              <th className="p-2 w-48 text-left align-middle">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {facturasFiltradas.map(f => (
              <tr key={f.id_factura} className="border-t hover:bg-gray-50">
                <td className="p-2 align-middle">{f.id_factura}</td>
                <td className="p-2 align-middle">{f.cliente || 'N/A'}</td>
                <td className="p-2 text-right align-middle">${f.total}</td>
                <td className="p-2 align-middle">{new Date(f.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}
export default FacturasList

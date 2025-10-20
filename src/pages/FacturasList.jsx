import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'

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

      <DataTable
        columns={[
          { key: 'id_factura', label: '#', className: 'w-12 text-left align-middle' },
          { key: 'cliente', label: 'Cliente', className: 'w-1/3 text-left align-middle' },
          { key: 'total', label: 'Total', className: 'w-1/4 text-left align-middle', render: (r) => `$${r.total}` },
          { key: 'fecha', label: 'Fecha', className: 'w-1/3 text-left align-middle', render: (r) => new Date(r.fecha).toLocaleString() }
        ]}
        data={facturasFiltradas}
        rowKey="id_factura"
      />
    </MainLayout>
  )
}
export default FacturasList

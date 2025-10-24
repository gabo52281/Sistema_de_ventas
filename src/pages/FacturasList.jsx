import React, { useEffect, useState, useContext } from 'react' 
import MainLayout from '../layouts/MainLayout' 
import api from '../api/axios' 
import SearchBar from '../components/SearchBar' 
import DataTable from '../components/DataTable' 
import { ToastContext } from '../context/ToastContext'


const FacturasList = () => {
  const [facturas, setFacturas] = useState([])
  const { addToast } = useContext(ToastContext)


  // ✅ Función que sí trae los datos (esta es la que usarás en onRefresh)
  const fetchFacturas = async () => {
    try {
      const res = await api.get('/facturas')
      setFacturas(res.data)
    } catch (err) {
      console.error('Error al obtener facturas', err)
      addToast('No se pudieron cargar las facturas', 'error')
    }
  }

  // ✅ Llamada inicial cuando la página carga
  useEffect(() => {
    fetchFacturas()
  }, [])

  // ✅ Eliminar factura
  const eliminarFactura = async (id) => {
    if (!confirm('¿Eliminar factura?')) return
    try {
      await api.delete(`/facturas/${id}`)
      setFacturas(prev => prev.filter(f => f.id_factura !== id))
    } catch (err) {
      console.error('Error eliminar factura', err)
      addToast(err.response?.data?.error || 'Error al eliminar factura', 'error')
    }
  }

  const [search, setSearch] = useState('')
  const facturasFiltradas = facturas.filter(f =>
    f.cliente.toLowerCase().includes(search.toLowerCase()) ||
    f.vendedor.toLowerCase().includes(search.toLowerCase())
  )

  const formatCOP = (value) => {
    if (!value && value !== 0) return '';
    return `$ ${new Intl.NumberFormat('es-CO').format(value)}`;
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Listado de Facturas</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por cliente o vendedor..." />

      <DataTable
        columns={[
          { key: 'id_factura', label: '#', className: 'w-15 text-left align-middle' },
          { key: 'cliente', label: 'Cliente', className: 'w-1/4 text-left align-middle' },
          { key: 'total', label: 'Total', className: 'w-1/4 text-left align-middle', render: (r) => formatCOP(r.total) },
          { key: 'fecha', label: 'Fecha', className: 'w-1/3 text-left align-middle', render: (r) => new Date(r.fecha).toLocaleString() }
        ]}
        data={facturasFiltradas}
        onRefresh={fetchFacturas}  // ✅ Aquí sí va la función correcta
        rowKey="id_factura"
        actions={(f) => (
          <button
            onClick={() => eliminarFactura(f.id_factura)}
            className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition cursor-pointer"
          >
            Eliminar
          </button>
        )}
      />
    </MainLayout>
  )
}

export default FacturasList

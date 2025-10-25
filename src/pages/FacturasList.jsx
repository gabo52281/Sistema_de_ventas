import React, { useEffect, useState, useContext } from 'react' 
import MainLayout from '../layouts/MainLayout' 
import api from '../api/axios' 
import SearchBar from '../components/SearchBar' 
import DataTable from '../components/DataTable' 
import { ToastContext } from '../context/ToastContext'

const FacturasList = () => {
  const [facturas, setFacturas] = useState([])
  const [facturaDetalle, setFacturaDetalle] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const { addToast } = useContext(ToastContext)

  // Función para formatear moneda COP
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Cargar facturas
  const fetchFacturas = async () => {
    try {
      const res = await api.get('/facturas')
      setFacturas(res.data)
    } catch (err) {
      console.error('Error al obtener facturas', err)
      addToast('No se pudieron cargar las facturas', 'error')
    }
  }

  // Cargar detalles de una factura específica
  const verDetalleFactura = async (id_factura) => {
    try {
      const res = await api.get(`/facturas/${id_factura}`)
      setFacturaDetalle(res.data.factura)
      setModalAbierto(true)
    } catch (err) {
      console.error('Error al obtener detalle de factura', err)
      addToast('No se pudo cargar el detalle de la factura', 'error')
    }
  }

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false)
    setFacturaDetalle(null)
  }

  useEffect(() => {
    fetchFacturas()
  }, [])

  // Eliminar factura
  const eliminarFactura = async (id) => {
    if (!confirm('¿Eliminar factura?')) return
    try {
      await api.delete(`/facturas/${id}`)
      setFacturas(prev => prev.filter(f => f.id_factura !== id))
      addToast('Factura eliminada correctamente', 'success')
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
          { key: 'total', label: 'Total', className: 'w-1/5 text-left align-middle', render: (r) => formatCOP(r.total) },
          { key: 'fecha', label: 'Fecha', className: 'w-1/4 text-left align-middle', render: (r) => new Date(r.fecha).toLocaleString() }
        ]}
        data={facturasFiltradas}
        onRefresh={fetchFacturas}
        rowKey="id_factura"
        actions={(f) => (
          <div className="flex gap-2">
            <button
              onClick={() => verDetalleFactura(f.id_factura)}
              className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition cursor-pointer"
            >
              Ver Detalle
            </button>
            <button
              onClick={() => eliminarFactura(f.id_factura)}
              className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        )}
      />

      {/* Modal de Detalle de Factura */}
      {modalAbierto && facturaDetalle && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[100vh] overflow-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Detalle de Factura</h2>
                  <p className="text-blue-100 text-sm mt-1">#{facturaDetalle.id_factura}</p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Cliente</p>
                  <p className="font-semibold text-gray-900">{facturaDetalle.cliente}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Vendedor</p>
                  <p className="font-semibold text-gray-900">{facturaDetalle.vendedor || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Fecha</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(facturaDetalle.fecha).toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm text-green-800 mb-1">Total</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(facturaDetalle.total)}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Productos</h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Producto</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-700">Cantidad</th>
                        <th className="text-right p-3 text-sm font-semibold text-gray-700">Precio Unit.</th>
                        <th className="text-right p-3 text-sm font-semibold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {facturaDetalle.productos.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="p-3 text-sm text-gray-900">{prod.nombre}</td>
                          <td className="p-3 text-sm text-center text-gray-700">{prod.cantidad}</td>
                          <td className="p-3 text-sm text-right text-gray-700">
                            {formatCurrency(prod.precio_unitario)}
                          </td>
                          <td className="p-3 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(prod.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="p-3 text-right font-semibold text-gray-900">
                          Total:
                        </td>
                        <td className="p-3 text-right font-bold text-lg text-green-700">
                          {formatCurrency(facturaDetalle.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={cerrarModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default FacturasList
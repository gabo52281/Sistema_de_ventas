import React, { useEffect, useState, useContext } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import SearchBar from '../components/SearchBar'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', stock: 0 })
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const { user } = useContext(AuthContext)

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos')
      setProductos(res.data)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => { fetchProductos() }, [])

  const crear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/productos/crear', {
        nombre: nuevo.nombre,
        precio: Number(nuevo.precio),
        stock: Number(nuevo.stock)
      })
      setNuevo({ nombre: '', precio: '', stock: 0 })
      fetchProductos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('Eliminar producto?')) return
    await api.delete(`/productos/${id}`)
    fetchProductos()
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}


        {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
          <form onSubmit={crear} className="mb-4 flex gap-2">
            <input className="border p-2 rounded" placeholder="Nombre"
              value={nuevo.nombre}
              onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Precio"
              value={nuevo.precio}
              onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Stock"
              value={nuevo.stock}
              onChange={e => setNuevo({ ...nuevo, stock: e.target.value })} />
            <button className="bg-green-600 text-white px-4 rounded">Crear</button>
          </form>
        )}

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />

        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full text-sm align-middle">
           <thead className="bg-gray-100 text-left">

            
  <tr>
    <th className="p-2 align-middle">#</th>
    <th className="p-2 align-middle">Nombre</th>
    <th className="p-2 align-middle">Precio</th>
    <th className="p-2 align-middle">Stock</th>
    <th className="p-2 align-middle">Acciones</th>
  </tr>
</thead>
<tbody>
  {productosFiltrados.map(p => (
    <tr key={p.id_producto} className="border-t hover:bg-gray-50">
      <td className="p-2 align-middle">{p.id_producto}</td>
      <td className="p-2 align-middle">{p.nombre}</td>
      <td className="p-2 align-middle">{p.precio}</td>
      <td className="p-2 align-middle">{p.stock}</td>
      <td className="p-2 align-middle space-x-2">
        <button
          onClick={() => eliminar(p.id_producto)}
        className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition"
        >
          Eliminar
        </button>
        <button
          onClick={() => {
            const cantidad = prompt("¿Cuántas unidades deseas añadir?");
            if (cantidad && !isNaN(cantidad)) {
              api.put(`/productos/${p.id_producto}/add-stock`, { cantidad: Number(cantidad) })
                .then(() => fetchProductos())
                .catch(err => alert(err.response?.data?.error || "Error al añadir stock"));
            }
          }}
        className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-green-200 transition"
        >
          + Añadir stock
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
export default Productos

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

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />

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

        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr><th className="p-2">#</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id_producto} className="border-t">
                  <td className="p-2">{p.id_producto}</td>
                  <td className="p-2">{p.nombre}</td>
                  <td className="p-2">{p.precio}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                      <button onClick={() => eliminar(p.id_producto)} className="text-red-600">Eliminar</button>
                    )}
                    <button
                      onClick={() => {
                        const cantidad = prompt("¿Cuántas unidades deseas añadir?");
                        if (cantidad && !isNaN(cantidad)) {
                          api.put(`/productos/${p.id_producto}/anadir-stock`, { cantidad: Number(cantidad) })
                            .then(() => fetchProductos())
                            .catch(err => alert(err.response?.data?.error || "Error al añadir stock"));
                        }
                      }}
                      className="text-green-600 mr-2"
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

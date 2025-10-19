import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', password: '', rol: 'cajero' })
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  const fetchEmpleados = async () => {
    try {
      const res = await api.get('/users')
      setEmpleados(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchEmpleados() }, [])

  const crear = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users/crear', nuevo)
      setNuevo({ nombre: '', email: '', password: '', rol: 'cajero' })
      fetchEmpleados()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear empleado')
    }
  }

  const empleadosFiltrados = empleados.filter(e =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Empleados</h1>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <form onSubmit={crear} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Nombre del empleado"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email del empleado"
            value={nuevo.email}
            onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
          />
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Contraseña"
            value={nuevo.password}
            onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={nuevo.rol}
            onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
          >
            <option value="cajero">Cajero</option>
            <option value="vendedor">Vendedor</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded col-span-full">
            Crear empleado
          </button>
        </form>

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar empleado o email..." />

        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full w-full table-fixed text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-12 text-left align-middle">#</th>
                <th className="p-2 w-1/3 text-left align-middle">Nombre</th>
                <th className="p-2 w-1/3 text-left align-middle">Email</th>
                <th className="p-2 w-24 text-left align-middle">Rol</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map((e) => (
                <tr key={e.id_usuario} className="border-t hover:bg-gray-50">
                  <td className="p-2 align-middle">{e.id_usuario}</td>
                  <td className="p-2 align-middle">{e.nombre}</td>
                  <td className="p-2 align-middle">{e.email}</td>
                  <td className="p-2 align-middle capitalize">{e.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}

export default Empleados

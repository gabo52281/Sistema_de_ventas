import React, { useEffect, useState, useContext } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import { ToastContext } from '../context/ToastContext'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const { addToast } = useContext(ToastContext)
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
      addToast(err.response?.data?.error || 'Error al crear empleado', 'error')
    }
  }

  const editarEmpleado = async (empleado) => {
    // Pedimos datos simples vía prompt para no añadir UI extra
    const nombre = prompt('Nombre', empleado.nombre)
    if (nombre === null) return // cancel
    const email = prompt('Email', empleado.email)
    if (email === null) return
    const rol = prompt('Rol (cajero|vendedor)', empleado.rol)
    if (rol === null) return
    const password = prompt('Nueva contraseña (dejar vacío para no cambiar)')

    try {
      const payload = { nombre, email, rol }
      if (password && password.trim() !== '') payload.password = password
      await api.put(`/users/${empleado.id_usuario}`, payload)
      addToast('Empleado actualizado', 'success')
      fetchEmpleados()
    } catch (err) {
      console.error('Error actualizar empleado', err)
      addToast(err.response?.data?.error || 'Error al actualizar empleado', 'error')
    }
  }

  const eliminarEmpleado = async (id_usuario) => {
    if (!confirm('¿Eliminar empleado?')) return
    try {
      await api.delete(`/users/${id_usuario}`)
      addToast('Empleado eliminado', 'success')
      fetchEmpleados()
    } catch (err) {
      console.error('Error eliminar empleado', err)
      addToast(err.response?.data?.error || 'Error al eliminar empleado', 'error')
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

        <DataTable
          columns={[
            { key: 'id_usuario', label: '#', className: 'w-12 text-left align-middle' },
            { key: 'nombre', label: 'Nombre', className: 'w-1/3 text-left align-middle' },
            { key: 'email', label: 'Email', className: 'w-1/3 text-left align-middle' },
            { key: 'rol', label: 'Rol', className: 'w-24 text-left align-middle' }
          ]}
          data={empleadosFiltrados}
          rowKey="id_usuario"
          actions={(u) => (
            <>
              <button onClick={() => editarEmpleado(u)} className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-yellow-200 transition">Editar</button>
              <button onClick={() => eliminarEmpleado(u.id_usuario)} className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition">Eliminar</button>
            </>
          )}
        />
      </div>
    </MainLayout>
  )
}

export default Empleados

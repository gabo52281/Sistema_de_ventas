import React, { useEffect, useState, useContext } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import { ToastContext } from '../context/ToastContext'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const { addToast } = useContext(ToastContext)
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', password: '', rol: 'cajero', telefono: '', direccion: '' })
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  
  // Estado para modal de edición
  const [modalEditar, setModalEditar] = useState(false)
  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_usuario: '',
    nombre: '',
    email: '',
    rol: '',
    password: '',
    telefono: '',
    direccion: ''
  })

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
    const payload = {
      nombre: nuevo.nombre,
      email: nuevo.email,
      password: nuevo.password,
      rol: nuevo.rol,
      telefono: nuevo.telefono.trim() || null,  // ✅ Envía null si está vacío
      direccion: nuevo.direccion.trim() || null // ✅ Envía null si está vacío
    }
    
    await api.post('/users/crear', payload)
    setNuevo({ nombre: '', email: '', password: '', rol: 'cajero', telefono: '', direccion: '' })
    addToast('Empleado creado exitosamente', 'success')
    fetchEmpleados()
  } catch (err) {
    setError(err.response?.data?.error || 'Error al crear empleado')
    addToast(err.response?.data?.error || 'Error al crear empleado', 'error')
  }
}

  // Abrir modal de edición
  const abrirModalEditar = (empleado) => {
    setEmpleadoEditar({
      id_usuario: empleado.id_usuario,
      nombre: empleado.nombre,
      email: empleado.email,
      rol: empleado.rol,
      password: '',
      telefono: empleado.telefono,
      direccion: empleado.direccion
    })
    setModalEditar(true)
  }

  // Cerrar modal de edición
  const cerrarModalEditar = () => {
    setModalEditar(false)
    setEmpleadoEditar({
      id_usuario: '',
      nombre: '',
      email: '',
      rol: '',
      password: '',
     telefono: nuevo.telefono.trim() || null,  // ✅ Envía null si está vacío
      direccion: nuevo.direccion.trim() || null // ✅ Envía null si está vacío
    })
  }

  // Guardar cambios del empleado
  const guardarEdicion = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        nombre: empleadoEditar.nombre,
        email: empleadoEditar.email,
        rol: empleadoEditar.rol,
        telefono: empleadoEditar.telefono,
        direccion: empleadoEditar.direccion

      }
      // Solo incluir password si se escribió algo
      if (empleadoEditar.password && empleadoEditar.password.trim() !== '') {
        payload.password = empleadoEditar.password
      }

      await api.put(`/users/${empleadoEditar.id_usuario}`, payload)
      addToast('Empleado actualizado correctamente', 'success')
      cerrarModalEditar()
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
      addToast('Empleado eliminado correctamente', 'success')
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
      <div className="max-w-6xl mx-auto p-2">
        <h1 className="text-2xl font-bold mb-4">Gestión de Empleados</h1>

        {/* Formulario de creación */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Empleado</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={crear} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan Pérez"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                required
              />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Teléfono
  </label>
  <input
    type="tel"
    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Ej: 3112345678"
    value={nuevo.telefono}
    onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Dirección
  </label>
  <input
    type="text"
    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Ej: Calle 123 #45-67"
    value={nuevo.direccion || ''}
    onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })}
  />
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ejemplo@correo.com"
                value={nuevo.email}
                onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                value={nuevo.password}
                onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={nuevo.rol}
                onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}
              >
                <option value="cajero">Cajero</option>
              </select>
            </div>

            <button 
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Crear Empleado
            </button>
          </form>
        </div>

        {/* Buscador y tabla */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Lista de Empleados</h2>
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Buscar por nombre o email..." 
          />

          <DataTable
            columns={[
              { key: 'id_usuario', label: '#', className: 'w-12 text-left align-middle' },
              { key: 'nombre', label: 'Nombre', className: 'w-1/3 text-left align-middle' },
              { key: 'email', label: 'Email', className: 'w-1/3 text-left align-middle' },
              { 
                key: 'rol', 
                label: 'Rol', 
                className: 'w-24 text-left align-middle',
                render: (e) => (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    e.rol === 'cajero' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {e.rol.charAt(0).toUpperCase() + e.rol.slice(1)}
                  </span>
                )
              }
            ]}
            data={empleadosFiltrados}
            onRefresh={fetchEmpleados}
            rowKey="id_usuario"
            actions={(u) => (
              <div className="flex gap-2">
                <button 
                  onClick={() => abrirModalEditar(u)} 
                  className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-yellow-200 transition cursor-pointer"
                >
                  Editar
                </button>
                <button 
                  onClick={() => eliminarEmpleado(u.id_usuario)} 
                  className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            )}
          />
        </div>

        {/* Modal de Edición */}
        {modalEditar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Editar Empleado</h2>
                    <p className="text-yellow-100 text-sm mt-1">
                      ID: {empleadoEditar.id_usuario}
                    </p>
                  </div>
                  <button
                    onClick={cerrarModalEditar}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={guardarEdicion} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Nombre del empleado"
                    value={empleadoEditar.nombre}
                    onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, nombre: e.target.value })}
                    required
                  />
                </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Teléfono
  </label>
  <input
    type="tel"
    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
    placeholder="Ej: 3112345678"
    value={empleadoEditar.telefono}
    onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, telefono: e.target.value })}
    required
  />
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="ejemplo@correo.com"
                    value={empleadoEditar.email}
                    onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, email: e.target.value })}
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    value={empleadoEditar.rol}
                    onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, rol: e.target.value })}
                  >
                    <option value="cajero">Cajero</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Dejar vacío para no cambiar"
                    value={empleadoEditar.password}
                    onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, password: e.target.value })}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo completa este campo si deseas cambiar la contraseña
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModalEditar}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Empleados
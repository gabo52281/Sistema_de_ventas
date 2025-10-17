import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'

const AdminPanel = () => {
  const [admins, setAdmins] = useState([])
  const [nuevo, setNuevo] = useState({
    nombre_negocio: '',
    email_contacto: '',
    nombre_admin: '',
    email_admin: '',
    password_admin: ''
  })
  const [search, setSearch] = useState('')

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admins')
      setAdmins(res.data)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => { fetchAdmins() }, [])

  const crear = async (e) => {
    e.preventDefault()
    await api.post('/admins/crear', nuevo)
    setNuevo({
      nombre_negocio: '',
      email_contacto: '',
      nombre_admin: '',
      email_admin: '',
      password_admin: ''
    })
    fetchAdmins()
  }

  const adminsFiltrados = admins.filter(a =>
    a.nombre_negocio.toLowerCase().includes(search.toLowerCase()) ||
    a.admin_nombre?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Panel del Superadmin</h1>

        <form onSubmit={crear} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Nombre del negocio"
            value={nuevo.nombre_negocio}
            onChange={e => setNuevo({ ...nuevo, nombre_negocio: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Email de contacto del negocio"
            value={nuevo.email_contacto}
            onChange={e => setNuevo({ ...nuevo, email_contacto: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Nombre del administrador"
            value={nuevo.nombre_admin}
            onChange={e => setNuevo({ ...nuevo, nombre_admin: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Email del administrador"
            value={nuevo.email_admin}
            onChange={e => setNuevo({ ...nuevo, email_admin: e.target.value })} />
          <input className="border p-2 rounded" type="password" placeholder="Contraseña del administrador"
            value={nuevo.password_admin}
            onChange={e => setNuevo({ ...nuevo, password_admin: e.target.value })} />
          <button className="bg-green-600 text-white px-4 py-2 rounded col-span-full">Crear negocio y admin</button>
        </form>

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar negocio o admin..." />

        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">#</th>
                <th>Negocio</th>
                <th>Email contacto</th>
                <th>Administrador</th>
                <th>Email administrador</th>
              </tr>
            </thead>
            <tbody>
              {adminsFiltrados.map(a => (
                <tr key={a.id_admin} className="border-t">
                  <td className="p-2">{a.id_admin}</td>
                  <td className="p-2">{a.nombre_negocio}</td>
                  <td className="p-2">{a.email_contacto}</td>
                  <td className="p-2">{a.admin_nombre || 'Sin asignar'}</td>
                  <td className="p-2">{a.admin_email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}
export default AdminPanel

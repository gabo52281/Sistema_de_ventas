import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'

const AdminPanel = () => {
  const [admins, setAdmins] = useState([])
  const [nuevo, setNuevo] = useState({
    nombre_negocio: '',
    email_contacto: '',
    nombre_admin: '',
    email_admin: '',
    password_admin: '',
    direccion_admin: '',
    telefono_admin: ''
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
      password_admin: '',
      direccion_admin: '',
      telefono_admin: ''
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
          <input className="border p-2 rounded" placeholder="Dirección del administrador"
            value={nuevo.direccion_admin}
            onChange={e => setNuevo({ ...nuevo, direccion_admin: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Teléfono del administrador"
            value={nuevo.telefono_admin}
            onChange={e => setNuevo({ ...nuevo, telefono_admin: e.target.value })} />
          <button className="bg-green-600 text-white px-4 py-2 rounded col-span-full cursor-pointer">Crear negocio y admin</button>
        </form>

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar negocio o admin..." />

        <DataTable
          columns={[
            { key: 'id_admin', label: '#', className: 'w-12 text-left align-middle' },
            { key: 'nombre_negocio', label: 'Negocio', className: 'w-1/3 text-left align-middle' },
            { key: 'email_contacto', label: 'Email contacto', className: 'w-1/4 text-left align-middle' },
            { key: 'admin_nombre', label: 'Administrador', className: 'w-1/4 text-left align-middle' },
            { key: 'admin_email', label: 'Email administrador', className: 'w-48 text-left align-middle' }
          ]}
          data={adminsFiltrados}
          onRefresh={fetchAdmins}
          rowKey="id_admin"
        />
      </div>
    </MainLayout>
  )
}
export default AdminPanel

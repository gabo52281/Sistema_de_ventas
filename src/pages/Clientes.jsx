import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [nuevo, setNuevo] = useState({ nombre:'', telefono:'', direccion:'', cedula: ''})
  const [search, setSearch] = useState('')

  // Estados para edición
  const [editando, setEditando] = useState(null)
  const [formEditar, setFormEditar] = useState({ nombre:'', telefono:'', direccion:'', cedula:'' })

  const fetchClientes = async () => { 
    try { 
      const res = await api.get('/clientes'); 
      setClientes(res.data) 
    } catch (e) { console.error(e) } 
  }

  useEffect(()=>{ fetchClientes() }, [])

  const crear = async (e) => { 
    e.preventDefault(); 
    try {
      await api.post('/clientes/crear', nuevo)
      setNuevo({ nombre:'', telefono:'', direccion:'', cedula:'' })
      fetchClientes()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear cliente')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('Eliminar cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      fetchClientes()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar cliente')
    }
  }

  const abrirEditar = (c) => {
    setEditando(c.id_cliente)
    setFormEditar({
      nombre: c.nombre,
      telefono: c.telefono || '',
      direccion: c.direccion || '',
      cedula: c.cedula || ''
    })
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/clientes/${editando}`, formEditar)
      setEditando(null)
      fetchClientes()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al editar cliente')
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Registra tus clientes</h1>
        <form onSubmit={crear} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Nombre" value={nuevo.nombre} onChange={e=>setNuevo({...nuevo,nombre:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Teléfono" value={nuevo.telefono} onChange={e=>setNuevo({...nuevo,telefono:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Dirección" value={nuevo.direccion} onChange={e=>setNuevo({...nuevo,direccion:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Cédula" value={nuevo.cedula} onChange={e=>setNuevo({...nuevo,cedula:e.target.value})} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded col-span-full cursor-pointer">Crear cliente</button>
        </form>

        <h1 className="text-2xl font-bold mb-4">Mis clientes</h1>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar cliente..." />
        <DataTable
          columns={[
            { key: 'id_cliente', label: '#', className: 'w-1/20 text-left' },
            { key: 'nombre', label: 'Nombre', className: 'w-1/6 text-left align-middle ' },
            { key: 'cedula', label: 'Cédula', className: 'w-1/6 text-left align-middle'},
            { key: 'telefono', label: 'Teléfono',className: 'w-1/6 text-left align-middle' },
            { key: 'direccion', label: 'Dirección',className: 'w-1/6 text-left align-middle' }
          ]}
          data={clientesFiltrados}
          rowKey="id_cliente"
          actions={(c) => (
            <div className="flex gap-2">
              <button
                onClick={() => abrirEditar(c)}
                className="bg-yellow-100 text-yellow-700 px-3 py-1 text-sm rounded-full hover:bg-yellow-200 cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => eliminar(c.id_cliente)}
                className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full hover:bg-red-200 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          )}
        />

        {editando && (
          <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Editar Cliente</h2>
              <form onSubmit={guardarEdicion} className="space-y-3">
                <input className="border p-2 rounded w-full" value={formEditar.nombre} onChange={e=>setFormEditar({...formEditar,nombre:e.target.value})} placeholder="Nombre" />
                <input className="border p-2 rounded w-full" value={formEditar.telefono} onChange={e=>setFormEditar({...formEditar,telefono:e.target.value})} placeholder="Teléfono" />
                <input className="border p-2 rounded w-full" value={formEditar.direccion} onChange={e=>setFormEditar({...formEditar,direccion:e.target.value})} placeholder="Dirección" />
                <input className="border p-2 rounded w-full" value={formEditar.cedula} onChange={e=>setFormEditar({...formEditar,cedula:e.target.value})} placeholder="Cédula" />

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={()=>setEditando(null)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Clientes

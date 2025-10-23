import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'


const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [nuevo, setNuevo] = useState({ nombre:'', telefono:'', direccion:'' , cedula: ''})

  const fetchClientes = async () => { try { const res = await api.get('/clientes'); setClientes(res.data) } catch (e) { console.error(e) } }
  useEffect(()=>{ fetchClientes() }, [])

  const crear = async (e) => { 
    e.preventDefault(); 
    try {
      await api.post('/clientes/crear', nuevo)
      setNuevo({ nombre:'', telefono:'', direccion:'',cedula: ''})
      fetchClientes()
    } catch (err) {
      console.error('Error crear cliente', err)
      alert(err.response?.data?.error || 'Error al crear cliente')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('Eliminar cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      fetchClientes()
    } catch (err) {
      console.error('Error eliminar cliente', err)
      alert(err.response?.data?.error || 'Error al eliminar cliente')
    }
  }
  
  const [search, setSearch] = useState('')
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
            { key: 'id_cliente', label: '#', className: 'w-12 text-left align-middle' },
            { key: 'nombre', label: 'Nombre', className: 'w-1/3 text-left align-middle' },
            { key: 'cedula', label: 'Cédula', className: 'w-1/4 text-left align-middle' },
            { key: 'telefono', label: 'Teléfono', className: 'w-1/4 text-left align-middle' },
            { key: 'direccion', label: 'Dirección', className: 'w-1/3 text-left align-middle' }
          ]}
          data={clientesFiltrados}
          rowKey="id_cliente"
          actions={(c) => (
            <>
              <button onClick={() => eliminar(c.id_cliente)} className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-red-200 transition cursor-pointer">Eliminar</button>
            </>
          )}
        />
      </div>
    </MainLayout>
  )
}
export default Clientes
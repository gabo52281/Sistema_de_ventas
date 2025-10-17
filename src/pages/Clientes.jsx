import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import api from '../api/axios'
import SearchBar from '../components/SearchBar'


const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [nuevo, setNuevo] = useState({ nombre:'', telefono:'', direccion:'' })

  const fetchClientes = async () => { try { const res = await api.get('/clientes'); setClientes(res.data) } catch (e) { console.error(e) } }
  useEffect(()=>{ fetchClientes() }, [])

  const crear = async (e) => { e.preventDefault(); await api.post('/clientes/crear', nuevo); setNuevo({ nombre:'', telefono:'', direccion:''}); fetchClientes() }
  
  const [search, setSearch] = useState('')
  const clientesFiltrados = clientes.filter(c =>
  c.nombre.toLowerCase().includes(search.toLowerCase()) ||
  c.telefono?.toLowerCase().includes(search.toLowerCase())
)

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Clientes</h1>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar cliente..." />
        <form onSubmit={crear} className="mb-4">
          <input className="border p-2 rounded w-full mb-2" placeholder="Nombre" value={nuevo.nombre} onChange={e=>setNuevo({...nuevo,nombre:e.target.value})} />
          <input className="border p-2 rounded w-full mb-2" placeholder="Teléfono" value={nuevo.telefono} onChange={e=>setNuevo({...nuevo,telefono:e.target.value})} />
          <input className="border p-2 rounded w-full mb-2" placeholder="Dirección" value={nuevo.direccion} onChange={e=>setNuevo({...nuevo,direccion:e.target.value})} />
          <button className="bg-blue-600 text-white p-2 rounded">Crear cliente</button>
        </form>

        <ul>
          {clientesFiltrados.map(c=> (
            <li key={c.id_cliente} className="bg-white p-3 mb-2 rounded shadow">
              <div className="font-semibold">{c.nombre}</div>
              <div className="text-sm text-gray-600">{c.telefono} • {c.direccion}</div>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  )
}
export default Clientes
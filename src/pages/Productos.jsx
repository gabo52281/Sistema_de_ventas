import React, { useEffect, useState, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', precio_compra: '', stock: 0 });
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (e) {
      console.error("Error al obtener productos", e);
    }
  };

  // 🔹 Función para limpiar valores monetarios
  const limpiarNumero = (valor) => {
    return Number(String(valor).replace(/[^0-9]/g, '')) || 0;
  };

  // 👉 Función para formatear número como moneda local COP (ej: 50.000)
  const formatCOP = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const crear = async (e) => {
    e.preventDefault();
    try {
      await api.post('/productos/crear', {
        nombre: nuevo.nombre,
        precio: limpiarNumero(nuevo.precio),
        precio_compra: limpiarNumero(nuevo.precio_compra),
        stock: limpiarNumero(nuevo.stock)
      });

      setNuevo({ nombre: '', precio: '', precio_compra: '', stock: 0 });
      fetchProductos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear producto');
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    await api.delete(`/productos/${id}`);
    fetchProductos();
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Añade tus productos</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
          <form onSubmit={crear} className="mb-4 flex gap-2 flex-wrap">

            {/* Nombre */}
            <input
              className="border p-2 rounded"
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
            />

            {/* ✅ Precio con formato al escribir */}
            <input
              className="border p-2 rounded"
              placeholder="Precio"
              value={nuevo.precio ? formatCOP(nuevo.precio) : ''}
              onChange={(e) => {
                const raw = limpiarNumero(e.target.value);
                setNuevo({ ...nuevo, precio: raw });
              }}
            />

            {/* ✅ Precio de compra también con formato */}
            <input
              className="border p-2 rounded"
              placeholder="Precio compra"
              value={nuevo.precio_compra ? formatCOP(nuevo.precio_compra) : ''}
              onChange={(e) => {
                const raw = limpiarNumero(e.target.value);
                setNuevo({ ...nuevo, precio_compra: raw });
              }}
            />

            <input
              className="border p-2 rounded"
              placeholder="Stock"
              value={nuevo.stock}
              onChange={e => setNuevo({ ...nuevo, stock: limpiarNumero(e.target.value) })}
            />

            <button className="bg-green-600 text-white px-4 rounded hover:bg-green-700 cursor-pointer">
              Crear
            </button>
          </form>
        )}

        <h1 className="text-2xl font-bold mb-4">Productos</h1>

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />

        <DataTable
          columns={[
            { key: 'id_producto', label: '#', className: 'w-12 text-left' },
            { key: 'nombre', label: 'Nombre', className: 'w-1/3 text-left' },
            { key: 'precio', label: 'Precio', className: 'w-24 text-left', render: (r) => r.precio },
            { key: 'stock', label: 'Stock', className: 'w-24 text-left' }
          ]}
          data={productosFiltrados}
          rowKey="id_producto"
          actions={(p) => (
            <>
              <button
                onClick={() => eliminar(p.id_producto)}
                className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full hover:bg-red-200 cursor-pointer"
              >
                Eliminar
              </button>

              <button
                onClick={() => {
                  const cantidad = prompt("¿Cuántas unidades deseas añadir?");
                  if (cantidad && !isNaN(cantidad)) {
                    api.put(`/productos/${p.id_producto}/anadir-stock`, { cantidad: Number(cantidad) })
                      .then(() => fetchProductos())
                      .catch(err => alert(err.response?.data?.error || "Error al añadir stock"));
                  }
                }}
                className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full hover:bg-green-200 cursor-pointer"
              >
                + Añadir stock
              </button>
            </>
          )}
        />
      </div>
    </MainLayout>
  );
};

export default Productos;

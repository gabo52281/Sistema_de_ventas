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
  if (!value && value !== 0) return '';
  return `$ ${new Intl.NumberFormat('es-CO').format(value)}`;
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

  const [editando, setEditando] = useState(false);
const [productoEditado, setProductoEditado] = useState({ id: null, nombre: '', precio: '', stock: '' });

const comenzarEdicion = (producto) => {
  setProductoEditado({
    id: producto.id_producto,
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock
  });
  setEditando(true);
};

const guardarEdicion = async () => {
  try {
    await api.put(`/productos/${productoEditado.id}`, {
      nombre: productoEditado.nombre,
      precio: productoEditado.precio,
      stock: productoEditado.stock
    });

    fetchProductos();
    setEditando(false);
  } catch (err) {
    console.error(err);
    alert("Error al actualizar producto");
  }
};

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Añade tus productos</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

       {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
  <form onSubmit={crear} className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">

    {/* Nombre */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">Nombre</label>
      <input
        className="border p-2 rounded"
        placeholder="Ej: Camiseta azul"
        value={nuevo.nombre}
        onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
      />
    </div>

    {/* Precio de venta */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">Precio de venta</label>
      <input
        className="border p-2 rounded"
        placeholder="Ej: 50.000"
        value={nuevo.precio ? formatCOP(nuevo.precio) : ''}
        onChange={(e) => {
          const raw = limpiarNumero(e.target.value);
          setNuevo({ ...nuevo, precio: raw });
        }}
      />
    </div>

    {/* Precio de compra */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">Precio de costo</label>
      <input
        className="border p-2 rounded"
        placeholder="Ej: 35.000"
        value={nuevo.precio_compra ? formatCOP(nuevo.precio_compra) : ''}
        onChange={(e) => {
          const raw = limpiarNumero(e.target.value);
          setNuevo({ ...nuevo, precio_compra: raw });
        }}
      />
    </div>

    {/* Stock */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">Stock</label>
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Ej: 10"
        value={nuevo.stock}
        onChange={e => setNuevo({ ...nuevo, stock: limpiarNumero(e.target.value) })}
      />
    </div>

    {/* Botón */}
    <div className="flex items-end">
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer w-full">
        Crear
      </button>
    </div>

  </form>
)}


        <h1 className="text-2xl font-bold mb-4">Productos</h1>

        <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />

        <DataTable
          columns={[
            { key: 'id_producto', label: '#', className: 'w-1/20 text-left' },
            { key: 'nombre', label: 'Nombre', className: 'w-1/5 text-left ' },
            { key: 'precio', label: 'Precio', className: 'w-1/5 text-left', render: (r) => formatCOP(r.precio) },
            { key: 'stock', label: 'Stock', className: 'w-1/5 text-left' }
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
                  onClick={() => comenzarEdicion(p)}
                  className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full hover:bg-yellow-200 cursor-pointer"
                >
                  Editar
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

      {editando && (
        
  <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50">
    
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Editar Producto</h2>

      <div className="flex flex-col gap-3">
        <label>Nombre</label>
        <input
          className="border p-2 rounded"
          value={productoEditado.nombre}
          onChange={e => setProductoEditado({ ...productoEditado, nombre: e.target.value })}
        />

        <label>Precio (Ej: 50.000)</label>
        <input
          className="border p-2 rounded"
          value={formatCOP(productoEditado.precio)}
          onChange={e => setProductoEditado({ ...productoEditado, precio: limpiarNumero(e.target.value) })}
        />

        <label>Stock</label>
        <input
          type="number"
          className="border p-2 rounded"
          value={productoEditado.stock}
          onChange={e => setProductoEditado({ ...productoEditado, stock: limpiarNumero(e.target.value) })}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setEditando(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>

        <button
          onClick={guardarEdicion}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
    
  </div>
  
)}

    </MainLayout>
  );
};

export default Productos;

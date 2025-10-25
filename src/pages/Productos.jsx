import React, { useEffect, useState, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', precio_compra: '', stock: '' });
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
  const [productoEditado, setProductoEditado] = useState({ 
    id: null, 
    nombre: '', 
    precio: '', 
    precio_compra: '', 
    stock: '' 
  });

  const comenzarEdicion = (producto) => {
    setProductoEditado({
      id: producto.id_producto,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      precio_compra: Number(producto.precio_compra),
      stock: Number(producto.stock)
    });
    setEditando(true);
  };

  const guardarEdicion = async () => {
    try {
      await api.put(`/productos/${productoEditado.id}`, {
        nombre: productoEditado.nombre,
        precio: Number(productoEditado.precio),
        precio_compra: Number(productoEditado.precio_compra),
        stock: Number(productoEditado.stock)
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
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Añade tus productos</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
          <form onSubmit={crear} className="mb-6 bg-white p-6 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Nombre */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Camiseta azul"
                  value={nuevo.nombre}
                  onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
                  required
                />
              </div>

              {/* Precio de venta */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Precio de venta</label>
                <input
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 50.000"
                  value={nuevo.precio ? formatCOP(nuevo.precio) : ''}
                  onChange={(e) => {
                    const raw = limpiarNumero(e.target.value);
                    setNuevo({ ...nuevo, precio: raw });
                  }}
                  required
                />
              </div>

              {/* Precio de compra */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Precio de costo</label>
                <input
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 35.000"
                  value={nuevo.precio_compra ? formatCOP(nuevo.precio_compra) : ''}
                  onChange={(e) => {
                    const raw = limpiarNumero(e.target.value);
                    setNuevo({ ...nuevo, precio_compra: raw });
                  }}
                  required
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 10"
                  value={nuevo.stock}
                  onChange={e => setNuevo({ ...nuevo, stock: limpiarNumero(e.target.value) })}
                  required
                />
              </div>

              {/* Botón */}
              <div className="flex items-end">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer w-full font-semibold transition-colors">
                  Crear
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>

          <SearchBar value={search} onChange={setSearch} placeholder="Buscar producto..." />

          <DataTable
            columns={[
              { key: 'id_producto', label: '#', className: 'w-12 text-left align-middle' },
              { key: 'nombre', label: 'Nombre', className: 'w-1/4 text-left align-middle' },
              { 
                key: 'precio', 
                label: 'Precio de venta', 
                className: 'w-1/6 text-left align-middle', 
                render: (r) => formatCOP(r.precio) 
              },
              { 
                key: 'precio_compra', 
                label: 'Precio de costo', 
                className: 'w-1/6 text-left align-middle', 
                render: (r) => formatCOP(r.precio_compra) 
              },
              { 
                key: 'ganancia', 
                label: 'Ganancia/unidad', 
                className: 'w-1/6 text-left align-middle', 
                render: (r) => (
                  <span className={`font-semibold ${(r.precio - r.precio_compra) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCOP(r.precio - r.precio_compra)}
                  </span>
                )
              },
              { key: 'stock', label: 'Stock', className: 'w-20 text-left align-middle' }
            ]}
            data={productosFiltrados}
            rowKey="id_producto"
            actions={(p) => (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => comenzarEdicion(p)}
                  className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full hover:bg-yellow-200 cursor-pointer transition"
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
                  className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full hover:bg-green-200 cursor-pointer transition"
                >
                  + Stock
                </button>
                <button
                  onClick={() => eliminar(p.id_producto)}
                  className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full hover:bg-red-200 cursor-pointer transition"
                >
                  Eliminar
                </button>
              </div>
            )}
            onRefresh={fetchProductos}
          />
        </div>
      </div>

      {/* Modal de Edición */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Editar Producto</h2>
                  <p className="text-yellow-100 text-sm mt-1">ID: {productoEditado.id}</p>
                </div>
                <button
                  onClick={() => setEditando(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={productoEditado.nombre}
                  onChange={e => setProductoEditado({ ...productoEditado, nombre: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio de venta</label>
                 <input
  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
  value={formatCOP(productoEditado.precio)} // << Mostrar formateado
  onChange={(e) => {
    const raw = limpiarNumero(e.target.value); // Quitar puntos y símbolos
    setProductoEditado({ ...productoEditado, precio: raw }); // Guardar limpio
  }}
/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio de costo</label>
                  <input
  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
  value={formatCOP(productoEditado.precio_compra)}
  onChange={(e) => {
    const raw = limpiarNumero(e.target.value);
    setProductoEditado({ ...productoEditado, precio_compra: raw });
  }}
/>

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock disponible</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={productoEditado.stock}
                  onChange={e => setProductoEditado({ ...productoEditado, stock: e.target.value })}
                />
              </div>

              {/* Preview de ganancia */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Ganancia por unidad:</p>
                <p className={`text-2xl font-bold ${(Number(productoEditado.precio) - Number(productoEditado.precio_compra)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCOP(Number(productoEditado.precio) - Number(productoEditado.precio_compra))}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={() => setEditando(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Productos;
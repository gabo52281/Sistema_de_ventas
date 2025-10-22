import React, { useState, useContext } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import { ToastContext } from '../context/ToastContext';

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
}).format(value || 0);

const Reportes = () => {
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [reporte, setReporte] = useState(null);
  const { addToast } = useContext(ToastContext);

  const generarReporte = async (e) => {
    e.preventDefault();
    if (!inicio || !fin) return addToast('Selecciona ambas fechas', 'error');

    try {
      const res = await api.get(`/facturas/reporte?inicio=${inicio}&fin=${fin}`);
      setReporte(res.data);
    } catch (err) {
      console.error(err);
      addToast('Error generando reporte', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 Reporte de Ventas</h1>

        <form onSubmit={generarReporte} className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="text-sm font-medium">Fecha inicio</label>
            <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)}
              className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Fecha fin</label>
            <input type="date" value={fin} onChange={(e) => setFin(e.target.value)}
              className="border p-2 rounded w-full" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded mt-6 md:mt-0">
            Generar Reporte
          </button>
        </form>

        {/* Si ya hay reporte */}
        {reporte && (
          <div>
            <div className="bg-white p-4 rounded shadow mb-6">
              <p><strong>Fecha:</strong> {reporte.inicio} — {reporte.fin}</p>
              <p><strong>Total invertido:</strong> {formatCurrency(reporte.total_ventas)}</p>
              <p><strong>Ganancia total:</strong> {formatCurrency(reporte.total_ganancia)}</p>
              <p><strong>Facturas generadas:</strong> {reporte.cantidad_facturas}</p>
            </div>

            <h2 className="text-xl font-bold mb-3">Detalle de facturas</h2>
            <DataTable
              columns={[
                { key: 'id_factura', label: '#', className: 'w-12' },
                { key: 'fecha', label: 'Fecha', render: (f) => new Date(f.fecha).toLocaleString() },
                { key: 'cliente', label: 'Cliente' },
                { key: 'vendedor', label: 'Vendedor' },
                { key: 'total', label: 'Total', render: (f) => formatCurrency(f.total) },
                { key: 'ganancia', label: 'Ganancia', render: (f) => formatCurrency(f.ganancia) },
              ]}
              data={reporte.detalle}
              rowKey="id_factura"
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reportes;

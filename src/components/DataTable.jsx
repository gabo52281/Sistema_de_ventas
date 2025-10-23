import React from 'react'
import { MoreVertical } from 'lucide-react'

const DataTable = ({ columns = [], data = [], rowKey = 'id', actions = null }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* ✅ Vista Desktop con columnas alineadas */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold text-gray-700 truncate ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-center font-semibold text-gray-700 w-32">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map(row => (
              <tr key={row[rowKey]} className="hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-gray-900 truncate ${col.cellClass || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Vista móvil limpia en cards */}
      <div className="md:hidden">
        {data.map((row, idx) => (
          <div key={row[rowKey]} className={`p-5 ${idx !== data.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <div className="space-y-3">
              {columns.map(col => (
                <div key={col.key} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide min-w-20">
                    {col.label}
                  </span>
                  <span className={`text-sm text-gray-900 text-right flex-1 ${col.cellClass || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </span>
                </div>
              ))}
            </div>

            {actions && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {data.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-gray-400 mb-2">
            <MoreVertical className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-gray-500 text-sm">No hay datos para mostrar</p>
        </div>
      )}
    </div>
  )
}

export default DataTable

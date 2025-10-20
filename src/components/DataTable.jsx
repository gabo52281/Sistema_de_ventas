import React from 'react'

// DataTable minimal y reutilizable
// Props:
// - columns: [{ key, label, className, render? }]
// - data: array
// - rowKey: string
// - actions: (row) => JSX

const DataTable = ({ columns = [], data = [], rowKey = 'id', actions = null }) => {
  return (
    <div className="bg-white rounded shadow overflow-auto">
      <table className="min-w-full w-full table-fixed text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col.key} className={`p-2 ${col.className || 'text-left align-middle'}`}>{col.label}</th>
            ))}
            {actions && <th className="p-2 w-48 text-left align-middle">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row[rowKey]} className="border-t hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className={`p-2 ${col.cellClass || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="p-2">
                  <div className="flex items-center space-x-3">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable

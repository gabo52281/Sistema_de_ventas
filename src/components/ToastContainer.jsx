import React, { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="fixed right-4 bottom-4 flex flex-col gap-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-2 rounded shadow ${t.type === 'error' ? 'bg-red-500 text-white' : t.type === 'success' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>{t.message}</div>
            <button onClick={() => removeToast(t.id)} className="text-sm opacity-80">x</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer

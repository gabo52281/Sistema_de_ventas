import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UIContext } from '../context/UIContext'
import { Menu } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { toggleSidebar } = useContext(UIContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Texto central basado en el rol
  const getCenterText = () => {
    if (!user) return 'Sistema de Ventas POS e Inventario'

    switch (user.rol) {
      case 'superadmin':
        return 'Panel de Superadministrador'
      case 'admin':
        return 'Panel de Administración'
      case 'cajero':
        return 'Panel de Caja'
      case 'vendedor':
        return 'Panel de Ventas'
      default:
        return 'Sistema de Ventas POS e Inventario'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Izquierda */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <h1 className="text-xl font-bold text-blue-600">
            Sistema de Ventas POS e Inventario
          </h1>
        </div>

        {/* Centro */}
        <div className="hidden md:block text-gray-700 text-sm font-medium">
          {getCenterText()}
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm text-gray-600">
              👤 {user.nombre || 'Usuario'}
              {user.nombre_negocio && (
                <div className="text-2xl text-amber-600"> {user.nombre_negocio}</div>
              )}
            </div>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Salir
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar

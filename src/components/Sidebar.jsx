import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { UIContext } from '../context/UIContext'
import { appRoutes } from '../routes_config'

const Sidebar = () => {
  const { user } = useContext(AuthContext)
  const { sidebarOpen, closeSidebar } = useContext(UIContext)
  if (!user) return null

  const { rol } = user



  return (
    <>
      {/* Fondo semitransparente (solo móvil) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block`}
      >
        <nav className="p-4 space-y-2">
          {appRoutes
            .filter((r) => r.roles.includes(rol)) // ← solo las permitidas
            .map((r) => (
              <NavLink
                key={r.path}
                to={r.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'block p-2 rounded bg-blue-50 text-blue-700 font-semibold'
                    : 'block p-2 rounded hover:bg-gray-50'
                }
              >
                {r.label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

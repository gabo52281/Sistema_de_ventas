import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { appRoutes } from '../routes_config';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const { sidebarOpen, closeSidebar } = useContext(UIContext);

  if (!user) return null;
  const { rol } = user;

  return (
    <>
      {/* Fondo sombra (móvil) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-200 bg-opacity-30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md rounded-br-2xl border-r border-b z-50
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block`}
      >
     
        {/* Navegación */}
        <nav className="p-4 space-y-1">
          {appRoutes
            .filter((r) => r.roles.includes(rol))
            .map((r) => (
              <NavLink
                key={r.path}
                to={r.path}
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition
                    ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-semibold' : ''}
                  `
                }
              >
                {/* Si luego quieres íconos: <IconComponent /> */}
                {r.label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

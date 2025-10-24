// src/routesConfig.js

export const appRoutes = [

   // 🔐 Dashboard
  {
    path: '/dashboard',
    label: 'Dashboard',
    roles: ['admin', 'superadmin', 'cajero', 'vendedor'],
  },

  // ✅ 📌 Nueva ruta del Perfil (visible para todos los logueados)
  {
    path: '/perfil',
    label: 'Mi Perfil',
    roles: ['admin', 'superadmin', 'cajero', 'vendedor'],
  },
  
  
  // 🔐 Rutas para admin: Empleados
  { path: "/empleados", 
    label: "Empleados", 
    roles: ["admin"] 
  },

  // 🔐 Rutas para admin: Reportes
  {
  path: '/reportes',
  label: 'Reportes',
  roles: ['admin']
  },


  // 🔐 Superadmin y Admin
  {
    path: '/admin',
    label: 'Administrar Negocio',
    roles: ['superadmin'],
  },
 
  // 🔐 Rutas para admin
  {
    path: '/productos',
    label: 'Productos',
    roles: ['admin'],
  },
  {
    path: '/clientes',
    label: 'Clientes',
    roles: ['admin'],
  },
  // 🔐 Rutas comunes (facturación)
  {
    path: '/facturas',
    label: 'Facturar',
    roles: ['vendedor', 'cajero'],
  },
  {
    path: '/facturas/ver',
    label: 'Facturas',
    roles: ['admin', 'vendedor', 'cajero'],
  },
]

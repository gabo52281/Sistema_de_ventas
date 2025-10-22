// src/routesConfig.js

export const appRoutes = [

   // 🔐 Dashboard
  {
    path: '/dashboard',
    label: 'Dashboard',
    roles: ['admin', 'superadmin', 'cajero', 'vendedor'],
  },
  
  // 🔐 Rutas para admin: Empleados
  { path: "/empleados", 
    label: "Empleados", 
    roles: ["admin"] 
  },

  {
  path: '/reportes',
  label: 'Reportes',
  roles: ['admin', 'superadmin']
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

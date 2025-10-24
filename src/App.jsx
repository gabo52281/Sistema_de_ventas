import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Facturas from './pages/Facturas'
import AdminPanel from './pages/AdminPanel'
import { UIProvider } from './context/UIContext'
import { ToastProvider } from './context/ToastContext'
import FacturasList from './pages/FacturasList'
import Home from './pages/Home'
import Empleados from './pages/Empleados'
import Reportes from './pages/Reportes'
import PerfilUsuario from './pages/PerfilUsuario'


const PrivateRoute = ({ children, roles = [] }) => {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (roles.length && !roles.includes(user.rol)) return <Navigate to="/dashboard" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext)
  if (user) return <Navigate to="/dashboard" replace />
  return children
}



export default function App() {
  return (
      <UIProvider>
  <ToastProvider>
  <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute roles={["admin", "superadmin", "cajero", "vendedor"]}><Dashboard /></PrivateRoute>} />
          <Route path="/reportes" element={ <PrivateRoute roles={["admin"]}><Reportes /></PrivateRoute>} />
          <Route path="/empleados" element={<PrivateRoute roles={["admin"]}><Empleados /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute roles={["admin"]}><Productos /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute roles={["admin","cajero"]}><Clientes /></PrivateRoute>} />
          <Route path="/facturas" element={<PrivateRoute roles={["cajero","vendedor"]}><Facturas /></PrivateRoute>} />
          <Route path="/facturas/ver" element={<PrivateRoute roles={["admin","vendedor","cajero"]}><FacturasList /></PrivateRoute>} />
         <Route path="/admin" element={<PrivateRoute roles={["superadmin",]}><AdminPanel /></PrivateRoute>} />
         <Route path="/perfil" element={<PrivateRoute roles={["admin","superadmin","cajero","vendedor"]}><PerfilUsuario /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
    </UIProvider>
  )
}
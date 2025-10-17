import React, { useContext } from 'react'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'

const DashboardContent = () => {
  const { user } = useContext(AuthContext)
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Panel Principal</h2>
      {user?.rol === 'superadmin' && (
        <p>Bienvenido Superadmin. Aquí puedes crear administradores y negocios.</p>
      )}
      {user?.rol === 'admin' && (
        <p>Bienvenido Admin. Puedes gestionar productos, clientes y trabajadores.</p>
      )}
      {['cajero','vendedor'].includes(user?.rol) && (
        <p>Bienvenido. Puedes acceder al módulo de facturación.</p>
      )}
    </div>
  )
}

const Dashboard = () => (
  <MainLayout>
    <DashboardContent />
  </MainLayout>
)
export default Dashboard
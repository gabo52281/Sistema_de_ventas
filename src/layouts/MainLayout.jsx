import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
  <Navbar />
  <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-6 overflow-auto">{children}</main>
  </div>
  <footer className="text-center text-sm text-gray-500 py-4">
    © {new Date().getFullYear()} Sistema de Ventas
  </footer>
</div>

  )
}
export default MainLayout
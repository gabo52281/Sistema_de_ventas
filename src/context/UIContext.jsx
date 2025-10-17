import { createContext, useState } from 'react'

export const UIContext = createContext()

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <UIContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </UIContext.Provider>
  )
}

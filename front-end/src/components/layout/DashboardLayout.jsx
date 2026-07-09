import { useState } from 'react'
import Sidebar from './Sidebar.jsx'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — always fixed, uses transform to show/hide */}
      <div
        className={`
          fixed top-0 bottom-0 left-0
          w-64 z-50
          bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          -translate-x-full
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : ''}
        `}
      >
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main content — offset by sidebar width on desktop */}
      <div className="lg:ml-64 transition-[margin] duration-300">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700">Menu</span>
        </div>

        {/* ✅ Page content — renders children passed from AppRoutes */}
        {children}
      </div>
    </div>
  )
}
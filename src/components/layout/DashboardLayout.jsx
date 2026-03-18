import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#0d0d16] border-r border-slate-100 dark:border-slate-800 z-30 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#0d0d16] border-r border-slate-100 dark:border-slate-800 z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-2 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl px-4 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2 rounded-xl">
            <Menu size={20} />
          </button>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Learn<span className="text-brand-600">Flow</span>
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

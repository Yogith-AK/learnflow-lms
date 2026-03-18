import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Menu, X, BookOpen, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore, useThemeStore } from '../../lib/store'
import { Avatar } from '../ui'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <BookOpen className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">
              Learn<span className="text-brand-600 dark:text-brand-400">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/courses" className="btn-ghost">Courses</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="btn-ghost flex items-center gap-1.5">
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2.5 rounded-xl">
              <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar name={user?.name} size="sm" />
                </button>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#16161f] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
                        <User size={15} /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 font-medium transition-colors">
                          <ShieldCheck size={15} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
                {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Sign In</Link>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="btn-ghost p-2.5 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0a0f] px-4 py-4 space-y-2"
        >
          <Link to="/courses" className="block btn-ghost w-full justify-start" onClick={() => setMobileOpen(false)}>Courses</Link>
          {isAuthenticated && <Link to="/dashboard" className="block btn-ghost w-full justify-start" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" className="block btn-ghost w-full justify-start" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="block btn-ghost w-full justify-start" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/signup" className="block btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  )
}

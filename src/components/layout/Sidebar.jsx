import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, User, ShieldCheck, TrendingUp, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../../lib/store'
import { Avatar } from '../ui'
import { clsx } from 'clsx'

export default function Sidebar({ onClose }) {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin', icon: ShieldCheck, label: 'Admin Panel' },
    { to: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
    { to: '/courses', icon: TrendingUp, label: 'Browse Courses' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  const links = isAdmin ? adminLinks : studentLinks

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
          <BookOpen size={18} className="text-white" />
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-slate-100">
          Learn<span className="text-brand-600 dark:text-brand-400">Flow</span>
        </span>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-brand-50 to-slate-50 dark:from-brand-950/30 dark:to-slate-800/30 border border-brand-100 dark:border-brand-900/50">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full',
              isAdmin ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')}>
              {isAdmin ? '⚡ Admin' : '📚 Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={clsx('sidebar-link', location.pathname === to && 'active')}
          >
            <Icon size={18} />
            {label}
            {location.pathname === to && (
              <motion.div layoutId="sidebar-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => { logout(); window.location.href = '/' }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

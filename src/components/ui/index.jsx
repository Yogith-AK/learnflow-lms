import { motion } from 'framer-motion'
import { clsx } from 'clsx'

// Progress Bar
export function ProgressBar({ value = 0, className, showLabel = true, size = 'md' }) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={clsx('h-full rounded-full', heights[size],
            value === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-500 to-brand-400'
          )}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{value}% complete</p>
      )}
    </div>
  )
}

// Badge
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    brand: 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300',
    success: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
    beginner: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
    intermediate: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
    advanced: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
  }
  return (
    <span className={clsx('badge', variants[variant] || variants.default, className)}>
      {children}
    </span>
  )
}

// Skeleton Loader
export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function CourseCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-b-none rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )
}

// Avatar
export function Avatar({ name, src, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colors = ['from-brand-400 to-brand-600', 'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600']
  const colorIndex = (name?.charCodeAt(0) || 0) % colors.length

  if (src) {
    return <img src={src} alt={name} className={clsx('rounded-full object-cover', sizes[size], className)} />
  }
  return (
    <div className={clsx('rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white flex-shrink-0',
      sizes[size], colors[colorIndex], className)}>
      {initials}
    </div>
  )
}

// Star Rating
export function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={clsx('w-3.5 h-3.5', star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600')}
            viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
      {count && <span className="text-xs text-slate-400">({count.toLocaleString()})</span>}
    </div>
  )
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={clsx('relative bg-white dark:bg-[#16161f] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full overflow-hidden', sizes[size])}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <button onClick={onClose} className="btn-ghost p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
}

// Empty State
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}

// Stats Card
export function StatsCard({ icon, label, value, trend, color = 'brand' }) {
  const colors = {
    brand: 'from-brand-500 to-brand-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  }
  return (
    <motion.div whileHover={{ y: -4 }} className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
          {trend && (
            <p className={clsx('text-xs font-semibold mt-1.5', trend > 0 ? 'text-emerald-500' : 'text-red-500')}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <div className={clsx('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl', colors[color])}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

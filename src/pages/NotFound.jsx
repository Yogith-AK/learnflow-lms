import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative mb-8"
        >
          <div className="text-[120px] sm:text-[180px] font-bold leading-none select-none"
            style={{ WebkitTextStroke: '2px', color: 'transparent',
              WebkitTextStrokeColor: 'rgba(99,112,245,0.15)' }}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl sm:text-8xl"
            >
              🎓
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 max-w-md"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Page not found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Looks like this lesson doesn't exist yet. Head back home or browse our course catalog.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/" className="btn-primary px-6 py-3 rounded-xl">
              <Home size={16} /> Go Home
            </Link>
            <Link to="/courses" className="btn-secondary px-6 py-3 rounded-xl">
              <BookOpen size={16} /> Browse Courses
            </Link>
          </div>

          <button onClick={() => window.history.back()}
            className="btn-ghost text-sm mt-2 mx-auto flex items-center gap-1.5">
            <ArrowLeft size={14} /> Go back
          </button>
        </motion.div>
      </div>
    </div>
  )
}

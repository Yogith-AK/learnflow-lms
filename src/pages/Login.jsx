import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, BookOpen, ArrowRight, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../lib/store'
import { authenticate } from '../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = authenticate(email, password)
    if (result) {
      login(result.user, result.token)
      toast.success(`Welcome back, ${result.user.name}! 🎉`)
      navigate(result.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } else {
      toast.error('Invalid email or password')
    }
    setLoading(false)
  }

  const fillDemo = (type) => {
    if (type === 'admin') { setEmail('admin@learnflow.com'); setPassword('admin123') }
    else { setEmail('student@learnflow.com'); setPassword('student123') }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnpNMjQgMzR2Nmg2di02aC02ek0xMiAzNHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white">LearnFlow</span>
          </Link>
        </div>
        <div className="relative space-y-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Learn from the<br />world's best<br />instructors
            </h2>
            <p className="text-brand-100 mt-4 text-lg leading-relaxed">
              Join 50,000+ developers who've advanced their careers with LearnFlow.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[['📚', '200+ Courses'], ['🏆', '50K+ Students'], ['⭐', '4.9 Rating'], ['🌍', '120 Countries']].map(([emoji, text]) => (
              <div key={text} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <span>{emoji}</span> {text}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-brand-200 text-sm">© 2025 LearnFlow</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">LearnFlow</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to continue your learning journey</p>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50">
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 mb-2">🚀 Demo Accounts</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('admin')} className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors">
                Admin Demo
              </button>
              <button onClick={() => fillDemo('student')} className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-medium hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors">
                Student Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

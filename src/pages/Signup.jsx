import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, BookOpen, ArrowRight, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../lib/store'
import { signup } from '../lib/auth'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = signup(form.name, form.email, form.password)
    if (result.error) {
      toast.error(result.error)
    } else {
      login(result.user, result.token)
      toast.success(`Welcome to LearnFlow, ${result.user.name}! 🎉`)
      navigate('/courses')
    }
    setLoading(false)
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'][strength]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-purple-600 via-brand-700 to-brand-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnpNMjQgMzR2Nmg2di02aC02ek0xMiAzNHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-white">LearnFlow</span>
          </Link>
        </div>
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start your<br />learning journey<br />today — free
            </h2>
            <p className="text-purple-100 mt-4 text-lg leading-relaxed">
              Get instant access to 200+ premium courses, progress tracking, and certificates.
            </p>
          </div>
          <div className="space-y-4">
            {['✅ Free forever, no credit card needed', '✅ Access to 200+ expert courses', '✅ Track progress & earn certificates', '✅ Learn at your own pace'].map(item => (
              <p key={item} className="text-white/90 text-sm font-medium">{item}</p>
            ))}
          </div>
        </div>
        <div className="relative text-purple-200 text-sm">© 2025 LearnFlow</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-6"
        >
          <Link to="/" className="flex items-center gap-2 lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">LearnFlow</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Join 50,000+ learners for free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="name" value={form.name} onChange={handleChange}
                  className="input pl-10" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="input pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  className="input pl-10 pr-10" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{strengthLabel}</span>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                  className="input pl-10" placeholder="Repeat password" required />
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Free Account <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

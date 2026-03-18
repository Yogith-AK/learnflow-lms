import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, BookOpen, Trophy, ChevronRight, Play, Zap, Globe, Award } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import CourseCard from '../components/course/CourseCard'
import { YOUTUBE_COURSES } from '../lib/courses'

const FEATURED = YOUTUBE_COURSES.slice(0, 6)

const STATS = [
  { icon: <Users size={22} />, value: '50K+', label: 'Active Students' },
  { icon: <BookOpen size={22} />, value: '200+', label: 'Expert Courses' },
  { icon: <Trophy size={22} />, value: '98%', label: 'Satisfaction Rate' },
  { icon: <Globe size={22} />, value: '120+', label: 'Countries' },
]

const FEATURES = [
  { icon: '🎥', title: 'HD Video Lessons', desc: 'Crystal-clear YouTube-powered video content with seamless playback.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Track your learning journey with detailed analytics and milestones.' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn certificates upon completion to showcase your skills.' },
  { icon: '🌙', title: 'Learn Anywhere', desc: 'Fully responsive design works on any device, anytime.' },
  { icon: '⚡', title: 'Instant Enrollment', desc: 'One-click enrollment — start learning immediately for free.' },
  { icon: '🎯', title: 'Structured Paths', desc: 'Curated learning paths from beginner to expert level.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-[#0a0a0f] dark:via-[#0d0d18] dark:to-[#0a0a0f]" />
        <div className="absolute inset-0 dark:bg-mesh opacity-50" />

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-8"
            >
              <Zap size={14} className="fill-current" />
              Modern Learning Platform
              <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-xs">NEW</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight"
            >
              Level Up Your
              <span className="block text-gradient"> Tech Skills</span>
              in 2025
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              Access 200+ expert-curated courses in web development, AI, cloud, and more.
              Start learning today — completely free.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Link to="/signup" className="btn-primary px-8 py-4 text-base rounded-2xl group">
                Start Learning Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/courses" className="btn-secondary px-8 py-4 text-base rounded-2xl">
                <Play size={18} className="fill-current" />
                Browse Courses
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center gap-4 mt-10"
            >
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                  <div key={l} className={`w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0f] flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${['from-brand-400 to-brand-600', 'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600'][i]}`}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Loved by 50,000+ learners</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-3">
                  {s.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mb-2">FEATURED COURSES</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Top Courses to Get<br />You Hired
            </h2>
          </div>
          <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-sm hover:gap-2.5 transition-all">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link to="/courses" className="btn-secondary">View All Courses</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mb-2">WHY LEARNFLOW</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything You Need to<br />Master Your Craft
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 group hover:-translate-y-2"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnpNMjQgMzR2Nmg2di02aC02ek0xMiAzNHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <Award className="w-14 h-14 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ developers who've leveled up with LearnFlow. Free to start, always.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base hover:bg-brand-50 transition-colors shadow-glow-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">Learn<span className="text-brand-600">Flow</span></span>
          </div>
          <p className="text-sm text-slate-400">© 2025 LearnFlow. Built for learners, by learners.</p>
        </div>
      </footer>
    </div>
  )
}

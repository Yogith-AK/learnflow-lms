import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import CourseCard from '../components/course/CourseCard'
import { CourseCardSkeleton } from '../components/ui'
import { YOUTUBE_COURSES, CATEGORIES, LEVELS } from '../lib/courses'
import { useCourseStore } from '../lib/enrollments'
import { useEffect } from 'react'

export default function Courses() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { customCourses } = useCourseStore()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const allCourses = useMemo(() => [...YOUTUBE_COURSES, ...customCourses], [customCourses])

  const filtered = useMemo(() => {
    return allCourses.filter(c => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || c.category === category
      const matchLvl = level === 'All' || c.level === level
      return matchSearch && matchCat && matchLvl
    })
  }, [allCourses, search, category, level])

  const clearFilters = () => { setSearch(''); setCategory('All'); setLevel('All') }
  const hasFilters = search || category !== 'All' || level !== 'All'

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 dark:from-[#0a0a0f] dark:to-[#0a0a0f] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Explore All Courses
          </motion.h1>
          <p className="text-slate-400 text-lg mb-8">
            {allCourses.length} courses · Start learning for free
          </p>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, instructors, topics..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Category Filters */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1 min-w-max">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    category === cat
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/50'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Level Filter */}
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="input py-2 px-3 w-auto text-sm cursor-pointer">
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>

            {/* Filter Toggle Mobile */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost p-2.5 rounded-xl sm:hidden">
              <SlidersHorizontal size={18} />
            </button>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? 'Loading...' : (
              <>Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}</span> courses
                {hasFilters && ' · filtered'}</>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

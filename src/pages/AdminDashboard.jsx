import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BookOpen, TrendingUp, Award, Plus, BarChart3, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '../components/layout/DashboardLayout'
import { StatsCard } from '../components/ui'
import { YOUTUBE_COURSES } from '../lib/courses'
import { useCourseStore, useEnrollmentStore } from '../lib/enrollments'

const CATEGORY_DATA = [
  { name: 'Web Dev', courses: 5, color: '#6370f5' },
  { name: 'Programming', courses: 3, color: '#8b5cf6' },
  { name: 'AI & ML', courses: 2, color: '#06b6d4' },
  { name: 'Design', courses: 3, color: '#f59e0b' },
  { name: 'DevOps', courses: 2, color: '#10b981' },
]

const MONTHLY_DATA = [
  { month: 'Jan', students: 3200, courses: 8 },
  { month: 'Feb', students: 4100, courses: 10 },
  { month: 'Mar', students: 5200, courses: 12 },
  { month: 'Apr', students: 6800, courses: 14 },
  { month: 'May', students: 8200, courses: 15 },
  { month: 'Jun', students: 9500, courses: 16 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { customCourses } = useCourseStore()
  const { enrollments } = useEnrollmentStore()
  const allCourses = useMemo(() => [...YOUTUBE_COURSES, ...customCourses], [customCourses])

  const totalEnrollments = useMemo(() =>
    Object.values(enrollments).reduce((sum, user) => sum + Object.keys(user).length, 0),
    [enrollments]
  )
  const totalUsers = Object.keys(enrollments).length + 2 // +2 demo users

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Platform overview and analytics</p>
          </div>
          <Link to="/admin/courses" className="btn-primary">
            <Plus size={16} /> Manage Courses
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={<Users size={20} />} label="Total Users" value={totalUsers} trend={12} color="brand" />
          <StatsCard icon={<BookOpen size={20} />} label="Total Courses" value={allCourses.length} trend={5} color="purple" />
          <StatsCard icon={<TrendingUp size={20} />} label="Enrollments" value={totalEnrollments} trend={18} color="emerald" />
          <StatsCard icon={<Award size={20} />} label="Custom Courses" value={customCourses.length} color="amber" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Student Growth</h2>
                <p className="text-sm text-slate-400 mt-0.5">Monthly enrollment trend</p>
              </div>
              <BarChart3 size={20} className="text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="students" stroke="#6370f5" strokeWidth={2.5} dot={{ fill: '#6370f5', r: 4 }} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-1">By Category</h2>
            <p className="text-sm text-slate-400 mb-5">Course distribution</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="courses">
                  {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Courses']} contentStyle={{ borderRadius: 12, border: 'none', background: '#1e293b', color: '#f1f5f9', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {CATEGORY_DATA.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{cat.courses}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-1">Monthly Enrollments</h2>
          <p className="text-sm text-slate-400 mb-6">New enrollments per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" name="Students" fill="#6370f5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Courses Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">All Courses</h2>
            <Link to="/admin/courses" className="text-sm text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left pb-3 text-slate-500 dark:text-slate-400 font-semibold">Course</th>
                  <th className="text-left pb-3 text-slate-500 dark:text-slate-400 font-semibold hidden sm:table-cell">Category</th>
                  <th className="text-left pb-3 text-slate-500 dark:text-slate-400 font-semibold hidden md:table-cell">Level</th>
                  <th className="text-right pb-3 text-slate-500 dark:text-slate-400 font-semibold">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {allCourses.slice(0, 8).map(course => (
                  <tr key={course.id} className="group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/80/56` }} />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{course.title}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{course.category}</td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className={`badge text-xs ${
                        course.level === 'Beginner' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : course.level === 'Intermediate' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>{course.level}</span>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {(course.students || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

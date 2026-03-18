import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Edit3, Save, X, BookOpen, Award, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Avatar, Badge } from '../components/ui'
import { useAuthStore } from '../lib/store'
import { useEnrollmentStore } from '../lib/enrollments'
import { YOUTUBE_COURSES } from '../lib/courses'
import { useMemo } from 'react'
import { useCourseStore } from '../lib/enrollments'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const { getUserEnrollments, getEnrollment } = useEnrollmentStore()
  const { customCourses } = useCourseStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' })

  const allCourses = useMemo(() => [...YOUTUBE_COURSES, ...customCourses], [customCourses])
  const enrolledIds = useMemo(() => getUserEnrollments(user?.id), [user?.id])
  const completed = useMemo(() =>
    enrolledIds.filter(id => getEnrollment(user?.id, id)?.progress === 100),
    [enrolledIds, user?.id]
  )

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return }
    updateUser({ name: form.name, bio: form.bio })
    toast.success('Profile updated! ✅')
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({ name: user?.name || '', bio: user?.bio || '' })
    setEditing(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar name={user?.name} size="xl" />
                {user?.role === 'ADMIN' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                    <Shield size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input text-xl font-bold py-1.5 px-3 mb-2"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant={user?.role === 'ADMIN' ? 'brand' : 'default'}>
                    {user?.role === 'ADMIN' ? '⚡ Administrator' : '📚 Student'}
                  </Badge>
                  {completed.length > 0 && (
                    <Badge variant="success">🏆 {completed.length} course{completed.length > 1 ? 's' : ''} completed</Badge>
                  )}
                </div>
              </div>
            </div>

            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost">
                <Edit3 size={16} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="btn-ghost">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  <Save size={16} /> Save
                </button>
              </div>
            )}
          </div>

          {/* Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center">
                <Mail size={16} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Joined</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="label">Bio</label>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="input resize-none"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[3rem]">
                {user?.bio || 'No bio added yet. Click Edit to add one.'}
              </p>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Enrolled', value: enrolledIds.length, icon: <BookOpen size={20} />, color: 'brand' },
            { label: 'Completed', value: completed.length, icon: <Award size={20} />, color: 'emerald' },
            { label: 'In Progress', value: enrolledIds.length - completed.length, icon: <User size={20} />, color: 'amber' },
          ].map(({ label, value, icon, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 text-center">
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                color === 'brand' ? 'bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                  : color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
              }`}>
                {icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Enrolled Courses List */}
        {enrolledIds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Enrolled Courses</h3>
            <div className="space-y-3">
              {enrolledIds.map(id => {
                const course = allCourses.find(c => c.id === id)
                const enrollment = getEnrollment(user?.id, id)
                if (!course) return null
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover"
                        onError={e => { e.target.src = `https://picsum.photos/seed/${id}/96/72` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${enrollment?.progress || 0}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{enrollment?.progress || 0}%</span>
                      </div>
                    </div>
                    {enrollment?.progress === 100 && (
                      <Award size={16} className="text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}

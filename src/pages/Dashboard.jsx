import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Award, Clock, ArrowRight, Play } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { ProgressBar, StatsCard, EmptyState, Avatar } from '../components/ui'
import { useAuthStore } from '../lib/store'
import { useEnrollmentStore } from '../lib/enrollments'
import { YOUTUBE_COURSES } from '../lib/courses'
import { useCourseStore } from '../lib/enrollments'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { getUserEnrollments, getEnrollment } = useEnrollmentStore()
  const { customCourses } = useCourseStore()

  const allCourses = useMemo(() => [...YOUTUBE_COURSES, ...customCourses], [customCourses])
  const enrolledIds = useMemo(() => getUserEnrollments(user?.id), [user?.id])

  const enrolledCourses = useMemo(() =>
    enrolledIds.map(id => {
      const course = allCourses.find(c => c.id === id)
      const enrollment = getEnrollment(user?.id, id)
      return course ? { ...course, enrollment } : null
    }).filter(Boolean),
    [enrolledIds, allCourses, user?.id]
  )

  const inProgress = enrolledCourses.filter(c => c.enrollment?.progress > 0 && c.enrollment?.progress < 100)
  const completed = enrolledCourses.filter(c => c.enrollment?.progress === 100)
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.enrollment?.progress || 0), 0) / enrolledCourses.length)
    : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} size="lg" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{greeting} 👋</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
            </div>
          </div>
          <Link to="/courses" className="hidden sm:flex btn-primary">
            Browse Courses <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={<BookOpen size={20} />} label="Enrolled" value={enrolledCourses.length} color="brand" />
          <StatsCard icon={<TrendingUp size={20} />} label="In Progress" value={inProgress.length} color="amber" />
          <StatsCard icon={<Award size={20} />} label="Completed" value={completed.length} color="emerald" />
          <StatsCard icon={<Clock size={20} />} label="Avg. Progress" value={`${avgProgress}%`} color="purple" />
        </div>

        {/* Continue Learning */}
        {inProgress.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Play size={18} className="text-brand-500" /> Continue Learning
              </h2>
            </div>
            <div className="space-y-4">
              {inProgress.slice(0, 3).map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/course/${course.id}`} className="card p-4 flex items-center gap-4 group hover:-translate-y-1 block">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/160/112` }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={12} className="text-brand-600 fill-brand-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{course.instructor}</p>
                      <div className="mt-2">
                        <ProgressBar value={course.enrollment?.progress || 0} size="sm" showLabel={false} />
                        <p className="text-xs text-slate-400 mt-1">{course.enrollment?.progress || 0}% complete</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Enrolled Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Courses</h2>
            <Link to="/courses" className="text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Browse more
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No courses yet"
              description="Enroll in a course to start your learning journey."
              action={<Link to="/courses" className="btn-primary">Browse Courses</Link>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/course/${course.id}`} className="card p-4 flex items-start gap-4 group hover:-translate-y-1 block">
                    <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80"
                        onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/128/96` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{course.lessons?.length} lessons</p>
                      <div className="mt-2">
                        <ProgressBar value={course.enrollment?.progress || 0} size="sm" showLabel={false} />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">{course.enrollment?.progress || 0}%</span>
                        {course.enrollment?.progress === 100 && (
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <Award size={11} /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {YOUTUBE_COURSES.filter(c => !enrolledIds.includes(c.id)).slice(0, 4).map((course, i) => (
              <Link key={course.id} to={`/course/${course.id}`}
                className="card p-4 flex items-center gap-3 group hover:-translate-y-1">
                <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/112/80` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-xs truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {course.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{course.category} · {course.level}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

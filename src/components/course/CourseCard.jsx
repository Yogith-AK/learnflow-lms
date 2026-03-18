import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Clock, PlayCircle, Lock } from 'lucide-react'
import { Badge, StarRating, ProgressBar } from '../ui'
import { useAuthStore } from '../../lib/store'
import { useEnrollmentStore } from '../../lib/enrollments'

export default function CourseCard({ course, index = 0 }) {
  const { user, isAuthenticated } = useAuthStore()
  const { isEnrolled, getEnrollment } = useEnrollmentStore()
  const enrolled = isAuthenticated && user && isEnrolled(user.id, course.id)
  const enrollment = enrolled ? getEnrollment(user.id, course.id) : null

  const levelVariant = {
    Beginner: 'beginner',
    Intermediate: 'intermediate',
    Advanced: 'advanced',
  }[course.level] || 'default'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/course/${course.id}`} className="block">
        <div className="card p-0 overflow-hidden h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative overflow-hidden bg-slate-900 aspect-video">
            <img
              src={course.thumbnail || `https://picsum.photos/seed/${course.id}/640/360`}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${course.id}/640/360`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <PlayCircle className="w-8 h-8 text-brand-600" />
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                {course.category}
              </span>
            </div>

            {/* Enrolled Badge */}
            {enrolled && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold">
                  Enrolled
                </span>
              </div>
            )}

            {/* Lesson count */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
              <PlayCircle size={12} />
              {course.lessons?.length || 0} lessons
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={levelVariant}>{course.level}</Badge>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} /> {course.duration}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold">
                {course.instructor?.charAt(0)}
              </div>
              <span className="truncate font-medium">{course.instructor}</span>
            </div>

            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <StarRating rating={course.rating || 4.5} count={course.students} />
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={11} />
                {(course.students || 0).toLocaleString()}
              </span>
            </div>

            {/* Progress for enrolled courses */}
            {enrolled && enrollment && (
              <ProgressBar value={enrollment.progress} size="sm" showLabel={false} />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

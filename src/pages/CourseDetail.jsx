import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, PlayCircle, Clock, Users, Star, BookOpen, ChevronLeft, Lock, CheckCheck } from 'lucide-react'
import ReactPlayer from 'react-player/youtube'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import { Badge, ProgressBar, StarRating, Avatar } from '../components/ui'
import { useAuthStore } from '../lib/store'
import { useEnrollmentStore } from '../lib/enrollments'
import { YOUTUBE_COURSES } from '../lib/courses'
import { useCourseStore } from '../lib/enrollments'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { isEnrolled, enroll, getEnrollment, completeLesson } = useEnrollmentStore()
  const { customCourses } = useCourseStore()
  const [activeLesson, setActiveLesson] = useState(0)
  const [enrolling, setEnrolling] = useState(false)

  const course = useMemo(() => {
    return [...YOUTUBE_COURSES, ...customCourses].find(c => c.id === id)
  }, [id, customCourses])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0f]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course not found</h2>
          <Link to="/courses" className="btn-primary">Browse Courses</Link>
        </div>
      </div>
    )
  }

  const enrolled = isAuthenticated && user && isEnrolled(user.id, course.id)
  const enrollment = enrolled ? getEnrollment(user.id, course.id) : null
  const currentLesson = course.lessons[activeLesson]

  const handleEnroll = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to enroll'); navigate('/login'); return }
    setEnrolling(true)
    await new Promise(r => setTimeout(r, 800))
    enroll(user.id, course.id)
    toast.success(`Enrolled in "${course.title}"! 🎉`)
    setEnrolling(false)
  }

  const handleComplete = () => {
    if (!enrolled) return
    completeLesson(user.id, course.id, currentLesson.id, course.lessons.length)
    toast.success('Lesson marked as complete! ✅')
    if (activeLesson < course.lessons.length - 1) {
      setActiveLesson(i => i + 1)
    }
  }

  const isLessonCompleted = (lessonId) => enrollment?.completedLessons?.includes(lessonId)

  const levelVariant = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced' }[course.level] || 'default'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 group transition-colors">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="card p-0 overflow-hidden">
              {enrolled ? (
                <div className="relative">
                  <div className="aspect-video bg-black">
                    <ReactPlayer
                      url={currentLesson?.videoUrl}
                      width="100%"
                      height="100%"
                      controls
                      playing={false}
                      config={{ youtube: { playerVars: { modestbranding: 1 } } }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-1">
                          Lesson {activeLesson + 1} of {course.lessons.length}
                        </p>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentLesson?.title}</h2>
                      </div>
                      <button
                        onClick={handleComplete}
                        disabled={isLessonCompleted(currentLesson?.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isLessonCompleted(currentLesson?.id)
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                            : 'btn-primary'
                        }`}>
                        {isLessonCompleted(currentLesson?.id) ? (
                          <><CheckCheck size={15} /> Completed</>
                        ) : (
                          <><CheckCircle2 size={15} /> Mark Complete</>
                        )}
                      </button>
                    </div>

                    {enrollment && (
                      <div className="mt-4">
                        <ProgressBar value={enrollment.progress} size="md" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    <img src={course.thumbnail} alt={course.title}
                      className="w-full h-full object-cover opacity-50"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/640/360` }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                        <PlayCircle size={40} className="text-white" />
                      </div>
                      <p className="text-white font-semibold">Enroll to start watching</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                        <Lock size={12} /> Preview locked
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="card p-6 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={levelVariant}>{course.level}</Badge>
                <Badge variant="default">{course.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Clock size={13} /> {course.duration}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <PlayCircle size={13} /> {course.lessons.length} lessons
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-4 flex-wrap">
                <StarRating rating={course.rating || 4.5} count={course.students} />
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Users size={14} /> {(course.students || 0).toLocaleString()} students
                </span>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <Avatar name={course.instructor} size="md" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{course.instructor}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Course Instructor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enroll Card */}
            {!enrolled && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 space-y-5">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">Free</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Full access included</p>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {[`${course.lessons.length} video lessons`, course.duration + ' of content', 'Certificate on completion', 'Full lifetime access', 'Mobile & tablet access'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <button onClick={handleEnroll} disabled={enrolling}
                  className="btn-primary w-full justify-center py-3.5 rounded-xl text-base">
                  {enrolling ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enrolling...
                    </span>
                  ) : 'Enroll Now — It\'s Free'}
                </button>
              </motion.div>
            )}

            {/* Lesson List */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-brand-500" />
                Course Curriculum
              </h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => {
                  const completed = isLessonCompleted(lesson.id)
                  const isActive = activeLesson === i
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => enrolled ? setActiveLesson(i) : null}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                        isActive && enrolled
                          ? 'bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800'
                          : enrolled
                          ? 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          : 'cursor-default'
                      }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        completed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : isActive && enrolled ? 'bg-brand-100 dark:bg-brand-900 text-brand-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {completed ? <CheckCircle2 size={16} /> : enrolled ? i + 1 : <Lock size={13} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive && enrolled ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{lesson.duration}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

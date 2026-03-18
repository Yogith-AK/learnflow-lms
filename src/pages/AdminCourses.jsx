import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, X, Save, AlertTriangle, Youtube, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Modal, Badge } from '../components/ui'
import { YOUTUBE_COURSES, CATEGORIES, LEVELS } from '../lib/courses'
import { useCourseStore } from '../lib/enrollments'

const EMPTY_COURSE = {
  title: '', description: '', thumbnail: '', category: 'Web Development',
  level: 'Beginner', duration: '', instructor: '',
  lessons: [{ id: Date.now().toString(), title: '', videoUrl: '', duration: '' }]
}

function LessonRow({ lesson, index, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-1 pt-2.5 text-slate-400">
        <GripVertical size={14} />
        <span className="text-xs font-bold text-slate-400">{index + 1}</span>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          value={lesson.title}
          onChange={e => onChange(index, 'title', e.target.value)}
          className="input text-sm py-2"
          placeholder="Lesson title"
        />
        <input
          value={lesson.videoUrl}
          onChange={e => onChange(index, 'videoUrl', e.target.value)}
          className="input text-sm py-2 sm:col-span-1"
          placeholder="YouTube URL"
        />
        <div className="flex gap-2">
          <input
            value={lesson.duration}
            onChange={e => onChange(index, 'duration', e.target.value)}
            className="input text-sm py-2 flex-1"
            placeholder="e.g. 45m"
          />
          {canRemove && (
            <button onClick={() => onRemove(index)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CourseForm({ initial = EMPTY_COURSE, onSave, onCancel, isEdit }) {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(initial)))
  const [saving, setSaving] = useState(false)

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleLessonChange = (i, k, v) => {
    setForm(f => ({ ...f, lessons: f.lessons.map((l, idx) => idx === i ? { ...l, [k]: v } : l) }))
  }
  const addLesson = () => {
    setForm(f => ({ ...f, lessons: [...f.lessons, { id: Date.now().toString(), title: '', videoUrl: '', duration: '' }] }))
  }
  const removeLesson = (i) => {
    setForm(f => ({ ...f, lessons: f.lessons.filter((_, idx) => idx !== i) }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Course title is required'); return }
    if (!form.instructor.trim()) { toast.error('Instructor name is required'); return }
    const validLessons = form.lessons.filter(l => l.title.trim())
    if (validLessons.length === 0) { toast.error('Add at least one lesson'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    onSave({ ...form, lessons: validLessons.map(l => ({ ...l, id: l.id || Date.now().toString() })) })
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Course Title *</label>
          <input value={form.title} onChange={e => handleChange('title', e.target.value)}
            className="input" placeholder="e.g. Complete React Developer Course" />
        </div>
        <div>
          <label className="label">Instructor *</label>
          <input value={form.instructor} onChange={e => handleChange('instructor', e.target.value)}
            className="input" placeholder="e.g. John Doe" />
        </div>
        <div>
          <label className="label">Duration</label>
          <input value={form.duration} onChange={e => handleChange('duration', e.target.value)}
            className="input" placeholder="e.g. 10h 30m" />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={e => handleChange('category', e.target.value)} className="input cursor-pointer">
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Level</label>
          <select value={form.level} onChange={e => handleChange('level', e.target.value)} className="input cursor-pointer">
            {LEVELS.filter(l => l !== 'All').map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Thumbnail URL</label>
          <input value={form.thumbnail} onChange={e => handleChange('thumbnail', e.target.value)}
            className="input" placeholder="https://... (image URL or leave blank)" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
            className="input resize-none" rows={3} placeholder="Course description..." />
        </div>
      </div>

      {/* Lessons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Lessons *</label>
          <button type="button" onClick={addLesson}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            <Plus size={13} /> Add Lesson
          </button>
        </div>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {form.lessons.map((lesson, i) => (
            <LessonRow key={lesson.id} lesson={lesson} index={i}
              onChange={handleLessonChange} onRemove={removeLesson} canRemove={form.lessons.length > 1} />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <Youtube size={11} /> Paste YouTube video URLs for each lesson
        </p>
      </div>

      <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 justify-center">
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEdit ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <><Save size={15} /> {isEdit ? 'Update Course' : 'Create Course'}</>
          )}
        </button>
      </div>
    </div>
  )
}

export default function AdminCourses() {
  const { customCourses, addCourse, updateCourse, deleteCourse } = useCourseStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const allCourses = useMemo(() => [...YOUTUBE_COURSES, ...customCourses], [customCourses])
  const filtered = useMemo(() => allCourses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase())
  ), [allCourses, search])

  const handleCreate = (data) => {
    addCourse(data)
    toast.success('Course created! 🎉')
    setShowForm(false)
  }

  const handleUpdate = (data) => {
    updateCourse(editingCourse.id, data)
    toast.success('Course updated! ✅')
    setEditingCourse(null)
  }

  const handleDelete = (id) => {
    deleteCourse(id)
    toast.success('Course deleted')
    setDeleteConfirm(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Courses</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{allCourses.length} courses total · {customCourses.length} custom</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Add Course
          </button>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10" placeholder="Search courses..." />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>

        {/* Course Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="text-left p-4 text-slate-500 dark:text-slate-400 font-semibold">Course</th>
                  <th className="text-left p-4 text-slate-500 dark:text-slate-400 font-semibold hidden sm:table-cell">Category</th>
                  <th className="text-left p-4 text-slate-500 dark:text-slate-400 font-semibold hidden md:table-cell">Level</th>
                  <th className="text-left p-4 text-slate-500 dark:text-slate-400 font-semibold hidden lg:table-cell">Lessons</th>
                  <th className="text-left p-4 text-slate-500 dark:text-slate-400 font-semibold hidden lg:table-cell">Type</th>
                  <th className="text-right p-4 text-slate-500 dark:text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                <AnimatePresence>
                  {filtered.map((course) => {
                    const isCustom = customCourses.some(c => c.id === course.id)
                    return (
                      <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                              <img src={course.thumbnail || `https://picsum.photos/seed/${course.id}/96/64`}
                                alt="" className="w-full h-full object-cover"
                                onError={e => { e.target.src = `https://picsum.photos/seed/${course.id}/96/64` }} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">{course.title}</p>
                              <p className="text-xs text-slate-400">{course.instructor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{course.category}</td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant={course.level?.toLowerCase() === 'beginner' ? 'beginner' : course.level?.toLowerCase() === 'intermediate' ? 'intermediate' : 'advanced'}>
                            {course.level}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{course.lessons?.length || 0}</td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className={`badge text-xs ${isCustom ? 'bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            {isCustom ? '⚡ Custom' : '📺 YouTube'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isCustom ? (
                              <>
                                <button onClick={() => setEditingCourse(course)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors">
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => setDeleteConfirm(course)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 px-3">Read-only</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400">No courses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Course" size="xl">
        <CourseForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingCourse} onClose={() => setEditingCourse(null)} title="Edit Course" size="xl">
        {editingCourse && (
          <CourseForm initial={editingCourse} onSave={handleUpdate} onCancel={() => setEditingCourse(null)} isEdit />
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Course" size="sm">
        {deleteConfirm && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Delete "{deleteConfirm.title}"?</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This action cannot be undone. All lesson data will be permanently removed.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 justify-center btn-primary bg-red-500 hover:bg-red-600 border-0">
                Delete Course
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

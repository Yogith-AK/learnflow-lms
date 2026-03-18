import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEnrollmentStore = create(
  persist(
    (set, get) => ({
      enrollments: {}, // { userId: { courseId: { enrolledAt, progress, completedLessons } } }

      enroll: (userId, courseId) => {
        set((state) => ({
          enrollments: {
            ...state.enrollments,
            [userId]: {
              ...(state.enrollments[userId] || {}),
              [courseId]: {
                enrolledAt: new Date().toISOString(),
                progress: 0,
                completedLessons: [],
              },
            },
          },
        }))
      },

      isEnrolled: (userId, courseId) => {
        const { enrollments } = get()
        return !!(enrollments[userId] && enrollments[userId][courseId])
      },

      getEnrollment: (userId, courseId) => {
        const { enrollments } = get()
        return enrollments[userId]?.[courseId] || null
      },

      getUserEnrollments: (userId) => {
        const { enrollments } = get()
        return Object.keys(enrollments[userId] || {})
      },

      completeLesson: (userId, courseId, lessonId, totalLessons) => {
        set((state) => {
          const userEnrollments = state.enrollments[userId] || {}
          const enrollment = userEnrollments[courseId] || { completedLessons: [], progress: 0 }
          const completed = enrollment.completedLessons.includes(lessonId)
            ? enrollment.completedLessons
            : [...enrollment.completedLessons, lessonId]
          const progress = Math.round((completed.length / totalLessons) * 100)

          return {
            enrollments: {
              ...state.enrollments,
              [userId]: {
                ...userEnrollments,
                [courseId]: {
                  ...enrollment,
                  completedLessons: completed,
                  progress,
                },
              },
            },
          }
        })
      },
    }),
    { name: 'lms-enrollments' }
  )
)

// Course management store
export const useCourseStore = create(
  persist(
    (set, get) => ({
      customCourses: [], // Admin-added courses

      addCourse: (course) => {
        const newCourse = {
          ...course,
          id: `custom-${Date.now()}`,
          students: 0,
          rating: 0,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ customCourses: [...state.customCourses, newCourse] }))
        return newCourse
      },

      updateCourse: (id, updates) => {
        set((state) => ({
          customCourses: state.customCourses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }))
      },

      deleteCourse: (id) => {
        set((state) => ({
          customCourses: state.customCourses.filter((c) => c.id !== id),
        }))
      },
    }),
    { name: 'lms-courses' }
  )
)

// Simple JWT-like auth using localStorage (no backend needed for Vercel deploy)
// For production, replace with real backend

import { useAuthStore } from './store'

export const DEMO_USERS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@learnflow.com',
    password: 'admin123',
    role: 'ADMIN',
    avatar: null,
    bio: 'Platform administrator and course creator.',
    joinedAt: '2024-01-15',
  },
  {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'student@learnflow.com',
    password: 'student123',
    role: 'STUDENT',
    avatar: null,
    bio: 'Passionate learner exploring tech.',
    joinedAt: '2024-03-10',
  },
]

export function generateToken(user) {
  // Simple base64 encoding (use real JWT in production)
  return btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))
}

export function authenticate(email, password) {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) return null
  const { password: _, ...safeUser } = user
  return { user: safeUser, token: generateToken(user) }
}

export function signup(name, email, password) {
  const exists = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return { error: 'Email already registered' }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'STUDENT',
    avatar: null,
    bio: '',
    joinedAt: new Date().toISOString().split('T')[0],
  }
  DEMO_USERS.push({ ...newUser, password })
  return { user: newUser, token: generateToken(newUser) }
}

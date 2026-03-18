# 🎓 LearnFlow — Modern Learning Management System

A full-featured LMS built with React, Vite, Tailwind CSS, and Framer Motion. Features 15 real YouTube courses, admin panel, progress tracking, dark mode, and Vercel-ready deployment.

## ✨ Features

- 🎥 **15 Real YouTube Courses** — React, Python, ML, TypeScript, Docker, AWS, and more
- 👤 **Authentication** — Signup/login with role-based access (Student & Admin)
- 📊 **Student Dashboard** — Progress tracking, enrolled courses, continue learning
- 🛠 **Admin Panel** — Create/edit/delete courses, analytics charts, user stats
- 🌙 **Dark/Light Mode** — Persistent theme toggle
- 📱 **Fully Responsive** — Works on all screen sizes
- ⚡ **Framer Motion** — Smooth animations throughout
- 🔍 **Search & Filter** — Filter courses by category, level, and search term
- 📈 **Progress Tracking** — Mark lessons complete, track % per course

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open http://localhost:5173

### 3. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@learnflow.com | admin123 |
| Student | student@learnflow.com | student123 |

## 📦 Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Vercel Dashboard
1. Push this project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/lms-app.git
git push -u origin main
```
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy** ✅

## 🗄 Optional: Aiven PostgreSQL Backend

The app works fully client-side with localStorage. For a real database:

### 1. Create Aiven Account
- Sign up at [aiven.io](https://aiven.io)
- Create a PostgreSQL service
- Copy the connection URI

### 2. Setup Prisma
```bash
cp .env.example .env
# Edit .env and paste your Aiven DATABASE_URL
npm install -D prisma @prisma/client
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Run Express Backend
```bash
npm install express bcryptjs jsonwebtoken cors
npm run server
```

## 📁 Project Structure

```
lms-app/
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, Sidebar, DashboardLayout
│   │   ├── course/       # CourseCard
│   │   └── ui/           # Shared components (Badge, Modal, etc.)
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Login.jsx         # Login
│   │   ├── Signup.jsx        # Registration
│   │   ├── Courses.jsx       # Course catalog with filters
│   │   ├── CourseDetail.jsx  # Video player + lesson list
│   │   ├── Dashboard.jsx     # Student dashboard
│   │   ├── Profile.jsx       # User profile
│   │   ├── AdminDashboard.jsx # Admin analytics
│   │   └── AdminCourses.jsx  # Course CRUD
│   ├── lib/
│   │   ├── store.js         # Zustand auth + theme store
│   │   ├── enrollments.js   # Enrollment + course store
│   │   ├── auth.js          # Auth functions
│   │   └── courses.js       # 15 YouTube courses data
│   ├── App.jsx              # Router setup
│   └── index.css            # Tailwind + custom styles
├── prisma/
│   └── schema.prisma        # DB schema for Aiven
├── vercel.json              # Vercel SPA config
└── tailwind.config.js
```

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand (persisted) |
| Routing | React Router v6 |
| Charts | Recharts |
| Video | React Player (YouTube) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| ORM (optional) | Prisma |
| DB (optional) | Aiven PostgreSQL |

## 📚 Included Courses

1. Complete React Developer Course 2024
2. Full Stack JavaScript Bootcamp
3. Python for Everybody
4. Machine Learning with Python
5. CSS Masterclass — Modern Layouts
6. TypeScript Full Course
7. Next.js 14 — App Router Mastery
8. Docker & Kubernetes Fundamentals
9. Data Structures & Algorithms
10. SQL & PostgreSQL Bootcamp
11. Tailwind CSS Crash Course
12. Git & GitHub Complete Guide
13. System Design Interview Prep
14. Figma UI/UX Design Masterclass
15. AWS Cloud Practitioner Essentials

## 📝 License

MIT — free to use for learning and portfolio projects.

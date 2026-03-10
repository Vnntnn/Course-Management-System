# Course Management System

A full-stack web application for managing online courses, built with Vue.js and Express.js.

## Quick Start

### Prerequisites
- Node.js v20.19+ or v22.12+

### Run the Project

**Windows:**
```cmd
run.bat
```

**Mac/Linux:**
```bash
chmod +x run.sh
./run.sh
```

The script will:
1. Install all dependencies
2. Set up the database
3. Start both servers

Access the application:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Manual Setup

If you prefer to run manually:

```bash
# Install server dependencies
cd server
npm install
npx prisma migrate deploy
npx prisma generate

# Install client dependencies
cd ../client
npm install

# Start servers (in separate terminals)
# Terminal 1 - Backend
cd server && node server.js

# Terminal 2 - Frontend
cd client && npm run dev
```

## Project Structure

```
├── client/          # Vue.js frontend
│   ├── src/
│   │   ├── components/  # Reusable Vue components
│   │   ├── pages/       # Page components
│   │   ├── router/      # Vue Router configuration
│   │   └── utils/       # API utilities
│   └── package.json
├── server/          # Express.js backend
│   ├── controller/  # Route controllers
│   ├── services/    # Business logic
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── prisma/      # Database schema
├── run.bat          # Windows run script
└── run.sh           # Unix/Mac run script
```

## Features

- **Authentication:** User registration, login, role-based access (student/instructor)
- **Courses:** Browse, create, edit, and enroll in courses
- **Content:** Manage lessons and topics with text/video/code content
- **Exams:** Create exams, add questions, take exams, view results
- **Dashboard:** Personalized view for students and instructors

## Tech Stack

- **Frontend:** Vue.js 3, Vue Router, Tailwind CSS, Vite
- **Backend:** Express.js, Passport.js, Prisma ORM
- **Database:** SQLite
# CampusMart Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Environment Setup

### Backend (.env)
Create `backend/.env` with:
```
PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_postgres_connection_string
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=campusmart
DB_PORT=5432
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_SECRET=CAMPUS_ADMIN_2026
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
Create `frontend/.env` with:
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Quick Start
Double-click `start.bat` to run both servers automatically.

## Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

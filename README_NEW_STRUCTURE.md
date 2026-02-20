# Campus Mart - New Project Structure

## 📁 Project Organization

The project has been reorganized into a clear frontend/backend structure:

```
campus-mart/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   ├── index.html    # Entry HTML file
│   ├── vite.config.js
│   └── package.json
│
├── backend/          # Node.js + Express backend server
│   ├── index.js      # Main server file
│   ├── db.js         # Database configuration
│   ├── mpesa.js      # M-Pesa integration
│   ├── .env          # Environment variables
│   └── package.json
│
└── legacy/           # Old project files (for reference)
```

## 🚀 Quick Start

### Option 1: Automated Start (Recommended)

**Windows Command Prompt:**
```bash
start-dev.bat
```

**Windows PowerShell:**
```powershell
.\start-dev.ps1
```

This will:
1. Install all dependencies for both frontend and backend
2. Start the backend server on port 5000
3. Start the frontend dev server on port 5173

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Endpoints:** http://localhost:5000/api/*

## 📝 Environment Setup

Make sure you have `.env` files configured:

**backend/.env** - Database and API credentials
**frontend/.env** (if needed) - Supabase or other frontend configs

## 🛠️ Development Commands

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm start        # Start backend server
npm run dev      # Start with nodemon (if configured)
```

## 📦 Dependencies

Both frontend and backend have their own `package.json` and `node_modules`.

To install dependencies separately:
```bash
cd frontend && npm install
cd backend && npm install
```

## 🔄 Migration Notes

- All frontend files moved to `frontend/` folder
- All backend files moved to `backend/` folder
- Original files kept in root and `legacy/` for reference
- Vite proxy configuration maintained for API calls

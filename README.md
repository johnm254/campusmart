# CampusMart

This repository is now organized as a **monorepo** with separate frontend and backend projects.

## Structure

```
campus--mart/
├── backend/        # Express server
├── frontend/       # React/Vite client
├── .gitignore
├── README.md
└── package.json    # orchestrator
```

## Getting started

1. **Install dependencies** (from the root):
   ```bash
   npm install           # installs root dev tools
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Run development environment**
   - from root:
     ```bash
     npm run dev       # starts backend and frontend together
     ```
   - or separately:
     ```bash
     cd backend && npm run dev      # starts API on :5000
     cd frontend && npm run dev     # starts client on :5173/4
     ```

3. **Environment variables**
   - Backend uses `backend/.env`.
   - You may copy `backend/.env.example` and fill in values.

4. **Building for production**
   - Client: `cd frontend && npm run build`
   - Server: bundle or deploy as usual.

## Notes

- Static assets and public files live under `frontend/public`.
- React source files are in `frontend/src`.
- Backend server entrypoint is `backend/index.js`.
- Utility script `check-secrets.js` (at repo root) scans staged files for secrets.

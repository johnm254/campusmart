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

## Backend‑only development & deployment

If you're only interested in the API (for example, to host it on Railway) you can completely
ignore or delete the `frontend/` folder – the backend is self‑contained.

### Running just the backend locally

```bash
# from the repository root or anywhere else:
cd backend
npm install       # one-time setup
npm start         # production mode (or npm run dev)
```

### Deploying on Railway

1. Create a new project on Railway and connect your GitHub account.
2. Select this repository (`johnm254/campusmart`) and choose the `main` branch.
3. In the deployment settings, set the **root directory** to `backend` so Railway only considers
   the server package.
4. Ensure the build command is `npm install` and the start command is `npm start`.
5. Add the PostgreSQL plugin – this provides a `DATABASE_URL` environment variable.
6. Set other secrets (e.g. `SESSION_SECRET`, mail credentials) in the Railway variables panel.
7. Trigger a deploy; the server will start on a Railway-provided URL.

> 📝 The frontend is *not* required for the backend to function, so you don't need to build or
> deploy it when working with Railway. You may keep it in the repo or remove it later.

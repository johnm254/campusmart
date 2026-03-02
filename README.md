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

## Frontend configuration

The client talks to the API using a base URL defined in `src/lib/api.js`:

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Deploying the frontend

You can host the React app almost anywhere; two easy options are **Vercel** and
**Firebase Hosting**. Either service can pull this GitHub repository directly and
build the project for you.

#### Vercel (recommended for simplicity)

1. Visit https://vercel.com and sign in with your GitHub account.
2. Click "New Project", then select the `johnm254/campusmart` repository.
3. When prompted for configuration:
   - Set the **Root Directory** to `frontend`.
   - Ensure the **Build Command** is `npm run build`.
   - Set the **Output Directory** to `dist` (Vite's default).
4. Add an environment variable `VITE_API_URL` pointing at
   `https://campusmart-production-f264.up.railway.app/api` (your backend URL).
5. Deploy the project. Vercel will build and publish a URL such as
   `https://campusmart.vercel.app`.

> You can also add a custom domain later in the Vercel dashboard.

#### Firebase Hosting

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Initialize in the `frontend` folder:
   ```bash
   cd frontend
   firebase init hosting
   ```
   - Select your Firebase project (create one if needed).
   - Choose `dist` as the public directory and enable single‑page app
     rewrites.
3. Add the API URL as an environment configuration or directly in
   `.env.production`:
   ```env
   VITE_API_URL=https://campusmart-production-f264.up.railway.app/api
   ```
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
5. The CLI will print the hosting URL where your frontend is live.

Both hosts support automatic redeploys on GitHub pushes.

---


When you build or run the frontend you can override this with an environment
variable. Create a `.env` (or `.env.development`/`.env.production`) file in the
`frontend/` directory containing:

```env
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

Replace the URL above with the **actual** domain Railway provided for your
backend. After restarting the development server or rebuilding, the client will
make requests to the deployed API instead of localhost.

If you host the front‑end somewhere (Netlify, Vercel, etc.), set the same
variable in that platform’s environment settings.

### CORS and frontend origin

The backend uses the `FRONTEND_URL` environment variable to set CORS and
senders in emails. By default it defaults to `http://localhost:5173`. When you
point the front end to the hosted site, update `FRONTEND_URL` in your
backend’s environment variables accordingly (e.g. `https://campusmart.example.com`).

This lets authenticated operations (login/signup) work correctly and prevents
browser CORS errors.

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
5. Add the PostgreSQL plugin – this will provision a database and give you a set of
   Postgres-specific variables (DATABASE_URL, PGHOST, etc.).
   - **Important:** the database service and your `campusmart` service are separate; you
     must link them so the backend actually receives `DATABASE_URL`.
   - Go to the **campusmart** service → **Variables** tab and click **Add Variable** or
     use the **"Trying to connect a database? Add Variable"** prompt. Choose the
     `DATABASE_URL` (or the whole set) from the Postgres service. This creates a
     reference so the environment variable is injected into the backend container.
6. Set other secrets (e.g. `JWT_SECRET`, `SESSION_SECRET`, mail credentials) in the
   Railway variables panel for the `campusmart` service.
7. Trigger a deploy; the server will start on a Railway-provided URL. The startup logs
   should show a successful connection:
   ```
   Ensuring database schema is up to date...
   Database connection successful.
   ✅ Database schema verified.
   ```
   If you still see `ECONNREFUSED` connecting to `127.0.0.1` or `::1`, it means
   `DATABASE_URL` wasn't set – go back and link the Postgres variable.

> 📝 The frontend is *not* required for the backend to function, so you don't need to build or
> deploy it when working with Railway. You may keep it in the repo or remove it later.

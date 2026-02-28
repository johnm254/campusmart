# 🚀 CampusMart Firebase Deployment Guide

Complete guide to deploy CampusMart to Firebase (Hosting + Functions + Firestore).

---

## 📋 What You'll Get

- ✅ **Frontend**: Hosted on Firebase Hosting (Global CDN, Free SSL)
- ✅ **Backend**: Running on Firebase Functions (Serverless API)
- ✅ **Database**: Firestore (NoSQL, Real-time, Free tier)
- ✅ **Custom Domain**: campusmart.co.ke with automatic SSL
- ✅ **Free Tier**: Generous limits for small-medium apps

---

## 🎯 Quick Start (3 Steps)

### Option A: Automated Setup (Recommended)

```bash
# Run this script - it does everything!
FIREBASE_QUICK_START.bat
```

Then deploy:
```bash
DEPLOY_FIREBASE.bat
```

### Option B: Manual Setup

Follow the detailed steps below.

---

## 📦 Prerequisites

1. **Node.js** installed (v18 or higher)
2. **Google Account** for Firebase
3. **Firebase Project** created at [console.firebase.google.com](https://console.firebase.google.com)

---

## 🔧 Step-by-Step Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### Step 2: Login to Firebase

```bash
firebase login
```

This opens your browser. Login with your Google account.

### Step 3: Create Firebase Project

**Option A: Use Firebase Console (Easier)**
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add project"
3. Project name: `campusmart` (or `campusmart-ke`)
4. Enable Google Analytics (optional)
5. Click "Create project"

**Option B: Use CLI**
```bash
firebase projects:create campusmart
```

### Step 4: Link Project to Your Code

```bash
firebase use --add
```

Select your project from the list. This updates `.firebaserc`.

### Step 5: Enable Firestore

1. Go to Firebase Console → Your Project
2. Click "Firestore Database" in left menu
3. Click "Create database"
4. Choose "Start in production mode"
5. Select location (closest to Kenya: `europe-west1` or `asia-south1`)
6. Click "Enable"

### Step 6: Install Dependencies

```bash
# Install functions dependencies
cd functions
npm install
cd ..

# Frontend dependencies should already be installed
cd frontend
npm install
cd ..
```

### Step 7: Build Frontend

```bash
cd frontend
npm run build
cd ..
```

This creates `frontend/dist/` with production files.

### Step 8: Deploy to Firebase

```bash
firebase deploy
```

Or deploy specific parts:
```bash
# Deploy only hosting (frontend)
firebase deploy --only hosting

# Deploy only functions (backend)
firebase deploy --only functions

# Deploy only firestore rules
firebase deploy --only firestore:rules
```

---

## 🌐 Configure Custom Domain

### Step 1: Add Domain in Firebase

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter: `campusmart.co.ke`
4. Click "Continue"

### Step 2: Update DNS Records

Firebase will show you DNS records to add. Go to your domain registrar and add:

```
Type: A
Name: @
Value: [IP addresses provided by Firebase]

Type: A  
Name: www
Value: [IP addresses provided by Firebase]
```

### Step 3: Wait for SSL Certificate

Firebase automatically provisions SSL certificate. This takes 24-48 hours.

### Step 4: Update Environment Variables

Once domain is active, update `frontend/.env.firebase`:

```env
VITE_API_URL=https://campusmart.co.ke/api
```

Rebuild and redeploy:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## 🔐 Environment Variables for Firebase Functions

Firebase Functions don't use `.env` files in production. Set environment variables using:

```bash
firebase functions:config:set \
  jwt.secret="4103d60b75eab57a978e723abdafcf225f2d4dd976096775bbf0277aa3006b4d" \
  admin.secret="CAMPUS_ADMIN_2026" \
  email.user="campusmart.care@gmail.com" \
  email.pass="fsvxonkflqarwttc" \
  mpesa.consumer_key="3Xfs6RRFsouWvnwy15ocw5x5CYxCaQLzZSYCn4Iyi3Hc8na3" \
  mpesa.consumer_secret="19MbuDEDYGDMfaWQkmAB1sGstF7GwYefPkJ6oGM6OJd5k2OQCgdiZMFBMRBOQINw" \
  mpesa.shortcode="174379" \
  mpesa.passkey="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
```

Then redeploy functions:
```bash
firebase deploy --only functions
```

---

## 🧪 Testing Locally

### Test Frontend Locally

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

### Test Functions Locally

```bash
firebase emulators:start
```

This starts:
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Hosting: http://localhost:5000

---

## 📊 Firebase Free Tier Limits

### Hosting
- ✅ 10 GB storage
- ✅ 360 MB/day transfer
- ✅ Free SSL certificate
- ✅ Global CDN

### Functions
- ✅ 2,000,000 invocations/month
- ✅ 400,000 GB-seconds compute time
- ✅ 200,000 CPU-seconds
- ✅ 5 GB network egress

### Firestore
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage

**For most small-medium apps, this is FREE!**

---

## 🔄 Database Migration (MySQL → Firestore)

Your current app uses MySQL. Firebase uses Firestore (NoSQL). You have 3 options:

### Option 1: Use Firestore (Recommended)

**Pros:**
- Free tier
- No server management
- Real-time updates
- Auto-scaling

**Cons:**
- Need to migrate data
- Different query syntax

**Migration Steps:**
1. Export data from MySQL
2. Transform to Firestore format
3. Import using Firebase Admin SDK
4. Update queries in backend code

### Option 2: Use Cloud SQL (MySQL)

**Pros:**
- Keep existing MySQL database
- No code changes
- Familiar SQL syntax

**Cons:**
- Costs ~$10-50/month
- Need to manage database
- More complex setup

**Setup:**
1. Create Cloud SQL instance
2. Import MySQL data
3. Connect Functions to Cloud SQL
4. Update connection credentials

### Option 3: Hybrid (Firestore + Keep HostPinnacle MySQL)

**Pros:**
- Easiest migration
- Frontend on Firebase (fast CDN)
- Backend stays on HostPinnacle

**Cons:**
- Managing two platforms
- Backend not serverless

**Setup:**
1. Deploy frontend to Firebase Hosting
2. Keep backend on HostPinnacle
3. Update `VITE_API_URL` to point to HostPinnacle

---

## 🐛 Troubleshooting

### Error: "Firebase CLI not found"

```bash
npm install -g firebase-tools
```

### Error: "Not logged in"

```bash
firebase login
```

### Error: "No project selected"

```bash
firebase use --add
```

### Error: "Functions deployment failed"

Check:
1. Node.js version (must be 18)
2. Dependencies installed in `functions/`
3. No syntax errors in `functions/index.js`

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Error: "Hosting deployment failed"

Check:
1. Frontend built successfully
2. `frontend/dist/` folder exists
3. `firebase.json` has correct public directory

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Error: "Firestore permission denied"

Check:
1. Firestore rules deployed
2. User authenticated
3. Rules allow the operation

```bash
firebase deploy --only firestore:rules
```

---

## 📱 Post-Deployment Checklist

- [ ] Frontend loads at Firebase URL
- [ ] API responds at `/api` endpoint
- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Can create new products
- [ ] Messages work
- [ ] Admin panel accessible
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All images load
- [ ] Mobile responsive

---

## 🔗 Useful Commands

```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# View logs
firebase functions:log

# Open Firebase console
firebase open

# List projects
firebase projects:list

# Switch project
firebase use <project-id>

# Run local emulators
firebase emulators:start

# Check deployment status
firebase hosting:channel:list
```

---

## 💰 Cost Estimate

For a small-medium campus marketplace:

**Free Tier (Likely sufficient):**
- Hosting: FREE (within limits)
- Functions: FREE (within limits)
- Firestore: FREE (within limits)

**If you exceed free tier:**
- Hosting: ~$1-5/month
- Functions: ~$5-20/month
- Firestore: ~$5-15/month

**Total: $0-40/month** (vs HostPinnacle hosting cost)

---

## 🎉 Success!

Once deployed, your app will be available at:

- **Firebase URL**: `https://campusmart.web.app`
- **Custom Domain**: `https://campusmart.co.ke` (after DNS setup)

Your backend API will be at:
- `https://campusmart.co.ke/api`

---

## 📞 Support

- Firebase Docs: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com
- Firebase Status: https://status.firebase.google.com

---

## 🚀 Next Steps

1. Run `FIREBASE_QUICK_START.bat` to set up
2. Run `DEPLOY_FIREBASE.bat` to deploy
3. Configure custom domain
4. Test all features
5. Monitor usage in Firebase Console

**Good luck with your deployment! 🎊**

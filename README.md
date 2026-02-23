<<<<<<< HEAD
# 🎓 CampusMart — JKUAT Student Marketplace

> **The #1 student trading platform at JKUAT.** Buy and sell textbooks, electronics, hostel essentials, clothes and more at comrade prices — safely, fast, and exclusively for JKUAT students.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Frontend — Pages](#-frontend--pages)
5. [Frontend — Components](#-frontend--components)
6. [Frontend — State Management](#-frontend--state-management)
7. [Frontend — API Client](#-frontend--api-client)
8. [Backend — Server](#-backend--server)
9. [Backend — Database](#-backend--database)
10. [Backend — API Routes](#-backend--api-routes)
11. [Key Features](#-key-features)
12. [Environment Variables](#-environment-variables)
13. [Running the Project](#-running-the-project)
14. [PWA — Installable App](#-pwa--installable-app)
15. [SEO Configuration](#-seo-configuration)
16. [Database Scripts](#-database-scripts)
17. [Security](#-security)

---

## 🌍 Project Overview

CampusMart is a **full-stack Progressive Web Application (PWA)** built for JKUAT students. It enables peer-to-peer trading within the campus community. The platform includes a marketplace for listings, a community feed for student discussions, real-time messaging between buyers and sellers, a boost/premium system for featured listings, M-Pesa payment integration, and a full admin panel.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework (via Vite) |
| **Vite** | Dev server & build tool |
| **Lucide React** | Icon library |
| **Vanilla CSS** | All styling — no Tailwind |
| **React Context API** | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **PostgreSQL** | Relational database |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email delivery (Gmail SMTP) |
| **Multer / Base64** | Image uploads (stored as Base64 in DB) |
| **Axios** | HTTP client for M-Pesa integration |

### Integrations
| Service | Purpose |
|---|---|
| **Safaricom Daraja API** | M-Pesa STK Push payments |
| **Gmail SMTP** | Password reset & notification emails |
| **Google Fonts** | Roboto font |

---

## 📁 Project Structure

```
campus-mart/
│
├── index.html                  # Entry point — SEO, PWA, favicon tags
├── vite.config.js              # Vite configuration
├── package.json                # Frontend dependencies
│
├── public/
│   ├── logo.png                # App logo / favicon
│   ├── hero section.png        # Hero image for home page
│   ├── comrade power.png       # Boost package image
│   ├── manifest.json           # PWA web manifest
│   └── sw.js                   # Service Worker (network-first caching)
│
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # App shell, routing, modal orchestration
│   ├── AppContext.jsx          # Global state provider (user, wishlist, etc.)
│   ├── index.css               # Global stylesheet
│   │
│   ├── hooks/
│   │   └── useMediaQuery.js    # Custom hook for responsive breakpoints
│   │
│   ├── lib/
│   │   ├── api.js              # Frontend HTTP client (all API calls)
│   │   └── supabase.js         # Legacy Supabase client (no longer primary)
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
100: │   │   ├── Marketplace.jsx     # Product listing & filter page
│   │   ├── Community.jsx       # Student community feed
│   │   ├── Messages.jsx        # Real-time inbox & chat
│   │   ├── Dashboard.jsx       # Seller/buyer personal dashboard
│   │   ├── Wishlist.jsx        # Saved items
│   │   ├── Settings.jsx        # Account settings & profile
│   │   ├── Admin.jsx           # Admin panel (protected)
│   │   └── ResetPassword.jsx   # Password reset via token link
│   │
│   └── components/
│       ├── layout/
│       │   ├── Navbar.jsx      # Top navigation bar (responsive)
│       │   └── Footer.jsx      # Site footer
│       │
│       ├── home/
│       │   ├── Hero.jsx        # Homepage hero section
│       │   ├── CategoryGrid.jsx    # Browsable category buttons
│       │   ├── WhyCampusMart.jsx   # Feature highlights section
│       │   └── SafetyGuide.jsx     # Safety tips section
│       │
│       ├── marketplace/
│       │   ├── ProductCard.jsx     # Individual listing card
│       │   ├── ProductFilters.jsx  # Category/price/search filters
│       │   └── (other marketplace components)
│       │
│       ├── modals/
│       │   ├── AuthModal.jsx           # Login & Registration
│       │   ├── SellModal.jsx           # Create/Edit listing form
│       │   ├── PremiumModal.jsx        # Boost/Premium purchase
│       │   ├── ProductDetailModal.jsx  # Full product view + buy/message
│       │   ├── UserReviewModal.jsx     # Star rating & review form
│       │   └── InfoModal.jsx           # Reusable info popup
│       │
│       ├── feedback/
│       │   └── Feedback.jsx        # User feedback/rating form (floating)
│       │
│       ├── support/
│       │   └── Chatbot.jsx         # "Martie" AI help chatbot (floating)
│       │
│       └── ui/
│           ├── NotificationContainer.jsx   # Toast notification stack
│           └── DownloadPrompt.jsx          # PWA install prompt
│
└── server/
    ├── index.js            # Main Express server — all routes
    ├── db.js               # PostgreSQL connection pool
    ├── mpesa.js            # M-Pesa STK Push integration
    ├── init_db.js          # Database initialisation script
    ├── enhance_admin.js    # Adds admin-specific schema columns
    ├── master_fix.js       # Schema repair / migration script
    ├── update_schema.js    # General schema updater
    └── [other scripts]     # Dev/diagnostic utility scripts
```

---

## 📄 Frontend — Pages

### `Home.jsx`
The landing page. Renders four components stacked vertically:
- `Hero` — main headline + CTA buttons
- `WhyCampusMart` — four feature cards
- `CategoryGrid` — browsable product categories
- `SafetyGuide` — trading safety tips

### `Marketplace.jsx`
The core shopping page. Features:
- Fetches all approved listings from the backend
- Filter toolbar (category, price range, search)
- Responsive product grid using `ProductCard` components
- Click on any card opens `ProductDetailModal`

### `Community.jsx`
A social feed for JKUAT students. Supports:
- Create, view, and delete posts
- Three tabs: **All Activity**, **Marketplace**, **General**
- Admin posts are **pinned** at the top with a blue banner
- Like/react and comment on posts

### `Messages.jsx`
Full real-time messaging system. Features:
- Inbox showing all conversations with last message preview
- Per-conversation chat thread
- Sends messages to sellers directly from product modal
- Polls for new messages every 5 seconds
- Unread badge on the navbar

### `Dashboard.jsx`
Personal seller/buyer hub. Includes:
- My active listings with edit/delete controls
- Sales stats and earnings overview
- Verification badge status
- Active boost status and expiry

### `Settings.jsx`
Account management. Allows:
- Update display name, phone number, hostel, and bio
- Change profile photo (with crop tool)
- Change email or password
- Delete account

### `Admin.jsx`
Protected admin-only panel. Features:
- **Overview** — key metrics (users, listings, revenue)
- **Users** — list all users, ban/unban, promote to admin
- **Listings** — approve/reject/delete listings
- **Transactions** — view all M-Pesa payments
- **Reviews** — moderate submitted reviews
- **Site Settings** — maintenance mode toggle, announcements
- **Activity Logs** — live feed of user actions

### `ResetPassword.jsx`
Handles password reset via email link. Reads `?token=` and `?email=` URL params and submits a new password to the server.

---

## 🧩 Frontend — Components

### `Navbar.jsx`
Fully responsive navigation bar:
- **Desktop**: full links (Discover, Marketplace, Community) + account dropdown + SELL button
- **Mobile**: hamburger menu → full slide-down panel with all navigation links
- Shows unread message badge on profile icon
- Profile dropdown: Dashboard, Messages, Wishlist, Settings, Sign Out

### `AuthModal.jsx`
Handles both **Login** and **Registration** in a single tabbed modal:
- Login with email + password → receives JWT token
- Registration with name, student ID, phone, hostel, email, password
- Password reset request link

### `SellModal.jsx`
Multi-step listing creation form with:
- Title, description, price, category, condition, hostel/location
- Up to 5 image uploads (Base64 encoded)
- Edit mode for updating existing listings

### `PremiumModal.jsx`
Boost/Premium purchase flow:
- **Starter Boost** (KSh 100) — 5× listing visibility
- **Power Boost** (KSh 250) — 10× listing visibility
- **Premium Verification** (KSh 480/month) — verified badge + 15× views
- Triggers M-Pesa STK Push on purchase

### `ProductDetailModal.jsx`
Full listing detail view:
- Multiple image gallery with navigation
- Seller profile, verification badge display
- "Message Seller" button → opens conversation in Messages
- Add to Wishlist toggle
- Report listing
- Review seller (if transaction exists)

### `Chatbot.jsx` — _Martie_
An embedded help chatbot floating above the Feedback button:
- 9 knowledge categories: Account, Listings, Buying, Payments, Safety, Policies, Tech Support, Promotions, Campus-Specific
- Smart keyword search across the full knowledge base
- Typing indicator animation
- Categorised quick-access buttons

### `Feedback.jsx`
A floating feedback button (bottom-right):
- Star rating (1–5)
- Text comment
- Submits to the backend feedback table
- Shows success confirmation

### `DownloadPrompt.jsx`
PWA installation prompt:
- **Android/Chrome**: native `beforeinstallprompt` → Install button
- **iOS Safari**: manual guide — "Tap Share → Add to Home Screen"
- Dismissed state saved to `sessionStorage`

---

## 🌐 Frontend — State Management

All global state lives in **`AppContext.jsx`** and is consumed via the `useApp()` hook.

| State | Type | Purpose |
|---|---|---|
| `user` | Object / null | Logged-in user data from JWT |
| `wishlist` | Array | Products saved by the user |
| `currentPage` | String | Active page (replaces React Router) |
| `activeCategory` | String | Selected filter category |
| `notifications` | Array | Active toast notifications |
| `unreadCount` | Number | Unread message count (polled every 10s) |
| `siteSettings` | Object | Maintenance mode, announcement banner |
| `isAuthModalOpen` | Boolean | Controls login/register modal |
| `isSellModalOpen` | Boolean | Controls sell/edit listing modal |
| `isPremiumModalOpen` | Boolean | Controls premium upgrade modal |
| `infoModal` | Object | Controls generic info modal |

### Key context methods:

| Method | Description |
|---|---|
| `addNotification(title, message, type)` | Show a toast notification for 3s |
| `toggleWishlist(product)` | Add/remove from wishlist (API-backed) |
| `logout()` | Clear session, redirect to home |
| `navigateWithFilter(page, category)` | Navigate + set category filter simultaneously |
| `showInfo(title, content)` | Open the generic info modal |

---

## 🔌 Frontend — API Client

`src/lib/api.js` wraps all backend calls. It reads the JWT from `localStorage` and attaches it as a Bearer token on every authenticated request.

### API groups:

| Group | Key Methods |
|---|---|
| **Auth** | `register`, `login`, `requestPasswordReset`, `resetPassword` |
| **Products** | `getProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `getMyListings` |
| **Wishlist** | `getWishlist`, `toggleWishlist` |
| **Messages** | `getConversations`, `getMessages`, `sendMessage`, `getUnreadCount` |
| **Community** | `getCommunityPosts`, `createCommunityPost`, `likePost`, `deletePost` |
| **Reviews** | `submitReview`, `getUserReviews` |
| **Feedback** | `submitFeedback` |
| **Boosts** | `purchaseBoost`, `initiateBoostPayment` |
| **Verification** | `purchasePremium`, `getVerificationStatus` |
| **Admin** | `getAdminStats`, `getAllUsers`, `banUser`, `approveProduct`, `getSiteSettings`, `updateSiteSettings`, `getActivityLogs`, `getTransactions` |
| **Settings** | `updateProfile`, `getPublicSettings` |

---

## 🖥 Backend — Server

The backend is a single Express.js application located in `server/index.js`.

### Middleware stack:
- `cors()` — allows requests from `http://localhost:5173`
- `express.json({ limit: '10mb' })` — accepts large Base64 image payloads
- `verifyToken` — JWT middleware for protected routes
- `verifyAdminToken` — checks `is_admin` flag or `x-admin-secret` header
- `logActivity` — writes user actions to the `activity_logs` table

---

## 🗄 Backend — Database

**Database:** PostgreSQL (`campus_mart`)  
**Connection:** via `pg` Pool (`server/db.js`)

### Tables:

| Table | Description |
|---|---|
| `users` | Student accounts — name, email, password hash, student ID, hostel, avatar, verification status, ban status, admin flag |
| `products` | Marketplace listings — title, description, price, images, category, condition, boost type/expiry, approval status |
| `wishlist` | User ↔ Product save relationships |
| `messages` | Chat messages between users, linked to a conversation |
| `conversations` | Buyer ↔ Seller conversation threads |
| `community_posts` | Student feed posts with like counts and category |
| `community_likes` | Tracks which user liked which post |
| `reviews` | Star ratings and comments between users |
| `feedback` | Platform feedback submissions |
| `password_resets` | Temporary tokens for email-based password reset |
| `transactions` | M-Pesa payment records for boosts/premium |
| `activity_logs` | Audit trail of all user actions |
| `site_settings` | Key-value store for admin-controlled settings |

---

## 🔗 Backend — API Routes

### Authentication
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| POST | `/api/auth/request-reset` | ❌ | Send password reset email |
| POST | `/api/auth/reset-password` | ❌ | Set new password via token |

### Products
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | ❌ | Get all approved products |
| POST | `/api/products` | ✅ | Create a listing |
| PUT | `/api/products/:id` | ✅ | Edit own listing |
| DELETE | `/api/products/:id` | ✅ | Delete own listing |
| GET | `/api/products/my` | ✅ | Get current user's listings |

### Wishlist
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/wishlist` | ✅ | Get user's saved products |
| POST | `/api/wishlist/:id` | ✅ | Toggle save/unsave |

### Messages
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/conversations` | ✅ | All user conversations |
| GET | `/api/messages/:conversationId` | ✅ | Messages in a thread |
| POST | `/api/messages` | ✅ | Send a message |
| GET | `/api/messages/unread-count` | ✅ | Unread badge count |

### Community
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/community` | ❌ | All posts (admin-pinned first) |
| POST | `/api/community` | ✅ | Create a post |
| POST | `/api/community/:id/like` | ✅ | Like/unlike a post |
| DELETE | `/api/community/:id` | ✅ | Delete own/admin post |

### Reviews & Feedback
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/reviews` | ✅ | Submit a star review |
| GET | `/api/reviews/:userId` | ❌ | Get reviews for a user |
| POST | `/api/feedback` | ✅ | Submit platform feedback |

### Payments (M-Pesa)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/mpesa/stkpush` | ✅ | Initiate M-Pesa STK Push |
| POST | `/api/mpesa/callback` | ❌ | Daraja payment callback |

### Admin (requires admin token)
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard metrics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id/ban` | Ban/unban a user |
| DELETE | `/api/admin/products/:id` | Force-delete any listing |
| PUT | `/api/admin/products/:id/approve` | Approve a listing |
| GET | `/api/admin/transactions` | All payment records |
| GET | `/api/admin/logs` | Activity audit log |
| GET | `/api/settings` | Get site settings |
| PUT | `/api/settings` | Update site settings |

---

## ⭐ Key Features

| Feature | Details |
|---|---|
| 🔐 **JWT Authentication** | Secure login, 24h token expiry, ban check on every request |
| 📦 **Marketplace** | Post, edit, delete listings with multi-image upload |
| 💬 **Real-time Messaging** | Conversation threads, unread badge, 5s polling |
| 👥 **Community Feed** | Posts, likes, comments, admin-pinned announcements |
| 🚀 **Listing Boosts** | Starter (5×) and Power (10×) visibility boosts via M-Pesa |
| ✅ **Premium Verification** | KSh 480/month badge + 15× listing views |
| 💳 **M-Pesa STK Push** | Real Safaricom Daraja API integration |
| 📊 **Admin Panel** | Full platform management + analytics |
| 🤖 **Chatbot (Martie)** | 9-category help assistant with keyword search |
| 📱 **PWA** | Installable app on Android, iOS, and desktop |
| 🌐 **SEO Optimised** | Open Graph, Twitter Card, JSON-LD structured data |
| 📐 **Fully Responsive** | All features scale from 360px phone to 4K desktop |
| 📧 **Email Notifications** | Password reset and account emails via Gmail SMTP |
| ⭐ **User Reviews** | Star ratings between buyers and sellers |

---

## 🔑 Environment Variables

Create `server/.env`:

```env
# Server
PORT=5000

# PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=campus_mart
DB_PORT=5432

# JWT
JWT_SECRET=your_secret_key

# CORS (Frontend origin)
FRONTEND_URL=http://localhost:5173

# Email (Gmail SMTP)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# M-Pesa (Safaricom Daraja API)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
```

> ⚠️ **Never commit `.env` to GitHub.** Add it to `.gitignore`.

---

## 🚀 Running the Project

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v14+ running locally
- A Gmail account with **App Password** enabled

### 1. Set up the database

```bash
cd server
node init_db.js        # Creates all tables
node enhance_admin.js  # Adds admin-specific columns
node master_fix.js     # Applies any schema patches
```

### 2. Start the backend server

```bash
cd server
node index.js
# Running on http://localhost:5000
```

### 3. Start the frontend

```bash
# From project root
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 📱 PWA — Installable App

CampusMart is a full **Progressive Web App** (PWA):

- **`public/manifest.json`** — declares app name, icons, theme colour, `standalone` display mode
- **`public/sw.js`** — Service Worker with **network-first** strategy:
  - `/api/*` requests always go live to the server (never cached)
  - Static assets are cached and served offline as a fallback
- **`DownloadPrompt.jsx`** — smart install banner:
  - Android/Chrome: triggers native browser install dialog
  - iOS Safari: shows "Share → Add to Home Screen" instructions

---

## 🔍 SEO Configuration

All SEO tags live in `index.html`:

| Tag Group | Coverage |
|---|---|
| **Primary Meta** | Title, description, keywords, robots, canonical URL |
| **Open Graph** | Rich previews on WhatsApp, Facebook, LinkedIn |
| **Twitter Card** | Large image card on Twitter/X |
| **Favicon** | 16×16, 32×32, 180×180 Apple touch icon |
| **JSON-LD (Schema.org)** | `WebSite` schema with Search Action, `Organization` schema |
| **PWA Meta** | Theme colour, Apple mobile web app tags |

---

## 📜 Database Scripts

Located in `server/` — run only once or when fixing schema issues:

| Script | Purpose |
|---|---|
| `init_db.js` | Initial database and table creation |
| `enhance_admin.js` | Adds `is_approved`, transactions table, admin columns |
| `master_fix.js` | Catches and repairs common schema inconsistencies |
| `update_schema.js` | General schema migration script |
| `update_community.js` | Adds community post columns |
| `update_premium.js` | Adds premium verification columns |
| `add_user_reviews.js` | Creates the reviews table |
| `cleanup_data.js` | Removes test/orphaned data |
| `check_feedback_db.js` | Verifies feedback table exists |
| `check_users.js` | Diagnostic: lists all users |
| `test_db_conn.js` | Tests PostgreSQL connection |

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| **Password hashing** | `bcryptjs` with salt rounds |
| **JWT authentication** | 24-hour expiry, signed with `JWT_SECRET` |
| **Admin access** | Dual-layer: `is_admin` DB flag **OR** `x-admin-secret` header |
| **Ban enforcement** | Every authenticated request checks `is_banned` in the DB |
| **Input validation** | Server-side checks on all POST/PUT routes |
| **CORS** | Restricted to `FRONTEND_URL` origin |
| **Payload limits** | `10mb` limit on requests to support Base64 images |

---

## 👨‍💻 Authors

Built with ❤️ for the JKUAT student community.

---

*Last updated: February 2026*
=======
# CampusMart

Student marketplace and accommodation platform.

## Project Structure

```
campus-mart/
├── frontend/     # React application - See frontend/README.md
└── backend/      # Node.js API server - See backend/SETUP.md
```

## Quick Start

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

## Documentation

- **Frontend Setup**: See `frontend/README.md`
- **Backend Setup**: See `backend/SETUP.md`
- **Security**: See `backend/SECURITY.md`
- **Deployment**: See `backend/DEPLOYMENT.md`

## Access

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
>>>>>>> 38582d5 (Initial commit: CampusMart platform)

# CampusMart - HostPinnacle Deployment Guide

## 🎯 Quick Start (One Command)

**Right-click and "Run as administrator":**
```
COMPLETE_SETUP.bat
```

This will automatically:
- ✅ Install mysql2 package
- ✅ Test database connection
- ✅ Create all tables
- ✅ Start the backend server

---

## 📋 Database Configuration

All database settings are **already configured** in `backend/.env`:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=ricoanco_campusmart
DB_PASS=911Hamisi.
DB_NAME=ricoanco_campusmart
DB_PORT=3306
```

**Domain:** https://campusmart.co.ke

---

## 🚀 Deployment Steps

### Option 1: Automated (Recommended)

1. **Run Complete Setup:**
   ```
   Right-click: COMPLETE_SETUP.bat
   Select: "Run as administrator"
   ```

### Option 2: Step-by-Step

1. **Install MySQL2:**
   ```
   Right-click: INSTALL_MYSQL2.bat → Run as administrator
   ```

2. **Test Connection:**
   ```
   Right-click: TEST_MYSQL_CONNECTION.bat → Run as administrator
   ```

3. **Deploy:**
   ```
   Right-click: DEPLOY_TO_HOSTPINNACLE.bat → Run as administrator
   ```

---

## 📁 Files to Upload to HostPinnacle

### Backend Files (upload to server root or backend folder)
```
backend/
├── .env (MySQL configured)
├── index.js
├── db.js
├── init-database-mysql.js
├── package.json
├── package-lock.json
└── node_modules/ (or run npm install on server)
```

### Frontend Files (upload to public_html)
```
frontend/dist/
├── index.html
├── assets/
├── .htaccess
└── [all other files]
```

---

## ✅ What's Been Fixed

### 1. Database Credentials
- ❌ Old: `ricoanco_user_campusmart`
- ✅ New: `ricoanco_campusmart`

### 2. Database Type
- ❌ Old: PostgreSQL
- ✅ New: MySQL with `DB_TYPE=mysql`

### 3. MySQL Support
- ✅ `backend/db.js` has MySQL abstraction layer
- ✅ Auto-translates PostgreSQL queries to MySQL
- ✅ Handles data type differences automatically

### 4. Deployment Scripts
- ✅ `COMPLETE_SETUP.bat` - One-click setup
- ✅ `INSTALL_MYSQL2.bat` - Install dependencies
- ✅ `TEST_MYSQL_CONNECTION.bat` - Verify connection
- ✅ `DEPLOY_TO_HOSTPINNACLE.bat` - Initialize & start

---

## 🔧 Troubleshooting

### "Cannot find module 'mysql2'"
**Solution:** Run `INSTALL_MYSQL2.bat` as administrator

### "npm cannot be loaded" (PowerShell error)
**Solution:** Use Command Prompt (CMD) or run batch files as administrator

### "password authentication failed"
**Solution:** Credentials are now correct. Verify database exists on HostPinnacle.

### Backend won't start
**Solution:** 
1. Check if port 5000 is available
2. Ensure all packages installed: `cd backend && npm install`

---

## 📊 Database Schema

The following tables will be created automatically:

- `users` - User accounts and profiles
- `products` - Marketplace listings
- `messages` - User messaging
- `wishlist` - Saved items
- `user_reviews` - User ratings and reviews
- `community_posts` - Community content
- `post_likes` - Post engagement
- `post_comments` - Post comments
- `transactions` - Payment records
- `activity_logs` - User activity tracking
- `password_resets` - Password reset tokens
- `site_settings` - Application settings

---

## 🌐 API Endpoints

Once deployed, your API will be available at:
```
https://campusmart.co.ke/api
```

Backend runs on port 5000:
```
http://localhost:5000/api
```

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=ricoanco_campusmart
DB_PASS=911Hamisi.
DB_NAME=ricoanco_campusmart
DB_PORT=3306
JWT_SECRET=4103d60b75eab57a978e723abdafcf225f2d4dd976096775bbf0277aa3006b4d
ADMIN_SECRET=CAMPUS_ADMIN_2026
FRONTEND_URL=https://campusmart.co.ke
EMAIL_USER=campusmart.care@gmail.com
EMAIL_PASS=fsvxonkflqarwttc
```

### Frontend (.env.production)
```env
VITE_API_URL=https://campusmart.co.ke/api
VITE_SITE_URL=https://campusmart.co.ke
```

---

## 🎉 Success Checklist

- [ ] mysql2 package installed
- [ ] Database connection tested successfully
- [ ] All tables created
- [ ] Backend server running on port 5000
- [ ] Frontend files uploaded to public_html
- [ ] Site accessible at https://campusmart.co.ke

---

## 📞 Support

If you encounter issues:
1. Check `SETUP_INSTRUCTIONS.txt` for detailed steps
2. Review `HOSTPINNACLE_SETUP.txt` for configuration details
3. Contact HostPinnacle support for server-specific issues

---

## 🔐 Security Notes

- JWT secret is pre-generated (64 characters)
- Admin secret: `CAMPUS_ADMIN_2026`
- Database password: `911Hamisi.`
- All credentials are configured in `.env` files

---

**Ready to deploy!** Just run `COMPLETE_SETUP.bat` and you're good to go! 🚀

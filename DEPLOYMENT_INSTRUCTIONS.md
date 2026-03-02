# 🚀 CampusMart - HostPinnacle Deployment

## 📦 Package Contents

You have two deployment packages:

1. **campusmart-backend-hostpinnacle.zip** - Backend API (Node.js)
2. **campusmart-frontend-hostpinnacle.zip** - Frontend UI (React)

---

## 🔧 BACKEND DEPLOYMENT

### Step 1: Setup MySQL Database
1. Login to cPanel
2. Go to "MySQL Databases"
3. Create database: `campusmart_db`
4. Create user: `campusmart_user` (with strong password)
5. Add user to database with ALL PRIVILEGES
6. Note your credentials (they'll be prefixed with your username)

### Step 2: Upload Backend
1. Extract `campusmart-backend-hostpinnacle.zip`
2. Upload all files to: `public_html/api/`
3. Edit `.env` file with your MySQL credentials:
   ```
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_USER=yourusername_campusmart_user
   DB_PASS=your_password_here
   DB_NAME=yourusername_campusmart_db
   DB_PORT=3306
   ```

### Step 3: Install Dependencies
In cPanel Terminal:
```bash
cd public_html/api
npm install --production
```

### Step 4: Initialize Database
```bash
node init-database-mysql.js
```

### Step 5: Setup Node.js App
1. In cPanel, find "Setup Node.js App"
2. Create Application:
   - Node version: 18.x or higher
   - Application mode: Production
   - Application root: `api`
   - Application URL: `campusmart.co.ke/api`
   - Startup file: `index.js`
3. Click "Create"

### Step 6: Test Backend
Visit: `https://campusmart.co.ke/api/`

Should return:
```json
{
  "status": "Online",
  "message": "CampusMart API is running perfectly!"
}
```

---

## 🎨 FRONTEND DEPLOYMENT

### Step 1: Upload Frontend
1. Extract `campusmart-frontend-hostpinnacle.zip`
2. Upload ALL files to: `public_html/`

Your structure should be:
```
public_html/
├── index.html
├── assets/
├── .htaccess
├── public/
└── api/ (backend folder)
```

### Step 2: Verify .htaccess
Ensure `.htaccess` exists in `public_html/` for React routing

### Step 3: Test Frontend
Visit: `https://campusmart.co.ke`

---

## ✅ VERIFICATION

1. Frontend loads at: `https://campusmart.co.ke`
2. Backend API responds at: `https://campusmart.co.ke/api/`
3. Test signup/login functionality
4. Check that products load correctly

---

## 🆘 TROUBLESHOOTING

**500 Error**: Check error logs in cPanel  
**Database Error**: Verify credentials in `.env`  
**CORS Issues**: Ensure FRONTEND_URL is correct in backend `.env`  
**Blank Page**: Check browser console for errors  
**404 on Refresh**: Ensure `.htaccess` is uploaded

---

## 📞 SUPPORT

For issues, check the README files included in each package.

**Backend**: See `README_HOSTPINNACLE.md` in backend package  
**Frontend**: See `README_HOSTPINNACLE.md` in frontend package

---

## 🎉 DONE!

Your CampusMart platform is now live on HostPinnacle!

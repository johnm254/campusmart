# 🚀 CampusMart Backend - HostPinnacle Deployment

## Quick Setup Guide

### 1. Database Setup (MySQL)
1. Login to cPanel
2. Go to "MySQL Databases"
3. Create database: `campusmart_db`
4. Create user: `campusmart_user` with strong password
5. Add user to database with ALL PRIVILEGES
6. Note: Your actual names will be prefixed (e.g., `yourusername_campusmart_db`)

### 2. Configure Environment
Edit `.env` file with your actual credentials:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=yourusername_campusmart_user
DB_PASS=your_actual_password
DB_NAME=yourusername_campusmart_db
DB_PORT=3306
PORT=3000
JWT_SECRET=campus_mart_super_secure_secret_2026_x09a2b
FRONTEND_URL=https://campusmart.co.ke
ADMIN_SECRET=CAMPUS_ADMIN_2026
```

### 3. Upload Files
Upload all backend files to: `public_html/api/`

### 4. Install Dependencies
In cPanel Terminal:
```bash
cd public_html/api
npm install --production
```

### 5. Initialize Database
```bash
node init-database-mysql.js
```

### 6. Setup Node.js App (cPanel)
1. Find "Setup Node.js App" in cPanel
2. Create Application:
   - Node version: 18.x or higher
   - Application mode: Production
   - Application root: `api`
   - Application URL: `campusmart.co.ke/api`
   - Startup file: `index.js`
3. Click "Create"

### 7. Test
Visit: `https://campusmart.co.ke/api/`

Should return:
```json
{
  "status": "Online",
  "message": "CampusMart API is running perfectly!",
  "version": "2.5.0",
  "database": "Connected"
}
```

## Troubleshooting
- **500 Error**: Check error logs in cPanel
- **Database Error**: Verify credentials in `.env`
- **CORS Issues**: Ensure FRONTEND_URL is correct

## Support
Contact: support@campusmart.co.ke

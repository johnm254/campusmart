# 🎯 CampusMart - Admin Dashboard Complete Setup

## ✅ Everything is Ready!

Your admin dashboard is now fully configured with:
- ✅ Activity logging system
- ✅ Real-time statistics
- ✅ Supabase database integration
- ✅ Enhanced activity tracking
- ✅ Color-coded activity types

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Supabase

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com)
2. **Create New Project**: Name it "CampusMart"
3. **Run Database Schema**:
   - Open Supabase Dashboard → SQL Editor
   - Copy ALL contents from `supabase_schema.sql`
   - Paste and click **RUN**
4. **Get API Keys**:
   - Go to Project Settings → API
   - Copy `Project URL` and `anon public` key

### Step 2: Update Configuration

**Option A: Edit `.env` file**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**Option B: Edit `index.html` (line ~1894)**
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';
```

### Step 3: Start the Server

**Windows:**
```bash
setup.bat
```

**Or manually:**
```bash
npm start
```

---

## 📊 Admin Dashboard Features

### 1. **Real-Time Statistics**
- Total registered users
- Total product listings  
- Total activities tracked

### 2. **Activity Monitoring**
Tracks these actions:
- 🟢 **login** - User logins
- 🟠 **logout** - User logouts
- 🔵 **view_product** - Product views
- 🟣 **create_listing** - New listings
- 🔷 **start_chat** - Chat initiations

### 3. **Activity Log Table**
Shows:
- User email
- Action type (color-coded)
- Timestamp
- Last 50 activities

### 4. **Database Integration**
- Saves to Supabase `activity_logs` table
- Fetches real user/listing counts
- Displays live data

---

## 🔑 How to Access Admin Panel

1. **Open**: http://localhost:3000
2. **Login**: Click "Sign in" → Use Quick Login
3. **Enter any email**: e.g., `admin@campusmart.co.ke`
4. **Access Dashboard**: Click profile picture → **Admin Panel** (red option at top)

---

## 📁 Database Schema

### Tables Created:
```sql
profiles          -- User accounts
products          -- Listed items
messages          -- User messages
wishlists         -- Saved items
activity_logs     -- Admin tracking ⭐ NEW!
```

### Activity Logs Structure:
```sql
id              BIGINT (auto-increment)
user_id         UUID (references profiles)
user_email      TEXT (for quick admin reference)
activity_type   TEXT (login, view_product, etc.)
details         JSONB (additional context)
created_at      TIMESTAMP
```

---

## 🎨 Activity Color Codes

| Activity | Color | Hex |
|----------|-------|-----|
| login | Green | #4caf50 |
| logout | Orange | #ff9800 |
| view_product | Blue | #2196f3 |
| create_listing | Purple | #9c27b0 |
| start_chat | Cyan | #00bcd4 |

---

## 🧪 Testing the System

### Test Activity Logging:
```javascript
// These actions will appear in Admin Panel:
1. Login with Quick Login ✅
2. Browse marketplace ✅
3. Click on a product ✅
4. Create a new listing ✅
5. Logout ✅
```

### Verify Database Connection:
1. Perform any action (e.g., view product)
2. Check browser console (F12)
3. Look for: `✅ Activity logged to Supabase: view_product`
4. Go to Supabase → Table Editor → activity_logs
5. See your activity!

---

## 🔧 Troubleshooting

### "No activities logged yet"
**Cause**: No Supabase connection or no actions performed
**Fix**: 
1. Check Supabase credentials in `.env` and `index.html`
2. Perform some actions (login, view products)
3. Refresh Admin Panel

### Activities not saving to database
**Cause**: Supabase credentials missing
**Fix**:
1. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
2. Check browser console for errors
3. Ensure `activity_logs` table exists in Supabase

### Server won't start
**Fix**:
```bash
# Kill existing Node processes
taskkill /F /IM node.exe

# Reinstall dependencies
npm install

# Start again
npm start
```

---

## 📈 Advanced Features (Coming Soon)

- [ ] Export logs to CSV
- [ ] Filter by date range
- [ ] User activity charts
- [ ] Real-time updates (WebSocket)
- [ ] Admin role permissions
- [ ] Ban/suspend users
- [ ] Verify sellers

---

## 🔐 Security Recommendations

### For Production:
1. **Add Admin Role Check**:
```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
```

2. **Update Admin Panel Access**:
```javascript
if (page === 'admin') {
    if (!currentUser.is_admin) {
        alert('Access denied!');
        return;
    }
    renderAdminDashboard();
}
```

3. **Secure Activity Logs**:
```sql
CREATE POLICY "Only admins can view logs" 
ON activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);
```

---

## 📞 Support

### Common Issues:
- **Blank Admin Panel**: Check Supabase connection
- **Old data showing**: Clear browser cache (Ctrl+Shift+Delete)
- **Logs not updating**: Refresh page or check console for errors

### Files to Check:
- `.env` - Environment variables
- `index.html` (line 1894) - Supabase config
- `supabase_schema.sql` - Database schema
- Browser Console (F12) - Error messages

---

## ✨ Quick Reference

| Item | Location |
|------|----------|
| Admin Panel | Profile → Admin Panel |
| Database | [Supabase Dashboard](https://app.supabase.com) |
| Activity Logs | Supabase → Table Editor → activity_logs |
| Server | http://localhost:3000 |
| Setup Guide | ADMIN_SETUP_GUIDE.md |

---

**Built for JKUAT Comrades** 🎓  
**Version**: 2.0 with Admin Dashboard  
**Last Updated**: February 2026

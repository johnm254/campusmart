# 🚀 CampusMart Admin Dashboard - Complete Setup Guide

## ✅ Quick Start (5 Minutes)

### Step 1: Set Up Supabase Database

1. **Go to [Supabase](https://supabase.com)** and create a free account
2. **Create a new project**:
   - Project name: `CampusMart`
   - Database password: (choose a strong password)
   - Region: Choose closest to Kenya (e.g., Singapore or Frankfurt)
   
3. **Run the Database Schema**:
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the entire contents of `supabase_schema.sql`
   - Paste and click **RUN**
   
4. **Get Your API Keys**:
   - Go to **Project Settings** → **API**
   - Copy:
     - `Project URL` (looks like: https://xxxxx.supabase.co)
     - `anon public` key (long string starting with eyJ...)

### Step 2: Configure Environment Variables

1. Open the `.env` file in your project
2. Update the Supabase section:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Optional**: Configure email/WhatsApp (for production):
   - Gmail: Get App Password from Google Account Security
   - Twilio: Sign up at twilio.com for WhatsApp OTP

### Step 3: Update Frontend Configuration

1. Open `index.html`
2. Find line ~1894 (search for "SUPABASE_URL")
3. Replace with your credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 CampusMart server running on http://localhost:3000
📧 Email service: Ready
📱 WhatsApp service: Ready
```

### Step 5: Access Admin Dashboard

1. Open browser: `http://localhost:3000`
2. Click **Sign in** → Use **Quick Login**
3. Enter any email (e.g., `admin@campusmart.co.ke`)
4. Click your profile picture → **Admin Panel**

---

## 🎯 Admin Dashboard Features

### 1. **Real-Time Statistics**
- Total Users
- Total Listings
- Total Activities

### 2. **Activity Monitoring**
The dashboard tracks:
- User logins/logouts
- Product views
- New listings created
- Messages sent

### 3. **Activity Log Table**
Shows:
- User email
- Action type (login, view_product, create_listing, etc.)
- Timestamp

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Kill existing process
taskkill /F /IM node.exe

# Reinstall dependencies
npm install

# Start again
npm start
```

### Database Connection Issues
1. Check `.env` file has correct Supabase credentials
2. Verify `index.html` has same credentials (lines 1894-1895)
3. Check Supabase project is active (not paused)

### Admin Panel Not Showing
1. Make sure you're logged in (use Quick Login)
2. Click profile picture in top-right
3. Look for red "Admin Panel" option at top of menu

### Activities Not Logging
1. Check browser console (F12) for errors
2. Verify Supabase connection is working
3. Check `activity_logs` table exists in Supabase

---

## 📊 Database Schema Overview

### Tables Created:
1. **profiles** - User accounts
2. **products** - Listed items
3. **messages** - User messages
4. **wishlists** - Saved items
5. **activity_logs** - Admin tracking (NEW!)

---

## 🔐 Security Notes

### For Production:
1. **Never commit `.env` file** to Git
2. **Use Row Level Security** in Supabase
3. **Add admin role checking** (currently all logged-in users can access)
4. **Enable email verification** for real accounts
5. **Use environment variables** for all secrets

### Recommended Admin Role Setup:
```sql
-- Add admin column to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Update RLS policy for activity_logs
CREATE POLICY "Only admins can view activity logs" 
ON activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);
```

---

## 📱 Testing the System

### 1. Test Activity Logging:
1. Login with Quick Login
2. Browse marketplace
3. View a product
4. Create a new listing
5. Go to Admin Panel
6. See all activities logged

### 2. Test Database Integration:
1. Create a product
2. Check Supabase dashboard → Table Editor → products
3. Verify product appears

### 3. Test Real-Time Updates:
1. Open Admin Panel
2. In another tab, perform actions (view products, login)
3. Refresh Admin Panel
4. See new activities

---

## 🚀 Next Steps

1. **Add more activity types**:
   - Search queries
   - Filter usage
   - Wishlist additions
   - Message sends

2. **Create analytics charts**:
   - Daily active users
   - Popular categories
   - Peak usage times

3. **Export functionality**:
   - Download activity logs as CSV
   - Generate reports

4. **User management**:
   - Ban/suspend users
   - Verify sellers
   - Manage listings

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify all environment variables are set
4. Ensure Supabase project is active

---

## ✨ Quick Reference

**Admin Panel Access**: Profile Picture → Admin Panel
**Database**: Supabase Dashboard → Table Editor
**Logs**: Admin Panel → Recent Site Activities
**Server**: http://localhost:3000
**Supabase**: https://app.supabase.com

---

**Built for JKUAT Comrades** 🎓

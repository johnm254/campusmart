# 🗄️ Supabase Database Setup - Step-by-Step Walkthrough

## 📋 What You'll Do
1. Create a free Supabase account
2. Create a new project
3. Run the database schema
4. Get your API credentials
5. Connect to your CampusMart app

**Time Required**: 10-15 minutes

---

## Step 1: Create Supabase Account (2 minutes)

### 1.1 Go to Supabase
- Open your browser
- Navigate to: **https://supabase.com**
- Click the **"Start your project"** button

### 1.2 Sign Up
You can sign up using:
- **GitHub** (recommended - fastest)
- **Email** (requires verification)

**Tip**: Use GitHub for instant access!

---

## Step 2: Create Your Project (3 minutes)

### 2.1 Create New Organization (if first time)
- Click **"New organization"**
- Name: `CampusMart` or `JKUAT Projects`
- Click **"Create organization"**

### 2.2 Create New Project
Click **"New project"** and fill in:

**Project Name**: `campusmart`
- This is your project identifier
- Use lowercase, no spaces

**Database Password**: 
- Create a STRONG password
- **IMPORTANT**: Save this password somewhere safe!
- Example: `CampusMart2026!Secure`
- You'll need this to access the database

**Region**: Choose closest to Kenya
- **Recommended**: `Southeast Asia (Singapore)` - best for Kenya
- Alternative: `Europe (Frankfurt)`

**Pricing Plan**: 
- Select **"Free"** (perfect for development)
- Includes: 500MB database, 1GB file storage, 2GB bandwidth

### 2.3 Wait for Project Creation
- Takes 1-2 minutes
- You'll see a progress indicator
- Don't close the browser!

---

## Step 3: Run Database Schema (5 minutes)

### 3.1 Open SQL Editor
Once your project is ready:
1. Look at the left sidebar
2. Click on **"SQL Editor"** icon (looks like `</>`)
3. You'll see a blank SQL editor

### 3.2 Copy Your Schema
1. Go back to VS Code
2. Open file: `supabase_schema.sql`
3. Press `Ctrl+A` to select all
4. Press `Ctrl+C` to copy

### 3.3 Paste and Run
1. Return to Supabase SQL Editor
2. Press `Ctrl+V` to paste the entire schema
3. Click the **"RUN"** button (bottom right)
4. Wait for execution (5-10 seconds)

### 3.4 Verify Success
You should see:
```
Success. No rows returned
```

This means all tables were created successfully!

### 3.5 Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see these tables:
   - ✅ profiles
   - ✅ products
   - ✅ messages
   - ✅ wishlists
   - ✅ activity_logs

**If you see all 5 tables, you're good!** ✅

---

## Step 4: Get Your API Credentials (2 minutes)

### 4.1 Navigate to Settings
1. Click the **"Settings"** icon (gear icon) in left sidebar
2. Click **"API"** in the settings menu

### 4.2 Copy Your Credentials
You'll see two important values:

**Project URL**:
- Looks like: `https://abcdefghijklmnop.supabase.co`
- Click the **copy icon** next to it
- Save it somewhere (Notepad)

**anon public Key**:
- Long string starting with `eyJ...`
- Scroll down to find it under "Project API keys"
- Click the **copy icon** next to "anon public"
- Save it somewhere (Notepad)

**IMPORTANT**: Keep these credentials safe but accessible!

---

## Step 5: Connect to CampusMart (3 minutes)

### 5.1 Update .env File
1. In VS Code, open `.env` file
2. Find these lines:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

3. Replace with YOUR credentials:
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Save the file (`Ctrl+S`)

### 5.2 Update index.html
1. Open `index.html`
2. Press `Ctrl+F` to search
3. Search for: `SUPABASE_URL`
4. You'll find around line 1894:
```javascript
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
```

5. Replace with YOUR credentials:
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

6. Save the file (`Ctrl+S`)

---

## Step 6: Test the Connection (2 minutes)

### 6.1 Restart Server (if needed)
Your server should already be running, but if you want to restart:
```bash
# Press Ctrl+C in terminal to stop
# Then run:
npm start
```

### 6.2 Test in Browser
1. Open browser: **http://localhost:3000**
2. Click **"Sign in"**
3. Use **Quick Login**
4. Enter email: `test@jkuat.ac.ke`
5. Click **Quick Login** button

### 6.3 Verify Connection
Open browser console (Press `F12`):
- Look for: `✅ Activity logged to Supabase: login`
- If you see this, **CONNECTION SUCCESSFUL!** 🎉

### 6.4 Check Database
1. Go back to Supabase dashboard
2. Click **"Table Editor"**
3. Click **"activity_logs"** table
4. You should see your login activity!

---

## 🎯 Quick Verification Checklist

After setup, verify everything works:

- [ ] Supabase project created
- [ ] All 5 tables exist (profiles, products, messages, wishlists, activity_logs)
- [ ] API credentials copied
- [ ] `.env` file updated
- [ ] `index.html` updated
- [ ] Can login to CampusMart
- [ ] Console shows: `✅ Activity logged to Supabase`
- [ ] Activity appears in Supabase activity_logs table
- [ ] Admin Panel shows statistics

---

## 🐛 Troubleshooting

### "Failed to create project"
**Solution**: Try a different project name or wait a few minutes

### "SQL execution failed"
**Solution**: 
1. Make sure you copied the ENTIRE schema
2. Try running it again
3. Check for any error messages

### "Connection refused" or "Invalid API key"
**Solution**:
1. Double-check your credentials
2. Make sure there are no extra spaces
3. Verify the URL starts with `https://`
4. Verify the key starts with `eyJ`

### "No tables showing"
**Solution**:
1. Go to SQL Editor
2. Run this query: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
3. If empty, re-run the schema

### Activities not saving
**Solution**:
1. Check browser console for errors
2. Verify credentials are correct
3. Check Supabase project is not paused (free tier pauses after inactivity)

---

## 📊 What Each Table Does

| Table | Purpose |
|-------|---------|
| **profiles** | User accounts and authentication |
| **products** | Listed items in marketplace |
| **messages** | Chat messages between users |
| **wishlists** | Saved/favorited items |
| **activity_logs** | Admin dashboard tracking |

---

## 🔐 Security Notes

### Your Credentials Are Safe Because:
- `anon public` key is meant to be used in frontend
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Admin features need additional security (add later)

### For Production:
1. Enable email verification
2. Add admin role checking
3. Set up proper RLS policies
4. Use environment variables on server

---

## 🎉 Success!

Once you see activities in your Supabase dashboard, you're all set!

### Next Steps:
1. ✅ Test creating a product listing
2. ✅ Check it appears in Supabase products table
3. ✅ Access Admin Panel
4. ✅ See real-time statistics

---

## 📞 Need Help?

### Common Questions:

**Q: Is Supabase free forever?**
A: Yes! Free tier includes 500MB database, perfect for development.

**Q: Can I change my database password?**
A: Yes, in Project Settings → Database

**Q: What if I lose my API keys?**
A: You can always find them in Settings → API

**Q: Can I delete and recreate tables?**
A: Yes, but you'll lose all data. Better to modify existing tables.

---

## 🌟 Pro Tips

1. **Bookmark your Supabase dashboard** for quick access
2. **Save your credentials** in a password manager
3. **Use Table Editor** to view/edit data visually
4. **Check SQL Editor** for advanced queries
5. **Monitor usage** in Project Settings → Usage

---

**You're ready to go!** 🚀

Open http://localhost:3000 and start using your fully connected CampusMart with live database!

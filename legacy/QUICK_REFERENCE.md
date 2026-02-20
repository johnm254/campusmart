# 🎯 SUPABASE SETUP - QUICK REFERENCE CARD

## 📝 Copy This Schema to Supabase SQL Editor

**Location**: Your file `supabase_schema.sql` is already open in VS Code!

**Steps**:
1. Select ALL text in `supabase_schema.sql` (Ctrl+A)
2. Copy (Ctrl+C)
3. Go to Supabase → SQL Editor
4. Paste (Ctrl+V)
5. Click RUN

---

## 🔑 Your Credentials Template

After creating your Supabase project, fill this in:

```
PROJECT URL:
https://_________________________.supabase.co

ANON PUBLIC KEY:
eyJ_____________________________________________
```

---

## 📂 Where to Paste Credentials

### File 1: `.env` (Already open in VS Code!)

Find these lines and replace:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

With YOUR credentials:
```env
SUPABASE_URL=https://_________________________.supabase.co
SUPABASE_ANON_KEY=eyJ_____________________________________________
```

### File 2: `index.html` (Already open in VS Code!)

Press `Ctrl+F` and search for: `SUPABASE_URL`

You'll find around line 1894:
```javascript
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
```

Replace with YOUR credentials:
```javascript
const SUPABASE_URL = 'https://_________________________.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ_____________________________________________';
```

---

## ✅ Quick Verification

After setup, test with these commands in browser console (F12):

```javascript
// Check if Supabase is connected
console.log('Supabase connected:', supabase !== null);

// Check URL
console.log('URL:', SUPABASE_URL);
```

Should show:
```
Supabase connected: true
URL: https://your-project.supabase.co
```

---

## 🎯 What You're Creating

### Tables (5 total):
1. **profiles** - User accounts
2. **products** - Marketplace items
3. **messages** - User chats
4. **wishlists** - Saved items
5. **activity_logs** - Admin tracking

### Indexes (3 for speed):
- Activity logs by date
- Activity logs by user
- Activity logs by type

---

## 🚀 After Setup

1. ✅ Login to http://localhost:3000
2. ✅ Use Quick Login
3. ✅ Open Admin Panel
4. ✅ See your activities logged!

---

## 📞 Need Help?

**Full Guide**: `SUPABASE_SETUP_WALKTHROUGH.md`
**Visual Guide**: `SUPABASE_VISUAL_GUIDE.txt`
**Troubleshooting**: Check browser console (F12) for errors

---

**Supabase website is now opening in your browser!** 🚀

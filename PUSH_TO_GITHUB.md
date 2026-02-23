# Push to GitHub - Quick Guide

## Your GitHub Details ✅
- **Username:** AliHamisi911
- **Email:** gakwelihamisi5@gmail.com
- **Repository:** https://github.com/AliHamisi911/campusmart

## Before You Push - Security Check

Run this command to check for secrets:
```bash
node backend/check-secrets.js
```

If it says "✅ No secrets detected", you're good to go!

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `campusmart` (already created ✅)
3. Description: `Student marketplace and accommodation platform`
4. Choose **Public** or **Private**
5. **DO NOT** check "Add a README file"
6. Click "Create repository"

## Step 2: Push Your Code

```bash
# Check what will be committed
git status

# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: CampusMart platform"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Authentication

When you push, GitHub will ask for credentials:

**Username:** AliHamisi911

**Password:** Use a Personal Access Token (NOT your GitHub password)

### How to Get Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `CampusMart`
4. Expiration: Choose duration (90 days recommended)
5. Select scopes: Check `repo` (full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

## Alternative: Use GitHub CLI (Easier)

```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login

# Then push normally
git push -u origin main
```

## Complete Commands (Copy & Paste)

```bash
# 1. Security check
node backend/check-secrets.js

# 2. Check status
git status

# 3. Add files
git add .

# 4. Commit
git commit -m "Initial commit: CampusMart - Student marketplace and accommodation platform"

# 5. Push
git branch -M main
git push -u origin main
```

## After Successful Push

Your repository will be at:
**https://github.com/AliHamisi911/campusmart**

### Recommended Settings:

1. Add description: "Student marketplace and accommodation platform"
2. Add topics: `student-marketplace`, `react`, `nodejs`, `express`, `postgresql`, `accommodation`
3. Add website URL (when deployed)

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/AliHamisi911/campus-mart.git
```

### Error: "Authentication failed"
- Make sure you're using Personal Access Token, not your password
- Generate a new token if needed

### Error: "Repository not found"
- Make sure you created the repository on GitHub first
- Check the repository name is exactly `campus-mart`

## What Gets Pushed ✅

- ✅ All source code
- ✅ Documentation files
- ✅ `.env.example` files (templates)
- ✅ `.gitignore` file

## What Does NOT Get Pushed ✅

- ❌ `.env` files (protected by .gitignore)
- ❌ `node_modules/` folders
- ❌ Database credentials
- ❌ API keys
- ❌ Secrets

## Next Steps After Push

1. **Deploy Backend** - See `backend/DEPLOYMENT.md`
2. **Deploy Frontend** - See `frontend/README.md`
3. **Invite Collaborators** - Settings → Collaborators
4. **Set up Branch Protection** - Settings → Branches

## Need Help?

- GitHub Docs: https://docs.github.com
- Create an issue on your repository

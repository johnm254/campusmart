# GitHub Setup Guide

## Your GitHub Account
- **Email:** gakwelihamisi5@gmail.com
- **Username:** (Your GitHub username)

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `campus-mart`
3. Description: `Student marketplace and accommodation platform`
4. Choose: **Private** or **Public**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Configure Git Locally (Already Done ✅)

```bash
git config user.email "gakwelihamisi5@gmail.com"
git config user.name "Hamisi Gakweli"
```

## Step 3: Verify No Secrets Before Pushing

```bash
# Check for secrets
node backend/check-secrets.js

# Verify .env files are ignored
git status
```

**IMPORTANT:** Make sure you see NO `.env` files in the output!

## Step 4: Initialize and Push

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CampusMart platform"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/campus-mart.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: GitHub Authentication

When you push, GitHub will ask for authentication. You have two options:

### Option A: Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "CampusMart"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use the token as your password

### Option B: GitHub CLI

```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Then push normally
git push -u origin main
```

## Complete Push Commands

```bash
# 1. Check for secrets
node backend/check-secrets.js

# 2. Check git status
git status

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: CampusMart - Student marketplace platform"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/campus-mart.git

# 6. Push
git branch -M main
git push -u origin main
```

## Troubleshooting

### If remote already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/campus-mart.git
```

### If you get authentication errors:
```bash
# Use GitHub CLI
gh auth login

# Or use Personal Access Token as password
```

### If you accidentally committed secrets:
```bash
# Remove the last commit
git reset --soft HEAD~1

# Remove the file from staging
git reset HEAD backend/.env

# Commit again
git commit -m "Initial commit"
```

## After Successful Push

1. ✅ Verify repository on GitHub
2. ✅ Check that `.env` files are NOT visible
3. ✅ Add repository description
4. ✅ Add topics: `student-marketplace`, `react`, `nodejs`, `accommodation`
5. ✅ Set up GitHub Pages (optional)

## Repository Settings (Recommended)

1. Go to repository Settings
2. Add description: "Student marketplace and accommodation platform"
3. Add website: (your deployed URL)
4. Add topics: `student-marketplace`, `react`, `nodejs`, `express`, `postgresql`
5. Enable Issues (for bug tracking)
6. Enable Discussions (for community)

## Next Steps

1. **Deploy Backend** - See `backend/DEPLOYMENT.md`
2. **Deploy Frontend** - See `frontend/README.md`
3. **Set up CI/CD** - GitHub Actions (optional)
4. **Add collaborators** - Settings → Collaborators

## Security Reminder

- ✅ Never commit `.env` files
- ✅ Use environment variables on hosting platforms
- ✅ Rotate any exposed credentials immediately
- ✅ Keep dependencies updated

## Support

If you need help:
- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/book/en/v2

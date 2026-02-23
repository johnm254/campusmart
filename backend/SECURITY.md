# Security Guidelines

## Environment Variables

**CRITICAL:** Never commit `.env` files to version control!

### Backend Environment Variables
All sensitive keys are stored in `backend/.env`:
- Database credentials
- JWT secret
- Email credentials
- M-Pesa API keys
- Admin secrets

### Frontend Environment Variables
Stored in `frontend/.env`:
- API URL
- Admin secret (for admin panel access)

### Setup Instructions
1. Copy `.env.example` files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Fill in your actual credentials in the `.env` files

3. **Never commit** the actual `.env` files

## Git Safety

### Before Pushing to GitHub

1. **Check .gitignore is working:**
   ```bash
   git status
   ```
   Ensure `.env` files are NOT listed

2. **Verify no secrets in commits:**
   ```bash
   git log -p | grep -i "password\|secret\|key"
   ```

3. **If you accidentally committed secrets:**
   ```bash
   # Remove from history
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

4. **Immediately rotate all exposed credentials**

## Production Deployment

### Environment Variables in Production
- Use platform-specific secret management (Heroku Config Vars, Vercel Environment Variables, etc.)
- Never hardcode production credentials
- Use different credentials for production vs development

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access by IP
- Regular backups

### API Security
- Rate limiting enabled
- CORS properly configured
- JWT tokens with expiration
- Input validation on all endpoints

## Checklist Before GitHub Push

- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] `.env.example` files are up to date
- [ ] All sensitive data uses environment variables
- [ ] README doesn't contain actual credentials
- [ ] Database passwords are strong
- [ ] API keys are valid and not exposed

## Reporting Security Issues

If you discover a security vulnerability, please email: security@campusmart.co.ke

Do NOT create a public GitHub issue for security vulnerabilities.

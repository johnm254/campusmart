# Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] `.env.example` files are up to date
- [ ] Run `node check-secrets.js` before pushing

### Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive tested
- [ ] SEO meta tags updated

### Environment Variables
- [ ] Production database configured
- [ ] Email service configured
- [ ] M-Pesa credentials (if using payments)
- [ ] JWT secret is strong and unique
- [ ] CORS origins configured

## Deployment Platforms

### Frontend (Vercel/Netlify)

1. **Connect Repository**
   - Link your GitHub repository
   - Select `frontend` as root directory

2. **Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_ADMIN_SECRET=your_admin_secret
   ```

### Backend (Heroku/Railway/Render)

1. **Connect Repository**
   - Link your GitHub repository
   - Select `backend` as root directory

2. **Environment Variables**
   Set all variables from `backend/.env.example`:
   - `PORT`
   - `DATABASE_URL` (provided by platform)
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `MPESA_*` (if using)
   - `ADMIN_SECRET`
   - `FRONTEND_URL`

3. **Database**
   - Provision PostgreSQL addon
   - Run migrations if needed

### Database Setup

```sql
-- Run these commands in your production database
-- (Schema is auto-created by backend/index.js on first run)
```

## Post-Deployment

### Verify Deployment
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Authentication working
- [ ] Email sending working
- [ ] Mobile responsive

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Check database performance
- Set up uptime monitoring

### DNS & Domain
1. Point domain to frontend hosting
2. Update `FRONTEND_URL` in backend env
3. Update CORS origins in backend
4. Enable HTTPS/SSL

## Troubleshooting

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct
- Check CORS configuration

### Backend Issues
- Check server logs
- Verify database connection
- Check environment variables
- Verify JWT secret is set

### Database Issues
- Check connection string
- Verify SSL settings
- Check firewall rules
- Verify credentials

## Rollback Plan

If deployment fails:
1. Revert to previous commit
2. Redeploy previous version
3. Check logs for errors
4. Fix issues in development
5. Test thoroughly before redeploying

## Support

For deployment help:
- Email: support@campusmart.co.ke
- GitHub Issues: [Create Issue](https://github.com/yourusername/campus-mart/issues)

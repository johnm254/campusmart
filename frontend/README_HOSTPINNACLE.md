# 🚀 CampusMart Frontend - HostPinnacle Deployment

## Quick Setup Guide

### 1. Upload Files
Upload ALL files from this folder to: `public_html/`

Your structure should be:
```
public_html/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── .htaccess (for React routing)
└── api/ (backend folder)
```

### 2. Verify .htaccess
The `.htaccess` file enables React Router. It should contain:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### 3. Test
Visit: `https://campusmart.co.ke`

### 4. Configure API URL
The frontend is already configured to use:
- API URL: `https://campusmart.co.ke/api`

If you need to change this, you'll need to rebuild the frontend with updated `.env.production` file.

## Files Included
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- `.htaccess` - URL rewriting for React Router
- `public/` - Static assets (images, icons, manifest)

## Troubleshooting
- **Blank page**: Check browser console for errors
- **API errors**: Verify backend is running at `/api`
- **404 on refresh**: Ensure `.htaccess` is uploaded and mod_rewrite is enabled

## Support
Contact: support@campusmart.co.ke

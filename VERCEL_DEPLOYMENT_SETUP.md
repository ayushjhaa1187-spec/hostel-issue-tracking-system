# VERCEL DEPLOYMENT SETUP GUIDE

## Overview
This guide provides step-by-step instructions for setting up and deploying the Smart Hostel Issue Tracking System on Vercel.

## Prerequisites
- Vercel account (free tier is sufficient)
- GitHub repository connected to Vercel
- Backend API deployed somewhere (Render, Railway, or another service)
- Google OAuth credentials configured

## STEP 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Select your GitHub repository: `hostel-issue-tracking-system`
5. Click "Import"

## STEP 2: Configure Build Settings

**Project Settings:**
- **Root Directory:** `./frontend` (or keep empty if using root)
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

**Framework Preset:** React

## STEP 3: Set Environment Variables

In Vercel Dashboard, go to **Settings → Environment Variables** and add:

### Required Variables:

```
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
REACT_APP_API_URL=https://your-backend-api-url.com
REACT_APP_API_BASE_URL=https://your-backend-api-url.com/api
```

### How to Get Google Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/`
   - `https://your-vercel-domain.vercel.app/login`
   - `https://your-vercel-domain.vercel.app/dashboard`
6. Copy the **Client ID** and add to Vercel environment variables

### How to Get API URL:

Your backend API should be deployed on:
- Render.com (free tier)
- Railway.app
- Heroku (paid)
- AWS
- DigitalOcean

Example: `https://hostel-api-backend.onrender.com`

## STEP 4: Deploy to Vercel

1. After setting environment variables, click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Visit your Vercel URL once deployment is complete

## STEP 5: Test the Deployment

### Immediate Checks:
- [ ] Homepage loads without errors
- [ ] No blank white page
- [ ] Check browser console for errors (F12)
- [ ] Check Network tab for failed API calls

### Functionality Tests:
- [ ] Google login button appears
- [ ] Google login redirects correctly
- [ ] After login, can access dashboard
- [ ] Can see issues list
- [ ] Can create a new issue
- [ ] Can update issue status
- [ ] Logout works

## STEP 6: Troubleshooting

### Issue: Blank White Page

**Causes & Solutions:**
1. **Missing environment variables**
   - Check Vercel deployment logs
   - Verify all REACT_APP_* variables are set
   - Redeploy after adding variables

2. **API connection failed**
   - Check if backend API is running
   - Verify API URL in environment variables
   - Check CORS settings in backend
   - Test API endpoint directly in browser

3. **Build failed**
   - Check Vercel build logs
   - Ensure `npm run build` works locally
   - Check for TypeScript errors

### Issue: Google Login Not Working

**Solutions:**
1. **Redirect URI mismatch**
   - Go to Google Cloud Console
   - Check OAuth 2.0 redirect URIs
   - Must include your Vercel domain exactly
   - Add both HTTP and HTTPS versions if needed

2. **Wrong Client ID**
   - Verify Client ID in Vercel environment variables
   - Ensure it matches Google Console
   - Redeploy after updating

3. **CORS errors**
   - Check browser console for CORS errors
   - Verify backend has CORS enabled
   - Add Vercel domain to CORS whitelist if needed

### Issue: API Calls Failing

**Solutions:**
1. Check Network tab in DevTools
2. Verify API URL is correct (no trailing slash)
3. Ensure backend API is deployed and running
4. Check backend CORS configuration
5. Test API endpoint directly: `curl https://your-api.com/api/health`

## STEP 7: Custom Domain (Optional)

1. In Vercel Dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Google OAuth redirect URIs to include custom domain
5. Redeploy

## STEP 8: Environment Variables for Production

**Do NOT commit sensitive data to GitHub!**

Always use Vercel environment variables for:
- `REACT_APP_GOOGLE_CLIENT_ID`
- `REACT_APP_API_URL`
- Any API keys or secrets

## Monitoring & Analytics

- **Vercel Dashboard:** View deployment logs, build history
- **Real-time Logs:** Streaming logs during deployment
- **Analytics:** View page performance and usage

## Quick Redeploy

If you need to redeploy after code changes:
1. Push to GitHub main branch
2. Vercel automatically redeploys
3. Or manually click "Redeploy" in Vercel Dashboard

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [React Deployment Guide](https://create-react-app.dev/deployment/vercel/)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Status:** Ready for Production Deployment
**Last Updated:** During Development Phase

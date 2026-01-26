# DEPLOYMENT FIX GUIDE - HackOverflow Hostel Issue Tracking System

## CRITICAL ISSUES IDENTIFIED

### 1. **GitHub Pages Deployment Conflict**
The `.github/workflows/main.yml` file contains deployment instructions for GitHub Pages, which conflicts with Vercel deployment.

### 2. **Environment Variables Missing**
The Vercel app requires backend API environment variables to function properly.

### 3. **CORS Configuration**
Cross-Origin Resource Sharing must be configured properly for API requests.

## STEP-BY-STEP FIX INSTRUCTIONS

### Phase 1: GitHub Workflow Cleanup

**MUST DO:**
1. Remove GitHub Pages deployment configuration from `.github/workflows/main.yml`
2. Keep only the basic CI/CD testing workflow
3. Commit changes to main branch

**File Location:** `.github/workflows/main.yml`

**Action:** Delete all lines related to GitHub Pages deployment (gh-pages branch pushing)

### Phase 2: Vercel Configuration

**MUST DO:**
1. Go to Vercel Dashboard for this project
2. Navigate to Settings → Environment Variables
3. Add the following environment variables:

```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_ENV=production
```

### Phase 3: Frontend Build Configuration

**ALREADY FIXED:**
- ✅ Removed `homepage` field from `frontend/package.json`
- ✅ Fixed Google OAuth redirect URIs in `frontend/src/App.js`

**VERIFY:**
- App.js uses correct Google Client ID
- API calls use REACT_APP_API_URL environment variable
- No hardcoded backend URLs

### Phase 4: Backend Verification

**CHECK:** `backend/server.js`
- ✅ Express server configured
- ✅ CORS enabled for Vercel domain
- ✅ Environment variables properly used

### Phase 5: Vercel Redeployment

1. Connect your GitHub repository to Vercel (if not already done)
2. Ensure `vercel.json` is in root directory
3. Set build command: `npm install && npm run build` (for root or frontend)
4. Set output directory: `frontend/build` (if using root for monorepo)
5. Trigger manual redeploy from Vercel dashboard

### Phase 6: Testing After Deployment

**Immediate Tests:**
1. Homepage loads without errors
2. No blank page (check Network tab for API errors)
3. Console shows no critical errors

**API Tests:**
1. Login with Google works
2. Issue creation works
3. Issue list loads with data
4. Issue updates reflect in database

## DEBUGGING CHECKLIST

- [ ] GitHub Actions workflow doesn't conflict with Vercel
- [ ] Vercel environment variables are set correctly
- [ ] Frontend build succeeds locally (`npm run build`)
- [ ] Backend API is reachable from frontend
- [ ] Google OAuth credentials match deployment domain
- [ ] CORS headers allow Vercel domain
- [ ] No hardcoded localhost URLs in production code
- [ ] Database connection string is correct in backend

## COMMON ERRORS AND SOLUTIONS

### **"Blank Page on Vercel"**
- Check browser console for errors
- Check Vercel deployment logs
- Verify Environment Variables are set
- Check API endpoint in Network tab

### **"API Calls Fail (CORS Error)"**
- Add Vercel domain to CORS whitelist in backend
- Ensure credentials are sent with requests if needed
- Check backend server.js CORS configuration

### **"Google OAuth Not Working"**
- Verify Google OAuth redirect URIs include Vercel domain
- Check Google Console for correct Client ID
- Ensure REACT_APP_GOOGLE_CLIENT_ID environment variable is set

## NEXT STEPS FOR SUBMISSION

1. ✅ Complete all fixes from Phase 1-6
2. ✅ Run full test suite (insane level testing)
3. ✅ Document all changes in DEPLOYMENT_FIX_CHECKLIST.md
4. ✅ Verify deployment is live and functional
5. ✅ Submit to HackOverflow with deployment link

---

**Last Updated:** During Development Phase
**Status:** Critical Fixes Required
**Priority:** URGENT - Fix before submission deadline

# ⚡ QUICK START - Deploy in 2 Hours

**Current Status**: Backend fixed, ready to deploy  
**Time**: January 29, 2026, 8:17 PM IST  
**Deadline**: February 1, 2026

---

## 📅 YOUR ACTION PLAN

### 🔴 URGENT - Do These NOW (Next 2 Hours)

#### ✅ COMPLETED
- [x] Fixed backend package.json (cookie-parser added)
- [x] Repository structure verified
- [x] All models and routes exist

#### 🟡 IN PROGRESS - Do These Next

**Step 1: MongoDB Setup (15 min)** - START HERE!
- [ ] Sign up at https://www.mongodb.com/cloud/atlas/register
- [ ] Create FREE M0 cluster (Mumbai region)
- [ ] Create database user: `hostelapp`
- [ ] Whitelist all IPs (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Save connection string somewhere safe

**Step 2: Deploy Backend (20 min)**
- [ ] Go to https://railway.app
- [ ] Sign in with GitHub
- [ ] Deploy from GitHub repo
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
- [ ] Wait for deployment
- [ ] Test: `https://your-url.railway.app/api/health`
- [ ] Copy Railway URL

**Step 3: Deploy Frontend (15 min)**
- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Import your repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variable:
  - [ ] REACT_APP_API_URL = (your Railway URL)
- [ ] Deploy
- [ ] Copy Vercel URL

**Step 4: Connect Frontend to Backend (5 min)**
- [ ] Go to Railway dashboard
- [ ] Add FRONTEND_URL variable (your Vercel URL)
- [ ] Wait for auto-redeploy

**Step 5: Test Everything (10 min)**
- [ ] Open your Vercel URL
- [ ] Report a test issue
- [ ] Verify it appears in the list
- [ ] Check MongoDB Atlas for data

**Step 6: Record Video (30 min)**
- [ ] Write script (use template from DEPLOYMENT_GUIDE.md)
- [ ] Record 3-5 minute demo
- [ ] Upload to YouTube/Loom
- [ ] Get shareable link

**Step 7: Update Documentation (10 min)**
- [ ] Update README.md with live URLs
- [ ] Add demo video link
- [ ] Push changes to GitHub

**Step 8: Submit on Unstop (10 min)**
- [ ] GitHub repository link
- [ ] Live demo URL
- [ ] Video presentation link
- [ ] Project description

---

## 📝 INFORMATION YOU'LL NEED

**Save These URLs As You Get Them:**

```
MongoDB Connection String:
_____________________________________________

Railway Backend URL:
_____________________________________________

Vercel Frontend URL:
_____________________________________________

Demo Video Link:
_____________________________________________
```

---

## ⏱️ TIME BREAKDOWN

- MongoDB Setup: 15 min
- Backend Deploy: 20 min  
- Frontend Deploy: 15 min
- Configuration: 10 min
- Testing: 10 min
- Video Recording: 30 min
- Documentation: 10 min
- Submission: 10 min

**Total: 2 hours**

---

## 🎯 PRIORITY ORDER

1. **HIGHEST**: Deploy backend (you can't test without this)
2. **HIGH**: Deploy frontend (this is what judges see)
3. **MEDIUM**: Record video (required for submission)
4. **LOW**: Polish documentation (nice to have)

---

## 🛑 COMMON MISTAKES TO AVOID

- ❌ Don't skip environment variables - they're CRITICAL
- ❌ Don't forget to whitelist IPs in MongoDB Atlas
- ❌ Don't use localhost URLs in production
- ❌ Don't wait until deadline to test
- ❌ Don't forget to make repository public

---

## ✅ SUCCESS INDICATORS

You're done when:

1. ✅ `/api/health` returns status message
2. ✅ Frontend loads without errors
3. ✅ You can report an issue
4. ✅ Issue appears in the list
5. ✅ Data is in MongoDB
6. ✅ Video is recorded
7. ✅ Project is submitted

---

## 📞 HELP

**If stuck, check:**
1. DEPLOYMENT_GUIDE.md (detailed instructions)
2. Railway/Vercel deployment logs
3. Browser DevTools console (F12)
4. MongoDB Atlas connection status

---

## 🚀 START NOW!

**Next Action**: Click this link → https://www.mongodb.com/cloud/atlas/register

Good luck! You've got this! 🚀

---

*Created: January 29, 2026*  
*HackOverflow 2026 - IIT Goa*

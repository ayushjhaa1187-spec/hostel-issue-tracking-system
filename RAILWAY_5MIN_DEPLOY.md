# ⚡ RAILWAY DEPLOYMENT - 5 MINUTE GUIDE
## Deploy Your Backend in 5 Easy Steps

---

## 🚀 STEP 1: Login to Railway (1 minute)

**YOU ARE ALREADY ON THIS PAGE!**

You're at: https://railway.com/new/github

**What you see:** Purple button saying "Login with GitHub"

**What to do:**
1. Click the purple "Login with GitHub" button
2. GitHub will open asking for authorization
3. Click "Authorize Railway"
4. You'll be redirected back to Railway (now logged in)

**That's it for Step 1!**

---

## 📁 STEP 2: Select Your Repository (30 seconds)

**After logging in, you'll see:**
- A list of your GitHub repositories
- Search bar to find repos

**What to do:**
1. Look for "hostel-issue-tracking-system" in the list
2. Click on it
3. Railway will say "Deploy" - **Don't click Deploy yet!**

---

## ⚙️ STEP 3: Configure Root Directory (1 minute)

**CRITICAL STEP - Don't skip!**

Before deploying, you MUST tell Railway your backend is in the `backend` folder.

**What to do:**
1. Look for "Settings" or configuration options
2. Find "Root Directory" or "Working Directory"
3. Type: `backend`
4. Save/Apply

**Why?** Your backend code is in the `backend` folder, not the root.

---

## 🔑 STEP 4: Add Environment Variables (2 minutes)

**YOU NEED 4 ENVIRONMENT VARIABLES:**

### Variable 1: MONGO_URI
```
Key: MONGO_URI
Value: (paste your MongoDB connection string from MongoDB tab)
```
**Example:**
```
mongodb+srv://hostelapp:yourpassword@cluster0.xxxxx.mongodb.net/hostel_tracking?retryWrites=true&w=majority
```

### Variable 2: JWT_SECRET
```
Key: JWT_SECRET
Value: hackoverflow2026_super_secret_key_12345
```

### Variable 3: NODE_ENV
```
Key: NODE_ENV
Value: production
```

### Variable 4: PORT
```
Key: PORT
Value: 5000
```

**How to add them:**
1. Click "Variables" or "Environment Variables" tab
2. Click "Add Variable" or "+"
3. Enter Key and Value
4. Click "Add" or "Save"
5. Repeat for all 4 variables

---

## 🚀 STEP 5: Deploy! (30 seconds)

**Final step:**

1. Click the big "Deploy" button
2. Wait 2-3 minutes while Railway:
   - Installs dependencies
   - Builds your backend
   - Starts the server

3. **Watch the logs** - you'll see:
   ```
   Installing dependencies...
   Building...
   Starting...
   Server running on port 5000
   MongoDB connected!
   ```

4. **Once deployed**, Railway will give you a URL like:
   ```
   https://hostel-issue-tracking-system-production.up.railway.app
   ```

5. **SAVE THIS URL!** You need it for Vercel.

---

## ✅ STEP 6: Test Your Backend (30 seconds)

**Verify it works:**

1. Open your Railway URL in browser
2. Add `/api/health` to the end
3. Example: `https://your-app.up.railway.app/api/health`

**You should see:**
```json
{
  "status": "Backend is running!",
  "timestamp": "2026-01-29T..."
}
```

**If you see this - YOUR BACKEND IS LIVE! 🎉**

---

## 🚨 TROUBLESHOOTING

### Problem: "Build Failed"
**Solution:** 
- Check Root Directory is set to `backend`
- Check all 4 environment variables are added
- Check MongoDB connection string is correct

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Go to MongoDB Atlas
- Network Access → Ensure 0.0.0.0/0 is whitelisted
- Check password in connection string is correct

### Problem: "Port already in use"
**Solution:**
- This shouldn't happen on Railway
- Railway automatically assigns ports
- Check your PORT variable is set to 5000

---

## 🎯 WHAT'S NEXT?

After Railway deployment is successful:

1. **Copy your Railway URL**
2. **Go to Vercel** (your frontend)
3. **Add environment variable:**
   - Key: `REACT_APP_API_URL`
   - Value: (your Railway URL)
4. **Redeploy Vercel**

Then your frontend and backend will be connected!

---

## 📊 CURRENT STATUS

- [x] Code ready
- [x] GitHub repository
- [ ] **Railway deployment** ← YOU ARE HERE
- [ ] Connect to Vercel
- [ ] Test full application

---

## 💡 PRO TIPS

1. **Keep Railway tab open** - you'll need the URL later
2. **Save your environment variables** - in case you need to redeploy
3. **Watch the logs** - they'll tell you what's happening
4. **Test the /api/health endpoint** - confirms backend is working

---

## ⏱️ TIME BREAKDOWN

| Step | Time | Difficulty |
|------|------|------------|
| Login | 1 min | Easy |
| Select Repo | 30 sec | Easy |
| Configure | 1 min | Easy |
| Add Variables | 2 min | Medium |
| Deploy | 30 sec | Easy |
| Test | 30 sec | Easy |
| **TOTAL** | **5 min** | **Easy** |

---

## 🎆 CONCLUSION

You're literally **5 minutes away** from having a live backend!

Just follow these steps ONE BY ONE, don't skip anything, and you'll be done.

**The Railway tab is already open - START NOW!**

---

**Last Updated:** January 29, 2026, 9 PM IST  
**Status:** Ready to deploy  
**Estimated Time:** 5 minutes

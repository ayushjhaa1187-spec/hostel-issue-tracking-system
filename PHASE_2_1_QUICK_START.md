# Phase 2.1 Quick Start - Implementation Checklist

## 🎯 Your Task: Implement Phase 2.1 Locally

This document shows EXACTLY what to do to implement the Phase 2.1 performance improvements.

---

## 📋 CHECKLIST - Copy & Paste Into Your Terminal

### 1️⃣ SETUP & DEPENDENCIES (5 min)

```bash
cd backend

# Install MongoDB driver
npm install mongoose

# Optional: Install nodemon for auto-reload (if not already done)
npm install --save-dev nodemon
```

✅ **After this step:**
- Check: `npm ls mongoose` shows mongoose is installed
- Check: `package.json` has mongoose in dependencies

---

### 2️⃣ CREATE NEW FOLDERS & FILES (10 min)

Create these files in your `backend` folder:

```
backend/
├── models/
│   ├── Issue.js
│   ├── User.js
│   └── Announcement.js
└── utils/
    └── pagination.js
```

**Command to create folders:**
```bash
mkdir -p backend/models backend/utils
```

✅ **After this step:**
- All 4 new files should exist but be empty

---

### 3️⃣ COPY CODE FROM IMPLEMENTATION GUIDE (20 min)

Open: `PHASE_2_1_IMPLEMENTATION.md` (in your repo root)

**For each file below, copy the code from sections 1-4:**

1. **`backend/models/Issue.js`** ← Copy from section 1
   - Contains: schema + 6 indexes

2. **`backend/models/User.js`** ← Copy from section 2
   - Contains: schema + 2 indexes

3. **`backend/models/Announcement.js`** ← Copy from section 3
   - Contains: schema + 2 indexes

4. **`backend/utils/pagination.js`** ← Copy from section 4
   - Contains: 2 helper functions

✅ **After this step:**
- Run: `node -c backend/models/Issue.js` (should show no syntax errors)
- Run: `node -c backend/utils/pagination.js` (should show no syntax errors)

---

### 4️⃣ UPDATE server.js (30 min) - CRITICAL STEP

Open your `backend/server.js`

**Step A: Add imports at the TOP (after existing requires):**
```javascript
const mongoose = require('mongoose');
const Issue = require('./models/Issue');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const { getPaginationParams, formatPaginatedResponse } = require('./utils/pagination');
```

**Step B: Add MongoDB connection (after `dotenv.config()`):**
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
```

**Step C: REMOVE these lines (lines 17-19 in current server.js):**
```javascript
const users = [];      // DELETE THIS
const issues = [];     // DELETE THIS
const announcements = []; // DELETE THIS
```

**Step D: Replace the entire `GET /api/issues` endpoint (copy from section 5):**
- Delete old: `app.get('/api/issues', checkRole(), (req, res) => { ... })`
- Paste new: version from PHASE_2_1_IMPLEMENTATION.md section 5

**Step E: Replace `POST /api/issues` endpoint (copy from section 5):**
- Delete old version
- Paste new version from section 5

**Step F: Replace `GET /api/announcements` endpoint (copy from section 6):**
- Delete old version
- Paste new version

**Step G: Replace `POST /api/announcements` endpoint (copy from section 6):**
- Delete old version
- Paste new version

✅ **After this step:**
- server.js should have NO red squiggles (syntax errors)
- All 4 model requires should work
- MongoDB connection should be configured

---

### 5️⃣ UPDATE .env FILE (5 min)

Open (or create) `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/hostel-tracking
JWT_SECRET=your_secret_key_change_in_production_12345
PORT=5000
NODE_ENV=development
```

**OR if using MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-tracking?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

✅ **After this step:**
- `.env` file exists in backend folder
- No `.env` should be committed (it's in .gitignore)

---

### 6️⃣ START MONGODB (5 min)

**Option A: Local MongoDB (recommended for testing)**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows (if installed)
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Option B: Use MongoDB Atlas (Cloud - easier)**
- Go to: https://www.mongodb.com/cloud/atlas
- Create free account
- Create a cluster
- Copy connection string to `.env` MONGODB_URI

✅ **After this step:**
- MongoDB is running (local or cloud)
- You can connect: `mongosh` (local) or check Atlas UI

---

### 7️⃣ START BACKEND & TEST (10 min)

```bash
# From backend folder
npm run dev

# You should see:
# ✅ MongoDB connected
# Smart Hostel Issue Tracking System - Backend running on port 5000
```

✅ **After this step:**
- Backend server is running
- No error messages
- MongoDB is connected

---

### 8️⃣ TEST ENDPOINTS (10 min)

**Open a NEW terminal (don't stop the server) and test:**

```bash
# Test 1: Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User",
    "role": "student",
    "hostel": "H1"
  }'

# You'll get back a token - COPY IT
# Replace TOKEN_HERE with the token in next commands

TOKEN=<paste_token_here>

# Test 2: Create an issue
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Water leak in room",
    "description": "Water dripping from ceiling",
    "category": "Plumbing",
    "priority": "high",
    "hostel": "H1",
    "block": "B1"
  }'

# Test 3: GET issues with PAGINATION
curl -X GET 'http://localhost:5000/api/issues?page=1&limit=10' \
  -H "Authorization: Bearer $TOKEN"

# EXPECTED RESPONSE:
# {
#   "data": [ { issue objects } ],
#   "pagination": {
#     "page": 1,
#     "limit": 10,
#     "total": 1,
#     "totalPages": 1
#   }
# }

# Test 4: GET issues with FILTERS
curl -X GET 'http://localhost:5000/api/issues?page=1&limit=5&status=Reported&hostel=H1' \
  -H "Authorization: Bearer $TOKEN"

# Test 5: Create announcement (as admin)
curl -X POST http://localhost:5000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Maintenance notice",
    "content": "Water maintenance on block B1",
    "targetHostel": "H1",
    "targetBlock": "B1"
  }'

# Test 6: GET announcements with pagination
curl -X GET 'http://localhost:5000/api/announcements?page=1&limit=5' \
  -H "Authorization: Bearer $TOKEN"
```

✅ **After this step:**
- All endpoints return 200 OK
- Pagination works (notice the new response format)
- Filters work (can filter by status, hostel, etc.)

---

## 🎯 VERIFICATION CHECKLIST

Before moving to Phase 2.2, confirm:

- [ ] All 4 model files created and copied
- [ ] server.js updated with new endpoints
- [ ] .env file has MONGODB_URI
- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Can register user and get token
- [ ] Can create issues
- [ ] GET /issues returns paginated format: `{ data, pagination }`
- [ ] GET /issues?status=Reported works
- [ ] GET /announcements returns paginated format

---

## 📊 Performance Check

Create 50+ test issues and run:

```bash
# This should be FAST (< 200ms)
time curl -X GET 'http://localhost:5000/api/issues?page=1&limit=10' \
  -H "Authorization: Bearer $TOKEN"
```

Expected: ~200ms for paginated list (vs ~800ms before)

---

## ❌ TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check MONGODB_URI in .env, ensure MongoDB is running |
| "Cannot find module mongoose" | Run `npm install mongoose` |
| API returns old response format | Check server.js updated with new endpoints |
| Port 5000 already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Issues not saving to DB | Check MongoDB is connected, check .env MONGODB_URI |

---

## 🚀 NEXT: Phase 2.2

After completing this checklist, move to Phase 2.2:

```bash
# Phase 2.2 will add:
- Redis caching for dashboard
- Real-time WebSocket updates
- Response compression
```

See: `PHASE_2_2_IMPLEMENTATION.md` (coming soon)

---

## 📝 Notes

- This is Phase 2.1 of the 4-phase development plan
- Expected result: 75% faster queries
- API response format CHANGED from flat to paginated
- Database indexes will be created automatically by Mongoose

---

**Time to complete: ~90 minutes total**

Good luck! 🎯

# 🏠 Hostel Issue Tracking System — The Portal

![build](https://img.shields.io/badge/build-passing-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)

**Centralized digital portal for streamlining student grievances and facility maintenance in hostels — built for HackOverflow 2026 at IIT Goa.**

Students submit maintenance tickets with photos and descriptions. Wardens get a real-time admin dashboard to assign, track, and resolve issues. No more paper logs, no more forgotten complaints.

---

## 🚀 Live Demo

**[📎 View The Portal](https://hostel-issue-tracking-system.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| **Issue Submission** | Students submit maintenance complaints with title, description, category, room number, and photo |
| **Real-time Status** | Track ticket status: Open → In Progress → Resolved |
| **Admin Dashboard** | Wardens view all issues, assign resolution, update status |
| **Announcements** | Admins post hostel-wide notices visible to all students |
| **Lost & Found** | Report or search for lost items across the hostel |
| **JWT Auth** | Role-based access: Student vs Warden/Admin |
| **Pagination** | Efficient loading of large issue lists |
| **Photo Upload** | Attach images to maintenance requests |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) + EJS templates |
| Backend | Node.js + Express.js |
| Database | MongoDB (via MongoDB Atlas) |
| Auth | JWT (JSON Web Tokens) + bcrypt password hashing |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 📁 Project Structure

```
hostel-issue-tracking-system/
├── frontend/              # HTML/CSS/JS frontend
├── backend/
│   ├── config/            # MongoDB connection config
│   ├── controllers/       # Route logic (auth, issues, announcements, lost-found)
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose models (User, Issue, Announcement, LostFound)
│   ├── routes/            # Express route definitions
│   ├── utils/             # Pagination and helper utilities
│   └── .env.example       # Environment variables template
├── .github/workflows/     # CI/CD GitHub Actions
├── AUTOMATED_FIXES.md
├── BONUS_FEATURES_IMPL.md
├── BUGFIX_REPORT.md
├── COMPREHENSIVE_TEST_PLAN.md
└── .gitignore
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/ayushjhaa1187-spec/hostel-issue-tracking-system.git
cd hostel-issue-tracking-system
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Run the frontend

Open `frontend/index.html` directly in your browser, or serve it via:

```bash
npx serve frontend
```

---

## 🔐 Environment Variables

All backend env vars go in `backend/.env` (copied from `backend/.env.example`):

| Variable | Required | Description | Example |
|---|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hostel_tracking` |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (min 32 chars) | `node -e "require('crypto').randomBytes(32).toString('hex')"` |
| `PORT` | ✅ | Server port | `5000` |
| `NODE_ENV` | ✅ | Environment | `production` |
| `FRONTEND_URL` | ✅ | Allowed CORS origin | `https://your-frontend.vercel.app` |

> Never commit `.env` to git. It is listed in `.gitignore`.

---

## 🗄️ Database Schema (MongoDB Collections)

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | _id, name, email, password (hashed), role (student/warden), roomNo, hostelBlock | Authentication and profile |
| `issues` | _id, studentId, title, description, category, roomNo, status, photoUrl, assignedTo, resolvedAt, createdAt | Maintenance tickets |
| `announcements` | _id, adminId, title, content, type, createdAt | Hostel-wide notices |
| `lostfounds` | _id, reportedBy, itemName, description, location, status (lost/found), photoUrl, createdAt | Lost & found items |

All collections use MongoDB ObjectId as `_id`. Passwords are hashed with bcrypt before storage.

---

## 📞 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register student or warden |
| POST | `/api/auth/login` | Login, returns JWT |

### Issues
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/issues` | ✅ | List all issues (paginated) |
| POST | `/api/issues` | ✅ | Submit a new issue |
| PUT | `/api/issues/:id/status` | Warden | Update issue status |
| DELETE | `/api/issues/:id` | Warden | Delete an issue |

### Announcements
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/announcements` | ✅ | List all announcements |
| POST | `/api/announcements` | Warden | Create announcement |

### Lost & Found
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/lostfound` | ✅ | List all items |
| POST | `/api/lostfound` | ✅ | Report lost/found item |

All protected endpoints require: `Authorization: Bearer <token>`

---

## 🚀 Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app), create new project
2. Connect your GitHub repo, select `backend/` as root directory
3. Add environment variables (from `.env.example`)
4. Railway auto-deploys on push to `main`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com), import repo
2. Set root directory to `frontend/`
3. Set `FRONTEND_URL` in your Railway backend to the Vercel URL
4. Deploy

---

## ✅ Production Readiness Checklist

- [x] JWT auth with role-based access (Student vs Warden)
- [x] Password hashing with bcrypt
- [x] CORS configured for production frontend URL
- [x] Environment variables in `.env.example` (never committed)
- [x] .gitignore includes `.env`, `node_modules`
- [x] MongoDB Atlas connection (production-safe)
- [x] Pagination on issue lists
- [x] Input validation on all endpoints
- [x] GitHub Actions CI/CD workflow
- [x] Bug fix report (BUGFIX_REPORT.md)
- [x] Comprehensive test plan (COMPREHENSIVE_TEST_PLAN.md)
- [x] MIT License
- [ ] Live deployment URL (add to Vercel + Railway after setup)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `feat: add X` or `fix: resolve Y`
4. Open a Pull Request against `main`

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Ayush Kumar Jha** — [@ayushjhaa1187-spec](https://github.com/ayushjhaa1187-spec)  
Built for **HackOverflow 2026 — IIT Goa**

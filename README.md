# Smart Hostel Issue Tracking System

## HackOverflow 2026 - IIT Goa

A full-stack web application for managing hostel maintenance issues, announcements, and tracking resolution times.

### Problem Statement

Replace fragmented complaint methods (verbal, WhatsApp, registers) with a formal, traceable digital system for hostel repairs and facilities.

### Key Features

#### Authentication & Role-Based Access Control
- **Roles**: Student, Management, Staff/Caretaker
- JWT-based authentication
- Fine-grained permissions for different roles

#### Issue Management
- **Report Issues**: Category, priority, description, image upload, public/private visibility
- **Hostel Auto-Tagging**: Automatically tags hostel, block, and room from user profile
- **Status Tracking**: Reported → Assigned → In Progress → Resolved → Closed
- **Timestamp Logging**: All status changes are logged with timestamps

#### Hostel Announcements
- Management can post hostel/block-wise announcements
- Students see announcements filtered by their hostel/block
- Categories: Cleaning schedules, pest control, maintenance, water/electricity downtime

#### Analytics Dashboard
- Issue counts by category and status
- Hostel/block-wise issue density
- Average response and resolution times
- Pending vs resolved issue ratios

#### Lost & Found Module (Future)
- Report lost/found items
- Claim workflow with admin moderation

### Tech Stack

#### Backend
- Node.js + Express (or NestJS)
- PostgreSQL / MongoDB
- JWT Authentication
- RESTful APIs

#### Frontend
- React / Next.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation

#### Deployment
- Backend: Render / Railway
- Frontend: Vercel / Netlify
- Database: PostgreSQL (Neon) / MongoDB Atlas

### Project Structure

```
hostel-issue-tracking-system/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Getting Started

#### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

#### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/ayushjhaa1187-spec/hostel-issue-tracking-system.git
   cd hostel-issue-tracking-system
   ```

2. Backend Setup
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm start
   ```

3. Frontend Setup
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### API Endpoints (MVP)

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

#### Issues
- `GET /issues` - List issues (filtered by role)
- `POST /issues` - Create new issue
- `GET /issues/:id` - Get issue details
- `PATCH /issues/:id/assign` - Assign issue to staff
- `PATCH /issues/:id/status` - Update issue status

#### Announcements
- `GET /announcements` - List announcements
- `POST /announcements` - Create announcement

#### Dashboard
- `GET /dashboard/summary` - Get analytics summary

### Workflow

**Day 1-2**: Backend Setup & API Development
- Initialize project structure
- Implement authentication
- Create core API endpoints

**Day 3-4**: Database & Data Models
- Design and implement database schema
- Create models for User, Issue, Announcement

**Day 5-6**: Frontend Development
- Build UI components
- Connect to backend APIs
- Implement role-based views

**Day 7**: Testing & Deployment
- Test all workflows
- Deploy frontend and backend
- Prepare submission

### Future Enhancements

- Comments and reactions on public issues
- Duplicate issue merging
- Advanced analytics and reporting
- Email/SMS notifications
- Mobile app (Android/iOS)
- Real-time updates with WebSocket

### Team

- Developer: Ayush Kumar Jha
- Duration: 7 Days (Jan 25 - Feb 1, 2026)

### License

MIT License

### Submission

This project is developed for **HackOverflow 2026** hosted on Unstop.
- **Repository**: https://github.com/ayushjhaa1187-spec/hostel-issue-tracking-system
- **Live Demo**: [Deployment link to be added]

---

## Deployment Status

**Current Status**: ✅ Deployment Triggered and Active

**Latest Updates**:
- Vercel integration configured
- Production deployment in progress
- Frontend build optimized with proper configuration

For deployment troubleshooting, refer to DEPLOYMENT_FIX_GUIDE.md

**Last Updated**: January 25, 2026
**Status**: Development in Progress

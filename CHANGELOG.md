# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Planned
- Live Vercel (frontend) + Railway (backend) deployment
- Email notifications when issue status changes
- Photo upload via Cloudinary or AWS S3
- Student mobile-friendly PWA
- Analytics dashboard for wardens (issue resolution times, category breakdown)
- Export reports to CSV/PDF

## [0.2.0] - 2026-04-06

### Added
- Production-ready README with tech stack badges, env variable table, DB schema, API reference, deployment guide
- CHANGELOG.md (this file)

## [0.1.0] - 2026-01-15 (HackOverflow 2026 Submission)

### Added
- Full-stack Node.js + Express backend
- MongoDB Atlas integration via Mongoose
- JWT authentication with role-based access (Student vs Warden)
- bcrypt password hashing
- Issue submission with title, description, category, room number
- Photo attachment support for maintenance tickets
- Issue status tracking (Open -> In Progress -> Resolved)
- Warden admin dashboard for issue management
- Announcements module (create and view hostel notices)
- Lost & Found module
- Pagination utility for issue lists
- CORS configuration for production
- GitHub Actions CI/CD workflow (.github/workflows/)
- .env.example with full documentation
- .gitignore (excludes .env, node_modules)
- Railway deployment config for backend
- Vercel deployment config for frontend
- BUGFIX_REPORT.md
- AUTOMATED_FIXES.md
- BONUS_FEATURES_IMPL.md
- COMPREHENSIVE_TEST_PLAN.md
- MIT License

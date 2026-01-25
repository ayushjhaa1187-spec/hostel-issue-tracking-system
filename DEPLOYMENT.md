# Deployment & Testing Guide

## Smart Hostel Issue Tracking System

### Quick Start

**Backend:**
```bash
cd backend
npm install
DATABASE_URL=your_mongodb_url JWT_SECRET=your_secret npm start
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
```

---

## Testing Checklist

### Authentication Tests
- [ ] Email/Password Login Works
- [ ] Email/Password Signup Works
- [ ] Google OAuth Login Works
- [ ] Logout Clears Token & User Data
- [ ] Protected Routes Redirect to Login
- [ ] JWT Token Persists in localStorage

### Feature Tests
- [ ] Student Can View Issues
- [ ] Staff Can Create Issues
- [ ] Management Can Update Issues
- [ ] Management Can Post Announcements
- [ ] Issues Display with Status Badge
- [ ] Announcements Show Author Info

### UI/UX Tests
- [ ] Responsive on Mobile (375px)
- [ ] Responsive on Tablet (768px)
- [ ] Responsive on Desktop (1920px)
- [ ] All Forms Validate Input
- [ ] Error Messages Display
- [ ] Loading States Work

### Security Tests
- [ ] XSS Prevention (Test input sanitization)
- [ ] CSRF Protection (Check token validation)
- [ ] No Sensitive Data in URLs
- [ ] No Console Errors

---

## Deployment Steps

### Deploy Backend to Vercel
```bash
vercel --prod
# Set environment variables in Vercel dashboard
```

### Deploy Frontend to Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

---

## Production Checklist

- [ ] All Tests Passing
- [ ] No Console Errors
- [ ] No Network Errors (Check DevTools)
- [ ] Performance: < 3s Load Time
- [ ] SSL/HTTPS Enabled
- [ ] Environment Variables Configured
- [ ] Database Backup Configured
- [ ] Error Logging Setup
- [ ] Monitoring Tools Configured
- [ ] Documentation Complete

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for MVP, replace with database)
const users = [];
const issues = [];
const announcements = [];

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';
const PORT = process.env.PORT || 5000;

// ============= UTILITY FUNCTIONS =============

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Check Role Middleware
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    if (requiredRole && decoded.role !== requiredRole && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    req.user = decoded;
    next();
  };
};

// ============= AUTH ROUTES =============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, hostel, block, room } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role: role || 'student',
      hostel: hostel || '',
      block: block || '',
      room: room || '',
      createdAt: new Date()
    };

    users.push(user);

    const token = generateToken(user.id, user.role);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// ============= ISSUES ROUTES =============

app.get('/api/issues', checkRole(), (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.userId;

    let filteredIssues = issues;

    // Filter based on role and visibility
    if (userRole === 'student') {
      filteredIssues = issues.filter(issue =>
        issue.visibility === 'public' || issue.createdBy === userId
      );
    }

    res.json({ issues: filteredIssues, total: filteredIssues.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/issues', checkRole(), (req, res) => {
  try {
    const { title, description, category, priority, visibility } = req.body;

    if (!title || !category || !priority) {
      return res.status(400).json({ error: 'Title, category, and priority are required' });
    }

    const issue = {
      id: Date.now().toString(),
      title,
      description,
      category,
      priority,
      visibility: visibility || 'public',
      status: 'Reported',
      createdBy: req.user.userId,
      createdAt: new Date(),
      statusHistory: [
        { status: 'Reported', changedAt: new Date(), changedBy: req.user.userId }
      ]
    };

    issues.push(issue);

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.patch('/api/issues/:id/status', checkRole(), (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const validStatuses = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const issue = issues.find(i => i.id === id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const oldStatus = issue.status;
    issue.status = newStatus;
    issue.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      changedBy: req.user.userId
    });

    res.json({
      message: 'Issue status updated',
      issue
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// ============= ANNOUNCEMENTS ROUTES =============

app.get('/api/announcements', checkRole(), (req, res) => {
  try {
    // Filter announcements for student's hostel/block
    res.json({ announcements, total: announcements.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/announcements', checkRole('management'), (req, res) => {
  try {
    const { title, content, targetHostel, targetBlock } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = {
      id: Date.now().toString(),
      title,
      content,
      targetHostel: targetHostel || 'all',
      targetBlock: targetBlock || 'all',
      createdBy: req.user.userId,
      createdAt: new Date()
    };

    announcements.push(announcement);

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// ============= DASHBOARD ANALYTICS =============

app.get('/api/dashboard/summary', checkRole('management'), (req, res) => {
  try {
    const statusCounts = {};
    const categoryCounts = {};

    issues.forEach(issue => {
      statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
      categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
    });

    res.json({
      totalIssues: issues.length,
      totalUsers: users.length,
      totalAnnouncements: announcements.length,
      statusCounts,
      categoryCounts,
      averageResolutionTime: 'TBD'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Hostel Issue Tracking System - Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

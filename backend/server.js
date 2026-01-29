const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const issues = require('./routes/issues');
const analytics = require('./routes/analytics');
const announcements = require('./routes/announcements');
const lostItems = require('./routes/lostItems');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/issues', issues);
app.use('/api/analytics', analytics);
app.use('/api/announcements', announcements);
app.use('/api/lost-items', lostItems);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

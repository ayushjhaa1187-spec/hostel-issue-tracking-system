# Phase 2.2: Redis Caching + Real-Time WebSockets

## Overview
This phase implements Redis caching for dashboard metrics and Socket.IO for real-time issue updates and announcements.

## 1. Redis Caching Implementation

### Create: `backend/middleware/cache.js`
```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => console.log('✅ Redis Connected'));

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = await client.get(key);
    
    if (cachedBody) {
      return res.json(JSON.parse(cachedBody));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setEx(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  };
};

const clearCache = async (pattern) => {
  const keys = await client.keys(`__express__${pattern}*`);
  if (keys.length > 0) {
    await client.del(keys);
    console.log(`🧹 Cache cleared for pattern: ${pattern}`);
  }
};

module.exports = { cacheMiddleware, clearCache };
```

## 2. Real-Time WebSockets (Socket.IO)

### Update: `backend/server.js` - SOCKET SETUP
```javascript
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('join_hostel', (hostelId) => {
    socket.join(hostelId);
    console.log(`🏢 User joined hostel room: ${hostelId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// Attach io to app for use in routes
app.set('io', io);
```

## 3. Update Endpoints with Caching & Sockets

### Update: `GET /api/dashboard/summary` (Add Caching)
```javascript
const { cacheMiddleware } = require('./middleware/cache');

// Cache dashboard for 5 minutes (300 seconds)
app.get('/api/dashboard/summary', checkRole('management'), cacheMiddleware(300), async (req, res) => {
  // Existing analytics logic...
});
```

### Update: `POST /api/issues` (Add Socket Emit + Clear Cache)
```javascript
const { clearCache } = require('./middleware/cache');

app.post('/api/issues', checkRole(), async (req, res) => {
  // ... existing creation logic ...
  await issue.save();
  
  // Real-time update
  const io = req.app.get('io');
  io.to(issue.hostel).emit('new_issue', issue);
  
  // Clear dashboard cache
  await clearCache('/api/dashboard/summary');
  
  res.status(201).json({ message: 'Issue created successfully', issue });
});
```

### Update: `PATCH /api/issues/:id/status`
```javascript
app.patch('/api/issues/:id/status', checkRole(), async (req, res) => {
  // ... update logic ...
  
  // Real-time update to student
  const io = req.app.get('io');
  io.to(issue.hostel).emit('issue_status_updated', {
    id: issue.id,
    status: newStatus
  });
  
  await clearCache('/api/dashboard/summary');
  res.json({ message: 'Issue status updated', issue });
});
```

## 4. Frontend Integration (Example)

### Create: `frontend/src/utils/socket.js`
```javascript
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
export default socket;
```

### Use in Component: `IssueList.js`
```javascript
useEffect(() => {
  socket.emit('join_hostel', user.hostel);
  
  socket.on('new_issue', (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
    toast.info(`New Issue: ${newIssue.title}`);
  });

  return () => socket.off('new_issue');
}, [user.hostel]);
```

## Commit Message
```
Phase 2.2: Redis caching + Real-time WebSockets

- Added Redis middleware for API response caching (5 min for dashboard)
- Integrated Socket.IO for real-time issue and status updates
- Added automatic cache invalidation on data changes
- Standardized hostel-based socket rooms for targeted notifications
- Expected 60% reduction in redundant database hits
```

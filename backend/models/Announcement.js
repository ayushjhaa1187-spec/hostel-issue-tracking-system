// Announcement Model for Phase 2.1
// Manages hostel announcements with audience targeting

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  audience: {
    type: String,
    enum: ['ALL', 'STUDENTS', 'WARDEN', 'ADMIN'],
    default: 'ALL',
    required: true
  },
  hostel: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-Za-z0-9\s-]+$/.test(v);
      },
      message: 'Hostel name contains invalid characters'
    }
  },
  block: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-Za-z0-9\s-]+$/.test(v);
      },
      message: 'Block name contains invalid characters'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true  // Auto-creates createdAt and updatedAt
});

// Indexes for Phase 2.1 optimization
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ hostel: 1, block: 1, createdAt: -1 });
announcementSchema.index({ audience: 1, isActive: 1, createdAt: -1 });
announcementSchema.index({ priority: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);

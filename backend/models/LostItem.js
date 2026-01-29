const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Lost & Found Item Schema
const lostItemSchema = new Schema({
  // Item Information
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [3, 'Item name must be at least 3 characters'],
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  itemType: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'documents', 'clothing', 'accessories', 'keys', 'bags', 'books', 'other'],
    default: 'other'
  },
  
  // Location Information
  location: {
    building: String,
    floor: Number,
    room: String,
    area: String
  },
  lastSeenAt: {
    type: Date,
    required: true
  },
  
  // Item Details
  color: String,
  size: String,
  brand: String,
  identifyingFeatures: String,
  estimatedValue: Number,
  
  // Media
  images: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Status Management
  status: {
    type: String,
    enum: ['reported', 'claimed', 'unclaimed', 'resolved'],
    default: 'reported'
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: Date,
  claimDescription: String,
  
  // User Information
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactPhone: {
    type: String,
    required: true,
    match: [/^[\d+\-\s()]+$/, 'Please provide a valid phone number']
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  
  // Matching System
  potentialMatches: [{
    matchedWith: {
      type: Schema.Types.ObjectId,
      ref: 'LostItem'
    },
    matchScore: Number, // 0-100
    matchedAt: Date,
    reviewed: { type: Boolean, default: false }
  }],
  
  // Related Issue
  relatedIssue: {
    type: Schema.Types.ObjectId,
    ref: 'Issue',
    default: null
  },
  
  // Priority
  isPriority: {
    type: Boolean,
    default: false,
    description: 'High-value or valuable items'
  },
  
  // Metadata
  visibility: {
    type: String,
    enum: ['public', 'private', 'staff-only'],
    default: 'public'
  },
  
  // Timestamps
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  }
}, {
  timestamps: true
});

// Indexes
lostItemSchema.index({ itemName: 'text', description: 'text' });
lostItemSchema.index({ reportedBy: 1, status: 1 });
lostItemSchema.index({ status: 1, createdAt: -1 });
lostItemSchema.index({ 'timestamps.expiresAt': 1 }, { expireAfterSeconds: 0 });

// Methods

// Search for potential matches
lostItemSchema.statics.findPotentialMatches = function(lostItemId) {
  return this.findById(lostItemId).then(item => {
    if (!item) return [];
    const query = {
      _id: { $ne: lostItemId },
      itemType: item.itemType === 'lost' ? 'found' : 'lost',
      category: item.category,
      status: 'reported',
      visibility: { $in: ['public', 'staff-only'] }
    };
    return this.find(query).limit(5);
  });
};

// Calculate match score
lostItemSchema.statics.calculateMatchScore = function(item1, item2) {
  let score = 0;
  
  // Category match
  if (item1.category === item2.category) score += 40;
  
  // Color match
  if (item1.color && item2.color && item1.color.toLowerCase() === item2.color.toLowerCase()) {
    score += 20;
  }
  
  // Size match
  if (item1.size && item2.size && item1.size === item2.size) {
    score += 15;
  }
  
  // Brand match
  if (item1.brand && item2.brand && item1.brand.toLowerCase() === item2.brand.toLowerCase()) {
    score += 15;
  }
  
  // Location match
  if (item1.location?.area === item2.location?.area) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

// Claim item
lostItemSchema.methods.claimItem = function(userId, claimDescription) {
  this.claimedBy = userId;
  this.claimedAt = new Date();
  this.claimDescription = claimDescription;
  this.status = 'claimed';
  return this.save();
};

// Resolve item (mark as resolved)
lostItemSchema.methods.resolveItem = function() {
  this.status = 'resolved';
  this.timestamps.updatedAt = new Date();
  return this.save();
};

// Mark as unclaimed
lostItemSchema.methods.unclaimItem = function() {
  this.claimedBy = null;
  this.claimedAt = null;
  this.claimDescription = null;
  this.status = 'unclaimed';
  return this.save();
};

// Get display details
lostItemSchema.methods.getDisplayDetails = function() {
  return {
    id: this._id,
    itemName: this.itemName,
    itemType: this.itemType,
    description: this.description,
    category: this.category,
    lastSeenAt: this.lastSeenAt,
    status: this.status,
    images: this.images,
    reportedBy: this.reportedBy,
    contactPhone: this.contactPhone,
    contactEmail: this.contactEmail,
    location: this.location,
    createdAt: this.timestamps?.createdAt || this.createdAt
  };
};

// Pre-save middleware
lostItemSchema.pre('save', function(next) {
  this.timestamps.updatedAt = new Date();
  next();
});

// Create model
const LostItem = mongoose.model('LostItem', lostItemSchema);

module.exports = LostItem;

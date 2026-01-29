const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  status: { type: String, enum: ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Reported' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: String },
  block: { type: String },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: mongoose.Schema.Types.ObjectId
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
    
  // Enhanced Timestamps for SLA tracking
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    firstResponseAt: Date,
    resolvedAt: Date,
    closedAt: Date,
    lastModifiedAt: { type: Date, default: Date.now },
    snoozedUntil: Date
  },
  
  // SLA Management
  sla: {
    targetResolutionTime: { type: Number, default: 48 }, // hours
    actualResolutionTime: Number, // hours
    slaCompliant: { type: Boolean, default: true },
    breachReason: String,
    escalated: { type: Boolean, default: false },
    escalatedAt: Date,
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Assignment tracking
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt: Date,
  assignmentHistory: [{
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
});

// Indexes for Phase 2.1
issueSchema.index({ status: 1 });
issueSchema.index({ hostel: 1 });
issueSchema.index({ block: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ status: 1, hostel: 1, createdAt: -1 });

  // Pre-save middleware to update timestamps and calculate SLA
issueSchema.pre('save', function(next) {
  // Update lastModifiedAt
  this.timestamps.lastModifiedAt = new Date();
  
  // Calculate SLA compliance if issue is resolved
  if (this.status === 'resolved' && this.timestamps.resolvedAt) {
    const createdTime = this.timestamps.createdAt || this.createdAt;
    const resolvedTime = this.timestamps.resolvedAt;
    
    // Calculate actual resolution time in hours
    const resolutionTimeMs = resolvedTime - createdTime;
    this.sla.actualResolutionTime = Math.round(resolutionTimeMs / (1000 * 60 * 60));
    
    // Check SLA compliance
    if (this.sla.actualResolutionTime > this.sla.targetResolutionTime) {
      this.sla.slaCompliant = false;
      this.sla.breachReason = `Exceeded target resolution time by ${this.sla.actualResolutionTime - this.sla.targetResolutionTime} hours`;
    }
  }
  
  next();
});

// Method to mark first response
issueSchema.methods.markFirstResponse = function() {
  if (!this.timestamps.firstResponseAt) {
    this.timestamps.firstResponseAt = new Date();
  }
  return this.save();
};

// Method to resolve issue
issueSchema.methods.resolveIssue = function() {
  this.status = 'resolved';
  this.timestamps.resolvedAt = new Date();
  return this.save();
};

// Method to close issue
issueSchema.methods.closeIssue = function() {
  this.status = 'closed';
  this.timestamps.closedAt = new Date();
  return this.save();
};

// Method to assign issue
issueSchema.methods.assignIssue = function(userId, assignedBy) {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  this.assignmentHistory.push({
    assignedTo: userId,
    assignedAt: new Date(),
    assignedBy: assignedBy
  });
  return this.save();
};

// Method to escalate issue
issueSchema.methods.escalateIssue = function(escalateTo) {
  this.sla.escalated = true;
  this.sla.escalatedAt = new Date();
  this.sla.escalatedTo = escalateTo;
  return this.save();
};

// Static method to get SLA breach warnings
issueSchema.statics.getSLABreachWarnings = function() {
  const warningThreshold = 0.75; // 75% of target time
  
  return this.find({
    status: { $in: ['open', 'in-progress'] },
    $expr: {
      $gt: [
        { $subtract: [new Date(), '$timestamps.createdAt'] },
        { $multiply: ['$sla.targetResolutionTime', 3600000 * warningThreshold] }
      ]
    }
  });
};


module.exports = mongoose.model('Issue', issueSchema);

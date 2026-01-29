const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  status: { type: String, enum: ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Reported' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hostel: { type: String },
  block: { type: String },
  roomNumber: { type: String },
  
  // Item 3: Issue Workflow Timestamps / SLA Tracking
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String
  }],
  
  // Item 4: Duplicate Issue Management
  isDuplicate: { type: Boolean, default: false },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  
  // Item 5: Community Interaction
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Item 6: Auto-tagging / Manual Tags
  tags: [String],
  
  // Item 8: Media Upload (URLs to cloud storage)
  attachments: [String],
  
  // SLA Fields
  firstResponseAt: { type: Date },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  targetResolutionTime: { type: Number, default: 48 }, // hours
  isSLACompliant: { type: Boolean, default: true }
}, {
  timestamps: true
});

// SLA Breach Warnings
issueSchema.methods.getSLABreachWarnings = function() {
  if (this.status === 'Resolved' || this.status === 'Closed') return null;
  const hoursSinceCreated = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  if (hoursSinceCreated > this.targetResolutionTime) {
    return 'SLA Breached';
  } else if (hoursSinceCreated > this.targetResolutionTime * 0.75) {
    return 'SLA Breach Imminent';
  }
  return 'SLA Compliant';
};

module.exports = mongoose.model('Issue', issueSchema);

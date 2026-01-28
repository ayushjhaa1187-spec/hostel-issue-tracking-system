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
});

// Indexes for Phase 2.1
issueSchema.index({ status: 1 });
issueSchema.index({ hostel: 1 });
issueSchema.index({ block: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ status: 1, hostel: 1, createdAt: -1 });

module.exports = mongoose.model('Issue', issueSchema);

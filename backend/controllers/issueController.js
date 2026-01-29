const Issue = require('../models/Issue');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, visibility, hostel, block, roomNumber } = req.body;

    // Item 4: Basic Duplicate Management Check
    const existingIssue = await Issue.findOne({
      title,
      hostel,
      status: { $ne: 'Closed' },
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Check last 24h
    });

    if (existingIssue) {
      return res.status(400).json({
        success: false,
        message: 'A similar issue was recently reported. It might be a duplicate.',
        duplicateOf: existingIssue._id
      });
    }

    // Item 6: Auto-tagging logic based on keywords
    const tags = [];
    if (title.toLowerCase().includes('water')) tags.push('plumbing');
    if (title.toLowerCase().includes('light') || title.toLowerCase().includes('fan')) tags.push('electrical');
    if (title.toLowerCase().includes('wifi') || title.toLowerCase().includes('internet')) tags.push('it-support');

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      visibility,
      createdBy: req.user.id,
      hostel,
      block,
      roomNumber,
      tags,
      statusHistory: [{ status: 'Reported', changedBy: req.user.id }]
    });

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res) => {
  try {
    let query;

    // Item 9: Public/Private Toggle Logic
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      query = Issue.find();
    } else {
      // Students see public issues OR their own private issues
      query = Issue.find({
        $or: [
          { visibility: 'public' },
          { createdBy: req.user.id }
        ]
      });
    }

    const issues = await query.populate('createdBy', 'name roomNumber');
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (Staff/Admin)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Item 3: Update Timestamps and Workflow
    issue.status = status;
    issue.statusHistory.push({
      status,
      changedBy: req.user.id,
      comment
    });

    if (status === 'In Progress' && !issue.firstResponseAt) {
      issue.firstResponseAt = Date.now();
    }
    if (status === 'Resolved') {
      issue.resolvedAt = Date.now();
    }
    if (status === 'Closed') {
      issue.closedAt = Date.now();
    }

    await issue.save();
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Item 5: Community Interaction (Comments & Upvotes)
exports.addComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    issue.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await issue.save();
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    if (issue.upvotes.includes(req.user.id)) {
      issue.upvotes = issue.upvotes.filter(id => id.toString() !== req.user.id);
    } else {
      issue.upvotes.push(req.user.id);
    }

    await issue.save();
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Item 7: Assignment System
exports.assignIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, {
      assignedTo: req.body.staffId,
      status: 'Assigned'
    }, { new: true });

    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

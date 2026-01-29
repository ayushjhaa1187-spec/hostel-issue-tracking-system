const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    const { category, priority, targetAudience } = req.query;
    
    // Item 10: Announcement Filtering logic
    const filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;

    const announcements = await Announcement.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Staff/Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Not found' });
    
    await announcement.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

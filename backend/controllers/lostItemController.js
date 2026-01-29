const LostItem = require('../models/LostItem');
const User = require('../models/User');

// @desc    Report a new lost or found item
// @route   POST /api/lost-found
// @access  Private
exports.reportItem = async (req, res) => {
  try {
    const {
      itemName,
      description,
      itemType,
      category,
      location,
      lastSeenAt,
      contactPhone,
      contactEmail,
      visibility
    } = req.body;

    const newItem = new LostItem({
      itemName,
      description,
      itemType,
      category,
      location,
      lastSeenAt,
      contactPhone,
      contactEmail,
      visibility,
      reportedBy: req.user.id
    });

    const item = await newItem.save();

    // Trigger matching system (background process)
    const matches = await LostItem.findPotentialMatches(item._id);
    if (matches.length > 0) {
      item.potentialMatches = matches.map(m => ({
        matchedWith: m._id,
        matchScore: LostItem.calculateMatchScore(item, m),
        matchedAt: new Date()
      }));
      await item.save();
    }

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Report item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all lost and found items
// @route   GET /api/lost-found
// @access  Private
exports.getItems = async (req, res) => {
  try {
    const { itemType, category, status, search } = req.query;
    
    const query = { visibility: { $in: ['public', 'staff-only'] } };
    
    if (itemType) query.itemType = itemType;
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Text search if search query provided
    if (search) {
      query.$text = { $search: search };
    }

    const items = await LostItem.find(query)
      .sort({ createdAt: -1 })
      .populate('reportedBy', 'name email');

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single lost/found item
// @route   GET /api/lost-found/:id
// @access  Private
exports.getItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .populate('potentialMatches.matchedWith', 'itemName itemType status');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update lost/found item
// @route   PUT /api/lost-found/:id
// @access  Private (Owner/Staff only)
exports.updateItem = async (req, res) => {
  try {
    let item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Check ownership or staff role
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    item = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete lost/found item
// @route   DELETE /api/lost-found/:id
// @access  Private (Owner/Staff only)
exports.deleteItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Check ownership or staff role
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    await item.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Claim an item
// @route   POST /api/lost-found/:id/claim
// @access  Private
exports.claimItem = async (req, res) => {
  try {
    const { claimDescription } = req.body;
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.status !== 'reported') {
      return res.status(400).json({ success: false, message: 'Item already claimed or resolved' });
    }

    await item.claimItem(req.user.id, claimDescription);

    res.json({
      success: true,
      message: 'Claim request submitted successfully',
      data: item
    });
  } catch (error) {
    console.error('Claim item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Resolve an item status
// @route   PUT /api/lost-found/:id/resolve
// @access  Private (Owner/Staff only)
exports.resolveItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Check ownership or staff role
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to resolve this item' });
    }

    await item.resolveItem();

    res.json({
      success: true,
      message: 'Item status resolved',
      data: item
    });
  } catch (error) {
    console.error('Resolve item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's reported items
// @route   GET /api/lost-found/my-items
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const items = await LostItem.find({ reportedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get potential matches for an item
// @route   GET /api/lost-found/:id/matches
// @access  Private
exports.getItemMatches = async (req, res) => {
  try {
    const matches = await LostItem.findPotentialMatches(req.params.id);
    
    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

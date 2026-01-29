const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAnnouncements)
  .post(protect, authorize('admin', 'staff'), createAnnouncement);

router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

module.exports = router;

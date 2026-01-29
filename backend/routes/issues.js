const express = require('express');
const router = express.Router();
const {
 createIssue,
 getIssues,
 updateIssueStatus,
 addComment,
 upvoteIssue,
 assignIssue
} = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
 .post(protect, createIssue)
 .get(protect, getIssues);

router.put('/:id/status', protect, authorize('management', 'admin'), updateIssueStatus);
router.post('/:id/comments', protect, addComment);
router.put('/:id/upvote', protect, upvoteIssue);
router.put('/:id/assign', protect, authorize('admin'), assignIssue);

module.exports = router;

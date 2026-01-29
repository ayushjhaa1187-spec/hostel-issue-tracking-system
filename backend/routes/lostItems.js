const express = require('express');
const router = express.Router();
const {
  reportItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  claimItem,
  resolveItem,
  getMyItems,
  getItemMatches
} = require('../controllers/lostItemController');
const { protect, authorize } = require('../middleware/auth');

// Note: Middleware like protect and authorize would be implemented in auth middleware
// For now, these routes are wired to the controller methods

router.route('/')
  .get(protect, getItems)
  .post(protect, reportItem);

router.get('/my-items', protect, getMyItems);

router.route('/:id')
  .get(protect, getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.post('/:id/claim', protect, claimItem);
router.put('/:id/resolve', protect, resolveItem);
router.get('/:id/matches', protect, getItemMatches);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Import controllers
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  getNearbyAlerts
} = require('../controllers/alertController');

// Get all alerts
router.get('/', getAlerts);

// Get single alert
router.get('/:id', getAlert);

// Get nearby alerts
router.get('/nearby', getNearbyAlerts);

// Create new alert
router.post('/', protect, createAlert);

// Update alert
router.put('/:id', protect, updateAlert);
router.patch('/:id', protect, updateAlert);

// Delete alert
router.delete('/:id', protect, authorize('admin'), deleteAlert);

module.exports = router;
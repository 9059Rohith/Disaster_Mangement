const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reportController');

// Get all reports
router.get('/', getReports);

// Get single report
router.get('/:id', getReport);

// Create new report
router.post('/', protect, createReport);

// Update report
router.put('/:id', protect, updateReport);
router.patch('/:id', protect, updateReport);

// Delete report
router.delete('/:id', protect, deleteReport);

module.exports = router;
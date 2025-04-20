const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Import controllers
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');

// Get all resources
router.get('/', getResources);

// Get single resource
router.get('/:id', getResource);

// Create new resource
router.post('/', protect, createResource);

// Update resource
router.put('/:id', protect, updateResource);
router.patch('/:id', protect, updateResource);

// Delete resource
router.delete('/:id', protect, authorize('admin'), deleteResource);

module.exports = router;
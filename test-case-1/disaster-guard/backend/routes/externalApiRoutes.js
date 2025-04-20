// backend/routes/externalApiRoutes.js
const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'External API routes working!' });
});

module.exports = router;
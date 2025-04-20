const Alert = require('../models/Alert');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Public
const getAlerts = async (req, res) => {
  try {
    // Implement filtering, pagination and sorting if needed
    const alerts = await Alert.find().sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Public
const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const { title, description, type, severity, location, status } = req.body;
    
    // Create alert
    const alert = await Alert.create({
      title,
      description,
      type,
      severity,
      location,
      status: status || 'Active',
      createdBy: req.user.id
    });
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private
const updateAlert = async (req, res) => {
  try {
    let alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Check if user is the creator of the alert or an admin
    if (alert.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this alert' });
    }
    
    alert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(alert);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private/Admin
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    await alert.remove();
    
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get nearby alerts based on geolocation
// @route   GET /api/alerts/nearby
// @access  Public
const getNearbyAlerts = async (req, res) => {
  try {
    const { lng, lat, distance = 10 } = req.query;
    
    // Convert distance from kilometers to meters
    const radius = distance * 1000;
    
    if (!lng || !lat) {
      return res.status(400).json({
        message: 'Please provide longitude and latitude coordinates'
      });
    }
    
    // Find alerts within the given radius using geospatial query
    const alerts = await Alert.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius
        }
      }
    });
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  getNearbyAlerts
};
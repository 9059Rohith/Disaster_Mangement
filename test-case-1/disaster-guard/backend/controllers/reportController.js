const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    // Add filtering
    const filter = {};
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.alert) {
      filter.relatedAlert = req.query.alert;
    }
    
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('relatedAlert');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { title, description, type, location, media, relatedAlert } = req.body;
    
    // Create report
    const report = await Report.create({
      title,
      description,
      type,
      location,
      media: media || [],
      relatedAlert,
      createdBy: req.user.id
    });
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is the creator of the report or an admin/responder
    if (
      report.createdBy.toString() !== req.user.id && 
      req.user.role !== 'admin' &&
      req.user.role !== 'responder'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }
    
    report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is the creator of the report or an admin
    if (report.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    await report.remove();
    
    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
};
const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    required: [true, 'Please specify the alert type'],
    enum: ['Earthquake', 'Flood', 'Fire', 'Hurricane', 'Tornado', 'Other']
  },
  severity: {
    type: String,
    required: [true, 'Please specify the severity'],
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Resolved', 'Monitoring'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
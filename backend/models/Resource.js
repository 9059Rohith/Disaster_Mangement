const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  type: {
    type: String,
    required: [true, 'Please specify the resource type'],
    enum: ['Food', 'Water', 'Shelter', 'Medical', 'Equipment', 'Other']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify the quantity']
  },
  unit: {
    type: String,
    required: [true, 'Please specify the unit of measurement']
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
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Depleted'],
    default: 'Available'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
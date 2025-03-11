const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true }, // Added full name
    idNumber: { type: String, required: true, unique: true },
    idAttachment: { type: String, required: true }, // File path for ID
    contactAddress: { type: String, required: true },
    pinNumber: { type: String, required: true },
    pinAttachment: { type: String, required: true }, // File path for PIN
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    block: String,
    roadStreet: String,
    plotNumber: String,
    ownerName: String,
    sizeRequired: String,
    dateRequired: Date,
    consumerCategory: {
      type: String,
      enum: [
        'Domestic',
        'Residential',
        'Multi-Dwelling Units',
        'Gated Communities',
        'Commercial',
        'Industrial',
        'Government',
        'Institutional',
        'Water Kiosks',
      ],
      default: 'Domestic',
    },
    sanitationMethod: {
      type: String,
      enum: ['M', 'P', 'N', 'U'],
      default: 'M',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);

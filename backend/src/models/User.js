const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    idAttachment: { type: String, required: true }, // File path for ID
    contactAddress: { type: String, required: true },
    pinNumber: { type: String, required: true, required: true },
    pinAttachment: { type: String, required: true }, // File path for PIN
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    block: String,
    roadStreet: String,
    plotNumber: String,
    ownerName: String,
    sizeRequired: String,
    dateRequired: Date,
    consumerCategory: String,
    sanitationMethod: { type: String, enum: ['M', 'P', 'N', 'U'] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based authentication
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);

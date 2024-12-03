// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'lecturer'], required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User ', userSchema);
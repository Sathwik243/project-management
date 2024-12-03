const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String, required: true },
  attachment: { type: String },
  parentMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // For replies
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);


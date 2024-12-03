// messageRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique file name
  }
});

const upload = multer({ storage: storage });

// Middleware to check token and authorization
const verifyToken = require('../middleware/auth');

// Serve static files from the "uploads" folder
router.use('/uploads', express.static('uploads'));

// Route to send a new message with a file
router.post('/send', verifyToken, upload.single('attachment'), async (req, res) => {
  try {
    console.log(req.body);
    const { recipientId, messageText } = req.body;
    let attachment = null;

    // If a file is uploaded, attach its filename
    if (req.file) {
      attachment = req.file.path; // Store the file path
    }

    const newMessage = new Message({
      senderId: req.user.userID,
      recipientId,
      messageText,
      attachment, // Include the file path
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Route to reply to a message with a file
router.post('/reply', verifyToken, upload.single('attachment'), async (req, res) => {
  try {
    const { parentMessageId, recipientId, messageText } = req.body;
    let attachment = null;

    // If a file is uploaded, attach its filename
    if (req.file) {
      attachment = req.file.path; // Store the file path
    }

    const parentMessage = await Message.findById(parentMessageId);

    const replyMessage = new Message({
      senderId: req.user.userID,
      recipientId,
      messageText,
      attachment, // Include the file path
      parentMessageId,
    });

    await replyMessage.save();
    res.status(201).json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply' });
  }
});

// Route to get received messages
router.get('/received', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ recipientId: req.user.userID })
      .populate('senderId', 'username') // Populate sender details
      .exec();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});


module.exports = router;

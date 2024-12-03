// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Import the auth middleware
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { userID, email, password, role } = req.body;

  try {
    // Check if a user with the same userID and role already exists
    const existingUser = await User.findOne({ userID, role });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this role already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      userID,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// Login User
router.post('/login', async (req, res) => {
  const { userID, password,role } = req.body;


  const user = await User.findOne({ userID });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

 
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(user);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.userID, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
  
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});



router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find({ userIDid: { $ne: req.user.userID } }).select('username userID');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


module.exports = router;
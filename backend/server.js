const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const path = require('path');
const app = express();
const registerRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');
const studentRouter = require('./routes/studentRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', registerRouter);
app.use('/api/projects', projectRouter);
app.use('/api/students',studentRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/api/messages', messageRoutes);



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
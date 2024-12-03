const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth'); 
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
router.get('/search', auth, async (req, res) => {
    const { query } = req.query; // Getting search term from query string
  
    // Check if query is less than 3 characters
    if (!query || query.length < 3) {
      return res.status(400).json({ message: 'Search query must be at least 3 characters long' });
    }
  
    try {
      // Perform a search across multiple fields
      const projects = await Project.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },  // Case-insensitive match
          { keyWords: { $in: [query] } },               // Match query as a keyword
          { overview: { $regex: query, $options: 'i' } },
          { objectives: { $regex: query, $options: 'i' } }
        ]
      });
      console.log(projects.length);
  
      // Return matching projects
      if (projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }
  
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Error searching projects:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;

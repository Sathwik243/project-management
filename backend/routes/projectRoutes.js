
const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth'); 
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');  // Import User model


// Create a new project
router.post('/',auth,  async (req, res) => {
  const {projectId, title, topicArea, keyWords, overview, objectives } = req.body;
  console.log(req.user);
  console.log("1");
  const lecturerId = req.user.userID;
  const project = new Project({projectId, title, topicArea, keyWords, overview, objectives, lecturerId });

  try {
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();

// Then, for each project, get the lecturer info using the lecturerId (which is a number)
const projectWithLecturerInfo = await Promise.all(
  projects.map(async (project) => {
    const lecturer = await User.findOne({ userID: project.lecturerId });  // Find lecturer by their ID (which is a number)
    project.lecturer = lecturer; // Add lecturer data to project
    return project;
  })
);
res.json(projectWithLecturerInfo);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

//For Specific Lecturer Projects
router.get('/my-projects', auth, async (req, res) => {
  try {
    // Get the lecturer's ID from the decoded token
    const lecturerId = req.user.userID;

    // Find all projects where lecturerId matches the current lecturer
    const projects = await Project.find({ lecturerId });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this lecturer' });
    }
    res.json(projects);  // Return the list of projects
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  const projectId = req.params.id;

  try {
      // Fetch the project by ID from the database
      const project = await Project.find({projectId});

      if (!project) {
          return res.status(404).json({ error: 'Project not found' });
      }

      // Respond with the project data
      res.status(200).json(project);
  } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a project by ID
router.put('/:projectId', auth, async (req, res) => {
  const { projectId } = req.params;  // Get the projectId from the URL
  const { title, topicArea, keyWords, overview, objectives } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findOne({projectId});

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the logged-in user (lecturer) is the owner of the project
    if (String(project.lecturerId) !== String(req.user.userID)) {
      return res.status(403).json({ message: 'Access denied: You are not the owner of this project' });
    }

    // Update the project details
    project.title = title || project.title;
    project.topicArea = topicArea || project.topicArea;
    project.keyWords = keyWords || project.keyWords;
    project.overview = overview || project.overview;
    project.objectives = objectives || project.objectives;

    // Save the updated project
    await project.save();

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//Delete the Project 
router.delete('/:projectId', auth, async (req, res) => {
  const { projectId } = req.params;  // Get projectId from the request parameters

  try {
    // Find the project by projectId
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the lecturerId from the token matches the lecturerId in the project
    if (project.lecturerId.toString() !== String(req.user.userID)) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    // Delete the project if the lecturer IDs match
    await Project.findOneAndDelete({ projectId });

    res.status(200).json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project', error });
  }
});




// Search Projects Endpoint
router.get('/projects/search', auth, async (req, res) => {
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
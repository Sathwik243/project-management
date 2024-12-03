// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: Number, required: true},
  title: { type: String, required: true },
  topicArea: { type: String, required: true },
  keyWords: { type: [String], required: true },
  overview: { type: String, required: true },
  objectives: { type: String, required: true },
  lecturerId: { type: Number, reuired:true } ,
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);


module.exports = mongoose.model('Project', projectSchema);
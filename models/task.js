const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  additionalFields: {
    type: Object
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

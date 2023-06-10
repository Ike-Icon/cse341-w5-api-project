const Task = require('../models');

// Function to get all tasks from the database
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to create a new task
const createTask = async (req, res) => {
  const { title, assignedTo, description, status, priority, deadline, additionalFields } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ message: 'assignedTo field is required' });
  }

  try {
    // Find the user by name
    const user = await user.findOne({ name: assignedTo });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const task = new Task({
        title: title,
        assignedTo: user.name,
        description: description,
        status: status,
        priority: priority,
        deadline: deadline,
        additionalFields: additionalFields
      });

      const savedTask = await task.save();

      res.status(201).json({ message: 'Task created successfully', task: savedTask });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a task by the user assigned to it
const deleteTask = async (req, res) => {
  try {
    const taskAssignedTo = req.params.assignedTo;
    const response = await Task.deleteOne({ assignedTo: taskAssignedTo });

    if (response.deletedCount > 0) {
      res.status(204).send({ message: 'Task deleted successfully' });
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the task.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask
};

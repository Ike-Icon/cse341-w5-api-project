const mongodb = require('../db/connect');
// const ObjectId = require('mongodb').ObjectId;

// Function to get all tasks from the database
const getAllTasks = async (req, res) => {
  try {
    const result = await mongodb.getDb().db('task_mgt_sys').collection('tasks').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
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
    const task = {
      title: title,
      assignedTo: '',
      description: description,
      status: status,
      priority: priority,
      deadline: deadline,
      additionalFields: additionalFields
    };

    // Find the user by name
    const user = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .findOne({ name: assignedTo });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      task.assignedTo = user.name; // Assign the task to the user

      const response = await mongodb.getDb().db('task_mgt_sys').collection('tasks').insertOne(task);

      if (response.acknowledged) {
        res.status(201).json({ message: 'Task created successfully' });
      } else {
        res.status(500).json(response.error || 'Some error occurred while creating the task.');
      }
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
    const response = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('tasks')
      .deleteOne({ assignedTo: taskAssignedTo });
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send({ message: 'Task created successfully' });
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

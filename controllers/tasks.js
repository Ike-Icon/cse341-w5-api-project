const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

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
  try {
    const { title, description, status, priority, deadline, assignedTo, additionalFields } = req.body;

    const user = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .findOne({ _id: new ObjectId(assignedTo) });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const task = {
      title,
      description,
      status,
      priority,
      deadline,
      assignedTo: {
        id: user._id,
        name: user.name
      },
      additionalFields
    };

    const response = await mongodb.getDb().db('task_mgt_sys').collection('tasks').insertOne(task);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Task created successfully' });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the task.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask
};

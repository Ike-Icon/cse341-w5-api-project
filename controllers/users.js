const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Function to get all users from the database
const getAllUsers = async (req, res) => {
  try {
    const result = await mongodb.getDb().db('task_mgt_sys').collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get a single user data from the database by its id
const getSingleUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .findOne({ _id: userId });
    if (!result) {
      res.status(404).json({ message: 'Object not found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to create a new user and associate tasks
const createUser = async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      department: req.body.department,
      joinDate: req.body.joinDate,
      additionalFields: {
        contactNumber: req.body.contactNumber,
        profilePicture: req.body.profilePicture
      }
    };

    const tasks = req.body.tasks; // Assuming tasks are provided in the request body

    // Create a new user and associate tasks
    const response = await mongodb.getDb().db('task_mgt_sys').collection('users').insertOne(user);

    if (response.acknowledged) {
      const insertedUserId = response.insertedId;
      const taskResponse = await mongodb
        .getDb()
        .db('task_mgt_sys')
        .collection('tasks')
        .updateMany(
          { _id: { $in: tasks.map((taskId) => new ObjectId(taskId)) } },
          { $set: { assignedTo: insertedUserId } }
        );

      if (taskResponse.acknowledged) {
        res.status(201).json({ message: 'User created successfully' });
      } else {
        res.status(500).json({ message: 'Error occurred while associating tasks with the user' });
      }
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the user.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser
};

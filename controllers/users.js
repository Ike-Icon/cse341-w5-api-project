const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// function to get all users from the database
const getAllUsers = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db('cse341')
      .collection('users_data')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// function to get a single user data from the database by its id
const getSingleUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db('cse341')
      .collection('users_data')
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


// Post now user to the database
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
        profilePicture: req.body.profilePicture,
      },
    };
    const response = await mongodb
      .getDb()
      .db('cse341')
      .collection('users_data')
      .insertOne(user);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(500)
        .json(response.error || 'Some error occurred while creating the user.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// function to update or put an object in the database collection
const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      department: req.body.department,
      joinDate: req.body.joinDate,
      additionalFields: {
        contactNumber: req.body.contactNumber,
        profilePicture: req.body.profilePicture,
      },
    };
    const response = await mongodb
      .getDb()
      .db('cse341')
      .collection('users_data')
      .replaceOne({ _id: userId }, user);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || 'Some error occurred while updating the user.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// function to delete user or collect from the database 
const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('cse341')
      .collection('users_data')
      .deleteOne({ _id: userId });
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || 'Some error occurred while deleting the contact.'
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};

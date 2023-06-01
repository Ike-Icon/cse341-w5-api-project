const mongodb = require('../db/connect');
const passwordUtil = require('../util/passwordUtil');

// Login function
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify the password
    const isPasswordValid = await passwordUtil.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    // Login successful
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    const userName = req.params.name;
    const result = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .findOne({ name: userName });

    if (!result) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to create a new user without associating tasks
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

    // Validate password
    const isPasswordValid = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(isPasswordValid);
    if (passwordCheck.error) {
      res.status(400).json({ message: passwordCheck.error });
      return;
    }

    const response = await mongodb.getDb().db('task_mgt_sys').collection('users').insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the user.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userName = req.params.name;

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

    // Validate password
    const isPasswordValid = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(isPasswordValid);
    if (passwordCheck.error) {
      res.status(400).json({ message: passwordCheck.error });
      return;
    }

    const response = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .replaceOne({ name: userName }, user);

    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Some error occurred while updating the user.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userName = req.params.name;
    const response = await mongodb
      .getDb()
      .db('task_mgt_sys')
      .collection('users')
      .deleteOne({ name: userName });

    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send({ message: 'User deleted successfully' });
    } else {
      res.status(500).json({ message: 'Some error occurred while deleting the user.' });
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
  logIn
};

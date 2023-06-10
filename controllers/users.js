const User = require('../models');
const passwordUtil = require('../util/passwordUtil');
const passport = require('passport');

// Login function
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });

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

const logInWithGoogle = (req, res, next) => {
  // Use Passport.js middleware to authenticate the user
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const logInCallback = (req, res, next) => {
  // Redirect callback route after successful authentication
  passport.authenticate('google', { failureRedirect: '/dashboard' })(req, res, next);
};

// Function to get all users from the database
const getAllUsers = async (req, res) => {
  try {
    const result = await User.find();
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
    const result = await User.findOne({ name: userName });

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
    const { name, email, password, role, department, joinDate, contactNumber, profilePicture } =
      req.body;

    // Validate password
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).json({ message: passwordCheck.error });
      return;
    }

    const user = new User({
      name,
      email,
      password,
      role,
      department,
      joinDate,
      additionalFields: {
        contactNumber,
        profilePicture
      }
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userName = req.params.name;
    const { name, email, password, role, department, joinDate, contactNumber, profilePicture } =
      req.body;

    // Validate password
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).json({ message: passwordCheck.error });
      return;
    }

    const user = await User.findOne({ name: userName });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.department = department;
    user.joinDate = joinDate;
    user.additionalFields.contactNumber = contactNumber;
    user.additionalFields.profilePicture = profilePicture;

    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userName = req.params.name;
    const user = await User.findOne({ name: userName });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.remove();

    res.status(204).send({ message: 'User deleted successfully' });
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
  logIn,
  logInWithGoogle,
  logInCallback
};

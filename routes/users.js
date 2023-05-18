const express = require('express');
const router = express.Router();

const usersData = require('../controllers/users');

router.get('/', usersData.getAllUsers);

router.get('/:id', usersData.getSingleUser);

router.post('/', usersData.createUser);

module.exports = router;
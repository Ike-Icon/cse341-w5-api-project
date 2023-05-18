const express = require('express');
const router = express.Router();

const usersData = require('../controllers/users');

router.get('/', usersData.getAllUsers);

router.get('/:id', usersData.getSingleUser);

router.post('/', usersData.createUser);

router.put('/:id', usersData.updateUser);

router.delete('/:id', usersData.deleteUser);

module.exports = router;
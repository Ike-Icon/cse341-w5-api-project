const express = require('express');
const router = express.Router();

const usersData = require('../controllers/users');

router.get('/', usersData.getAllUsers);

router.get('/:name', usersData.getSingleUser);

router.post('/', usersData.createUser);

router.put('/:name', usersData.updateUser);

router.delete('/:name', usersData.deleteUser);

module.exports = router;

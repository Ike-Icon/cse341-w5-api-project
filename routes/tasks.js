const express = require('express');
const router = express.Router();

const tasksData = require('../controllers/tasks');

router.get('/', tasksData.getAllTasks);

// router.get('/:id', tasksData.getSingleUser);

router.post('/', tasksData.createTask);

router.delete('/:assignedTo', tasksData.deleteTask);

module.exports = router;
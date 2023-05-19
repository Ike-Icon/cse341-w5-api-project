const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const tasksData = require('../controllers/tasks');

// Define your GraphQL schema
const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    assignedTo: String!
    description: String
    status: String
    priority: String
    deadline: String
    additionalFields: String
  }

  type Query {
    getAllTasks: [Task]
  }

  type Mutation {
    createTask(title: String!, assignedTo: String!): Task
    deleteTask(assignedTo: String!): Boolean
  }
`);

// Define your resolver functions
const root = {
  getAllTasks: tasksData.getAllTasks,
  createTask: tasksData.createTask,
  deleteTask: tasksData.deleteTask
};

// Create the Express router
const router = express.Router();

// Set up the GraphQL endpoint
router.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true // Enable GraphiQL for testing the API
  })
);

module.exports = router;

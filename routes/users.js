const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const usersData = require('../controllers/users');

// Define your GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: String!
    department: String!
    joinDate: String!
    contactNumber: String
    profilePicture: String
  }

  type Query {
    getAllUsers: [User]
    getSingleUser(name: String!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, role: String!, department: String!, joinDate: String!, contactNumber: String, profilePicture: String): User
  }
`);

// Define your resolver functions
const root = {
  getAllUsers: usersData.getAllUsers,
  getSingleUser: usersData.getSingleUser,
  createUser: usersData.createUser
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

const { ApolloServer, UserInputError, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Person = require('./DBSchema/personSchema');
let persons = require('./db');
const typeDefs = require('./graphQLSchema/typeDefs');
const resolvers = require('./graphQLSchema/resolvers');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => console.log('error connecting to MongoDB', err, message));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Person,
  },
});
const url = 'http://localhost:4000/';
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

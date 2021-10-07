const { ApolloServer, UserInputError, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Person = require('./DBSchema/personSchema');
let persons = require('./db');
const typeDefs = require('./graphQLSchema/typeDefs');
const resolvers = require('./graphQLSchema/resolvers');
require('dotenv').config();
console.log(process.env.MONGODB_URL);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    persons,
  },
});
const url = 'http://localhost:4000/';
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

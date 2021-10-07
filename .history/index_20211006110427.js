const { ApolloServer, UserInputError, gql } = require('apollo-server');
let persons = require('./db');
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

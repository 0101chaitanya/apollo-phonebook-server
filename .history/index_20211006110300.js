const { ApolloServer, UserInputError, gql } = require('apollo-server');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const url = 'http://localhost:4000/';
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

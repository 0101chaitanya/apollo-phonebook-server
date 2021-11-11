const { ApolloServer, UserInputError, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Person = require('./DBSchema/personSchema');
const jwt = require('jsonwebtoken');

const User = require('./DBSchema/userSchema');
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
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      console.log(decodedToken, User);
      const currentUser = await User.findById(decodedToken.id).populate(
        'friends'
      );

      return { currentUser };
    }
  },
  dataSources: () => ({
    User,
    Person,
  }),
});
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);

  console.log(`Subscriptions at ${subscriptionsUrl}`);
});

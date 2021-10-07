const { v4: uuidv4 } = require('uuid');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const resolvers = {
  Query: {
    personCount: async (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      await Person.collection.countDocuments();
    },
    allPersons: async (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      if (!args.phone) {
        return await Person.find({});
      }
      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: async (parent, { name }, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      await Person.findOne({ name });
    },
    me: (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      return currentUser;
    },
  },
  Mutation: {
    addAsFriend: async (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;
      const FriendAlready = (person) => {
        console.log(person.id, currentUser.friends);

        return currentUser.friends
          .map((f) => f.id)
          .some((f) => {
            console.log(f.id, person.id);
            return f.id === person.id;
          });
      };
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      console.log(User);
      const person = await Person.findOne({ name: args.name });
      const not = !FriendAlready(person);
      console.log(not);
      if (not) {
        currentUser.friends = currentUser.friends.concat(person);
      }
      await currentUser.save();
      return currentUser;
    },

    addPerson: async (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      const person = new Person({ ...args });

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      try {
        const saved = await person.save();
        currentUser.friends = currentUser.concat(person);
        await currentUser.save();
        return saved;
      } catch (e) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editNumber: async (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      try {
        const person = await Person.findOneAndUpdate(
          { name: args.name },
          { phone: args.phone },
          {
            new: true,
          }
        );
        return person;
      } catch (e) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: async (parent, { username }, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      const user = new User({ username });
      try {
        return await user.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args.username,
        });
      }
    },
    login: async (parent, { password, username }, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      const user = await User.findOne({ username });
      if (!user || password !== process.env.SECRET) {
        throw new UserInputError('wrong credentials');
      }
      const userForToken = {
        username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Person: {
    address: (parent, args, context) => {
      const { dataSources, currentUser } = context;
      const { User, Person } = dataSources;

      return {
        street: parent.street,
        city: parent.city,
      };
    },
  },
};

module.exports = resolvers;

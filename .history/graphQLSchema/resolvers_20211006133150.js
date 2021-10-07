const { v4: uuidv4 } = require('uuid');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const resolvers = {
  Query: {
    personCount: async (parent, args, { Person }) =>
      await Person.collection.countDocuments(),
    allPersons: async (parent, args, { Person }) => {
      if (!args.phone) {
        return await Person.find({});
      }
      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: async (parent, { name }, { Person }) =>
      await Person.findOne({ name }),
    me: (parent, args, { currentUser, Person }) => currentUser,
  },
  Mutation: {
    addAsFriend: async (parent, args, context) => {
      const { Person, currentUser } = context;
      const nonFriendAlready = (person) => {
        return !currentUser.friends.map((f) => f._id).includes(person._id);
      };
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      console.log(context);
      const person = await Person.findOne({ name: args.name });
      if (nonFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person);
      }
      await currentUser.save();
      return currentUser;
    },

    addPerson: async (parent, args, { Person, currentUser }) => {
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
    editNumber: async (parent, args, { Person }) => {
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
    createUser: async (parent, { username }, { Person, User }) => {
      const user = new User({ username });
      try {
        return await user.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args.username,
        });
      }
    },
    login: async (parent, { password, username }, { Person, User }) => {
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
    address: (parent, args, { Person }) => {
      return {
        street: parent.street,
        city: parent.city,
      };
    },
  },
};

module.exports = resolvers;

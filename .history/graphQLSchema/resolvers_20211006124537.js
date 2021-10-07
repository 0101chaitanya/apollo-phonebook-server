const { v4: uuidv4 } = require('uuid');
const { UserInputError } = require('apollo-server');
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
  },
  Mutation: {
    addPerson: async (parent, args, { Person }) => {
      const person = new Person({ ...args });
      try {
        return await person.save();
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
    login: async(parent, { username }, { Person, User })=>{

      const user= await user.findOne({ username });
      if(!user || args.password !== process.env.SECRET) {

        throw new UserInputError("wrong credentials");
      }
    const userForToken = {
      username,
      id : user._id,
    }
    }
    return {value : jwt.sign(userForToken, process.env.JWT_SECRET) }
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

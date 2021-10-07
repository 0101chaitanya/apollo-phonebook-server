const { v4: uuidv4 } = require('uuid');

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
      await Person.findOne({ name: args.name }),
  },
  Mutation: {
    addPerson: (parent, args, { Person }) => {
      const person = new Person({ ...args });
      return person.save();
    },
    editNumber: async (parent, args, { Person }) => {
      const person = await Person.findOneAndUpdate(
        { name: args.name },
        { phone: args.phone },
        {
          new: true,
        }
      );
      return person;
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

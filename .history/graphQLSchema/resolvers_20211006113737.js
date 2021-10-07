const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    personCount: (parent, args, { Person }) =>
      Person.collection.countDocuments(),
    allPersons: (parent, args, { Person }) => {
      if (!args.phone) {
        return Person.find({});
      }
      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: (parent, { name }, { Person }) =>
      Person.findOne({ name: args.name }),
  },
  Mutation: {
    addPerson: (parent, args, { Person }) => {
      const person = new Person({ ...args });
      return person.save();
    },
    editNumber: async (parent, args, { Person }) => {
      let doc = await Character.findOneAndUpdate(filter, update, {
        new: true,
      });
      doc.name;
      doc.age;
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

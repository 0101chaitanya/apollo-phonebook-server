const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    personCount: (parent, args, { persons }) => persons.length,
    allPersons: (parent, args, { persons }) => {
      if (!args.phone) {
        return persons;
      }
      return persons.filter((person) =>
        args.phone === 'YES' ? person.phone : !person.phone
      );
    },
    findPerson: (parent, { name }, { persons }) =>
      persons.find((p) => p.name === name),
  },
  Mutation: {
    addPerson: (parent, args, { persons }) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuidv4() };
      persons = persons.push(person);
      return person;
    },
    editNumber: (parent, args, { persons }) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (personIndex < 0) {
        throw new UserInputError("Person doesn't exist");
      }

      persons.splice(personIndex, 1, {
        ...persons[personIndex],
        phone: args.phone,
      });
      return persons.find((p) => p.phone === args.phone);
    },
  },
  Person: {
    address: (parent, args, { persons }) => {
      return {
        street: parent.street,
        city: parent.city,
      };
    },
  },
};

module.exports = resolvers;

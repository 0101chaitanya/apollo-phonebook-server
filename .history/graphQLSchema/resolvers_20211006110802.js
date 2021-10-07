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
      persons = persons.concat(person);
      return person;
    },
    editNumber: (parent, args, { persons }) => {
      const person = persons.find((p) => p.name === args.name);
      if (!person) {
        throw new UserInputError("Person doesn't exist");
      }
      const updatedPerson = { ...person, phone: args.phone };
      persons = persons.map((p) => (p.name === args.name ? updatedPerson : p));
      return updatedPerson;
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

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (parent, args) => {
      if (!args.phone) {
        return persons;
      }
      return persons.filter((person) =>
        args.phone === 'YES' ? person.phone : !person.phone
      );
    },
    findPerson: (root, { name }) => persons.find((p) => p.name === name),
  },
  Mutation: {
    addPerson: (parent, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuidv4() };
      persons = persons.concat(person);
      return person;
    },
    editNumber: (parent, args) => {
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
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

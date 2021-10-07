const { ApolloServer, UserInputError, gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
];

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Person {
    name: String!
    phone: String
    address: Address
    id: ID!
  }

  type Address {
    street: String!
    city: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`;

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const url = 'http://localhost:4000/';
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const { ApolloServer, gql } = require('apollo-server');

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
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }

type Mutation {
  addPerson( name: String!
    phone: String
    address: Address
  )
} : Person

`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, { name }) => persons.find((p) => p.name === name),
  },
  Person: {
    address: (parent) => {
      return {
        street: parent.street,
        city: parent.city,
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
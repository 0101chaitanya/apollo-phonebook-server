const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    username: string
    friends: [Person!]!
    id: ID!
  }

  type token {
    value: string!
  }

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
    ma: User
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
    ): Person!
    editNumber(name: String!, phone: String!): Person!
  }
`;
module.exports = typeDefs;

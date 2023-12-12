const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createBook(title: String!, author: String!): Book!
  }
`;

module.exports = typeDefs;
const { User, Book } = require('../models');

const resolvers = {
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id),
    books: () => Book.find(),
    book: (_, { id }) => Book.findById(id),
  },
  Mutation: {
    createUser: (_, { name, email }) => User.create({ name, email }),
    createBook: (_, { title, author }) => Book.create({ title, author }),
  },
};

module.exports = resolvers;
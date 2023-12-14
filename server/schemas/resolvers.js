const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      if (!user) throw new AuthenticationError("You need to be logged in!");
      console.log("Fetching data for user:", user._id); // Add this line for debugging
      return User.findById(user._id)
        .select("-__v -password")
        .populate("savedBooks");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user)
        throw new AuthenticationError("No user found with this email address");
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError("Incorrect password");
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, { user }) => {
      if (!user) throw new AuthenticationError("You need to be logged in!");

      // Validate input fields
      // Providing a default description if it's undefined
      if (!input.description) {
        input.description = "Description not available";
      }
      if (!input.title || input.title.trim() === "") {
        throw new Error("Book title is required.");
      }

      try {
        console.log("Saving book for user:", user._id, "Book input:", input);
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        ).populate("savedBooks");
        return updatedUser;
      } catch (err) {
        console.error("Error in saveBook mutation:", err);
        throw new Error("Error saving the book");
      }
    },
    removeBook: async (parent, { bookId }, { user }) => {
      if (!user) throw new AuthenticationError("You need to be logged in!");
      return User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;

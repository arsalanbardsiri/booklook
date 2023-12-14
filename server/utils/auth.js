require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const secret = process.env.SECRET;
const expiration = '2h';

module.exports = {
  authMiddleware: async (context) => {
    let token;
    if (context.req) {
      // Extract the token from the incoming request
      token = context.req.body.token || context.req.query.token || context.req.headers.authorization;

      if (context.req.headers.authorization) {
        token = token.split(' ').pop().trim();
        console.log("Extracted Token:", token); // Debugging
      }
    }

    if (!token) {
      console.log('No token found');
      return context;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Token data:', data); // Debugging
      const user = await User.findById(data._id);
      if (user) {
        console.log('User found:', user); // Debugging
        context.req.user = user;
      } else {
        console.log('User not found with id:', data._id);
      }
    } catch (err) {
      console.error('Invalid token', err.message);
    }

    return context;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;
const expiration = '2h';

module.exports = {
  authMiddleware: function (context) {
    let token;
    if (context.req) {
      // Extract the token from the incoming request
      token = context.req.body.token || context.req.query.token || context.req.headers.authorization;

      if (context.req.headers.authorization) {
        token = token.split(' ').pop().trim();
      }
    }

    if (!token) {
      return context;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return context;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

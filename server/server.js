const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-html');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Pass the request object to the context
    return { req: authMiddleware({ req }) };
  },
});

// Start Apollo Server
server.start().then(res => {
  // Apply Apollo Server as a middleware to the Express application
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static assets if in production environment
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Serve React application for any other requests in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

  // Serve GraphQL Playground at /playground
  app.get('/playground', (req, res) => {
    res.send(expressPlayground({ endpoint: '/graphql' }));
  });

  // Serve React application for any other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  // Connect to the database
  db.once('open', () => {
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      // If you're using an Apollo Server version with built-in GraphQL IDE
      console.log(`GraphQL IDE at http://localhost:${PORT}/graphql`);
    });
  });
});

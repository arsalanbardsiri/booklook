import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Environment variable for the API URL
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: `${apiURL}/graphql`, // Dynamically set the GraphQL server URI
});
// Middleware to attach the token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // replace with your server's URI
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/*app components */}
    </ApolloProvider>
  );
}

export default App;
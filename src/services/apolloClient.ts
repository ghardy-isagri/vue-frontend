import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

// HTTP link to GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:9090/',
})

// Apollo Client instance
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default apolloClient

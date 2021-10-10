import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/smartcookie0501/jetswap-subgraph-polygon',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export default client

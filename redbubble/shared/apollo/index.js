/* eslint-disable no-underscore-dangle */
import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { toIdValue } from 'apollo-utilities';
import fragmentTypes from './fragmentTypes.json';

import config from '../../config';
import recommendedInventoryItemsCacheKey from '../../server/middleware/resolvers/fetchSimilarInventoryItems/recommendedInventoryItemsCacheKey';

import createStateLink from './stateLink';

function createApolloClient(clientOptions, initialState) {
  const dataIdFromObject = (result) => {
    if (result.__typename === 'inventory_InventoryItemsItem' && result.id && result.productPageUrl) {
      return `${result.__typename}${result.id}${result.productPageUrl}`;
    }
    return result.id && result.__typename ? `${result.__typename}${result.id}` : null;
  };

  const cache = new InMemoryCache({
    addTypename: true,
    // DataIdFromObject is used by Apollo to identify unique entities from
    // your queries.
    //
    // you might see o => o.id commonly with Apollo.
    // If the IDs are only unique per type (this is typical if an ID is just an
    // ID out of a database table), you can use the `__typename` field to scope it.
    // This is a GraphQL field that's automatically available, but you do need
    // to query for it also.
    dataIdFromObject,
    cacheRedirects: {
      Query: {
        lists_inclusions: (_, { input }, { getCacheKey }) => {
          const cacheKeys = input.items.map(({ entityId, entityType }) => {
            return getCacheKey({
              __typename: 'lists_Inclusion',
              id: `${entityType}_${entityId}`,
            });
          });

          return cacheKeys;
        },
        inventory_categorySet: (_, { categoryId, workId }, { getCacheKey }) => {
          return getCacheKey({
            __typename: 'inventory_CategorySet',
            id: `${workId}_${categoryId}`,
          });
        },
        reviewSet: (_, { inventoryItemId }, { getCacheKey }) => {
          const [, productTypeId] = inventoryItemId.split('_');

          return getCacheKey({
            __typename: 'ReviewSet',
            id: `ReviewSet_${productTypeId}`,
          });
        },
        reviewSummary: (_, { inventoryItemId }, { getCacheKey }) => {
          const [, productTypeId] = inventoryItemId.split('_');

          return getCacheKey({
            __typename: 'ReviewSummary',
            id: `ReviewSummary_${productTypeId}`,
          });
        },
        artistInventoryItemPortfolio: (_, args, { getCacheKey }) => {
          if (!args.inventoryItemId) return null;
          const id = recommendedInventoryItemsCacheKey('artistInventoryItemPortfolio', args);

          return getCacheKey({
            __typename: 'RecommendedInventoryItems',
            id,
          });
        },
        licensedInventoryItems: (_, args, { getCacheKey }) => {
          if (!args.inventoryItemId) return null;
          const id = recommendedInventoryItemsCacheKey('licensedInventoryItems', args);

          return getCacheKey({
            __typename: 'RecommendedInventoryItems',
            id,
          });
        },
        guru_similarDesigns: (_, { inventoryItemId }, { getCacheKey }) => {
          if (!inventoryItemId) return null;
          return getCacheKey({
            __typename: 'guru_InventoryItemRecommendations',
            id: inventoryItemId.split('_').slice(0, 2).join(':'),
          });
        },
      },
      inventory_InventoryItem: {
        work: (_, { workId }) => toIdValue(dataIdFromObject({
          __typename: 'InventoryItem',
          id: workId,
        })),
      },
    },
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: fragmentTypes,
    }),
  });

  const httpLink = createHttpLink({
    uri: config('graphqlUri'),
    credentials: 'same-origin',
    fetch,
  });

  const options = {
    cache,
    ...clientOptions,
    link: ApolloLink.from([
      createStateLink({
        cache,
      }),
      clientOptions.link || httpLink,
    ]),
  };

  if (options.cache && initialState) {
    options.cache = options.cache.restore(initialState);
  }

  return new ApolloClient(options);
}

export default createApolloClient;

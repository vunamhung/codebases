import { withClientState } from 'apollo-link-state';
import get from 'lodash/get';
import uniq from 'lodash/uniq';

import { GET_PRODUCT_PAGE_STATE } from '../containers/apollo/withProductPageState';

export default ({ cache, defaults = {} }) => withClientState({
  cache,
  resolvers: {
    Mutation: {
      updateProductPageState: (obj, { productPage }, { cache: ctxCache }) => {
        const previous = ctxCache.readQuery({ query: GET_PRODUCT_PAGE_STATE });

        const data = {
          productPage: {
            ...previous.productPage,
            ...productPage,
          },
        };

        ctxCache.writeData({ data });

        return data.productPage;
      },
      addProductPageUserSelectedAttribute: (obj, { attributeName }, { cache: ctxCache }) => {
        const previous = ctxCache.readQuery({ query: GET_PRODUCT_PAGE_STATE });
        const previousUserSelectedAttributes = get(previous, 'productPage.userSelectedAttributes');

        const data = {
          productPage: {
            ...previous.productPage,
            userSelectedAttributes: uniq([...previousUserSelectedAttributes, attributeName]),
          },
        };

        ctxCache.writeData({ data });

        return attributeName;
      },
    },
  },
  defaults: {
    ...defaults,
    productPage: {
      __typename: 'ProductPage',
      workId: null,
      blankItemId: null,
      categoryId: null,
      userSelectedAttributes: [],
      ...defaults.productPage,
    },
  },
});

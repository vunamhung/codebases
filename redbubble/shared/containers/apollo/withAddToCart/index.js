import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';
import { useMutation } from '@apollo/react-hooks';
import get from 'lodash/get';
import { CART_QUERY } from '../withCart';
import { query as userInfoQuery, useUserInfo } from '../withUserInfo';

const ADD_TO_CART_BUTTON = 0;

const CREATE_ANONYMOUS_USER = gql`
  mutation withCreateAnonymousUser($locale: String) {
    createAnonymousUser(locale: $locale) {
      userId
    }
  }
`;

const updateUserInfoCache = (proxy, { data }) => {
  const userId = get(data, 'createAnonymousUser.userId');
  const userInfoData = proxy.readQuery({ query: userInfoQuery });

  proxy.writeQuery({
    query: userInfoQuery,
    data: {
      ...userInfoData,
      userInfo: {
        ...userInfoData.userInfo,
        id: userId,
        userId,
      },
    },
  });
};

const updateCartCache = (proxy, { data }) => {
  const cartCache = proxy.readQuery({ query: CART_QUERY });

  proxy.writeQuery({
    query: CART_QUERY,
    data: {
      ...cartCache,
      cart: Object.assign({}, cartCache.cart, data.addToCart),
    },
  });
};

const ADD_TO_CART = gql`
  mutation addToCart($inventoryItemId: String!, $sailthruIds: cart_SailthruIds) {
    addToCart(inventoryItemId: $inventoryItemId, sailthruIds: $sailthruIds) {
      id
      totalItems
      items {
        inventoryItemId
        quantity
      }
    }
  }
`;

const useAddToCart = () => {
  const { userInfo } = useUserInfo();
  const [createAnonymousUser] = useMutation(CREATE_ANONYMOUS_USER);
  const [atc, { data, loading, error }] = useMutation(ADD_TO_CART);

  const addToCart = async ({ inventoryItemId }) => {
    if (!userInfo || !userInfo.userId) {
      await createAnonymousUser({
        update: updateUserInfoCache,
        variables: {
          locale: userInfo.locale,
        },
      });
    }
    const variables = { inventoryItemId };
    return atc({ variables, update: updateCartCache });
  };

  return {
    addToCart,
    addToCartLoading: loading,
    addToCartError: error,
    addToCartResult: data,
  };
};

const withAddToCart = (Component) => {
  const WrappedComponent = (props) => {
    const {
      logAddToCartEvent,
      createAnonymousUser,
      createAnonymousUserLoading,
    } = props;

    return (
      <Mutation mutation={ADD_TO_CART} update={updateCartCache}>
        {(update, { loading }) => (
          <Component
            {...props}
            addToCart={
              async (inventoryItem, gaCategory, eventCategory) => {
                await createAnonymousUser();
                logAddToCartEvent({
                  inventoryItem,
                  gaCategory,
                  eventCategory,
                  buttonType: ADD_TO_CART_BUTTON,
                });

                const { id: inventoryItemId } = inventoryItem;
                const variables = { inventoryItemId };
                return update({ variables });
              }
            }
            addToCartLoading={createAnonymousUserLoading || loading}
          />
        )}
      </Mutation>
    );
  };

  WrappedComponent.displayName = `withAddToCart(${Component.displayName})`;

  WrappedComponent.propTypes = {
    logAddToCartEvent: PropTypes.func,
    createAnonymousUser: PropTypes.func.isRequired,
    createAnonymousUserLoading: PropTypes.bool,
  };

  WrappedComponent.defaultProps = {
    logAddToCartEvent: () => {},
    createAnonymousUserLoading: false,
  };

  return WrappedComponent;
};

withAddToCart.displayName = 'withAddToCart';

export default withAddToCart;
export { useAddToCart, ADD_TO_CART_BUTTON };

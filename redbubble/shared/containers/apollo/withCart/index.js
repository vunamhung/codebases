import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import get from 'lodash/get';

export const CART_QUERY = gql`
  query withCart {
    cart {
      id
      totalItems
      items {
        inventoryItemId
        quantity
      }
    }
  }
`;

const withCart = (Component) => {
  const WrappedComponent = graphql(CART_QUERY, {
    options: () => {
      return {
        ssr: false,
      };
    },
    props: ({ data, ownProps }) => {
      const { loading, cart } = data;

      return {
        ...ownProps,
        loading,
        cart,
      };
    },
  })(Component);

  WrappedComponent.displayName = `withCart(${Component.displayName})`;

  return WrappedComponent;
};

withCart.displayName = 'withCart';

export default withCart;

export const useCart = () => {
  const { data, loading } = useQuery(CART_QUERY, { ssr: false });
  const cart = get(data, 'cart', null);

  return {
    cart,
    cartLoading: loading,
  };
};

export const useLazyCart = (opts = {}) => {
  const [cartFetch, { loading, data }] = useLazyQuery(CART_QUERY, opts);
  const cart = get(data, 'cart', null);

  return {
    cart,
    cartFetch,
    cartLoading: loading,
  };
};

import { graphql } from '@apollo/react-hoc';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { compose } from 'redux';

export const GET_PRODUCT_PAGE_STATE = gql`
  query GetProductPageState {
    productPage @client {
      workId
      categoryId
      blankItemId
      userSelectedAttributes
    }
  }
`;

export const UPDATE_PRODUCT_PAGE_STATE = gql`
  mutation UpdateProductPageState($productPage: ProductPageInput!) {
    updateProductPageState(productPage: $productPage) @client
  }
`;

export const ADD_PRODUCT_PAGE_USER_SELECTED_ATTRIBUTE = gql`
  mutation AddProductPageUserSelectedAttribute($attributeName: String!) {
    addProductPageUserSelectedAttribute(attributeName: $attributeName) @client
  }
`;

export const useProductPageState = () => {
  const { data } = useQuery(GET_PRODUCT_PAGE_STATE);
  const [updateProductPageState] = useMutation(UPDATE_PRODUCT_PAGE_STATE);
  const [
    addProductPageUserSelectedAttribute,
  ] = useMutation(ADD_PRODUCT_PAGE_USER_SELECTED_ATTRIBUTE);

  return {
    productPage: get(data, 'productPage'),
    updateProductPageState: (productPage) => {
      updateProductPageState({
        variables: { productPage },
      });
    },
    addProductPageUserSelectedAttribute: (attributeName) => {
      addProductPageUserSelectedAttribute({
        variables: { attributeName },
      });
    },
  };
};

export default (Component) => {
  const WrappedComponent = compose(
    graphql(GET_PRODUCT_PAGE_STATE, {
      props: ({ data }) => ({
        productPage: get(data, 'productPage'),
      }),
    }),
    graphql(UPDATE_PRODUCT_PAGE_STATE, {
      props: ({ mutate }) => ({
        updateProductPageState: (productPage) => {
          setTimeout(() => mutate({ variables: { productPage } }));
        },
      }),
    }),
    graphql(ADD_PRODUCT_PAGE_USER_SELECTED_ATTRIBUTE, {
      props: ({ mutate }) => ({
        addProductPageUserSelectedAttribute: (attributeName) => {
          setTimeout(() => mutate({ variables: { attributeName } }));
        },
      }),
    }),
  )(Component);

  WrappedComponent.fragment = Component.fragment;
  WrappedComponent.displayName = Component.displayName;

  return WrappedComponent;
};

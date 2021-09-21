import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { Query } from '@apollo/react-components';

export const LISTS_QUERY = gql`
  query withLists($input: lists_ListsInput) {
    lists_lists(input: $input) {
      id
      lists {
        nodes {
          id
          listId
          name
        }
      }
    }
  }
`;

const withLists = (Component) => {
  const WrappedComponent = (props) => {
    const isLoggedIn = get(props, 'userInfo.isLoggedIn', false);
    const locale = get(props, 'userInfo.locale', 'en');

    return (
      <Query
        query={LISTS_QUERY}
        skip={!isLoggedIn}
        ssr={false}
        variables={{
          input: {
            locale,
          },
        }}
      >
        {({ data, loading }) => {
          const lists = get(data, 'lists_lists.lists.nodes') || [];
          return (
            <Component lists={lists} listsLoading={loading} {...props} />
          );
        }}
      </Query>
    );
  };

  return WrappedComponent;
};

withLists.displayName = 'withLists';

export default withLists;

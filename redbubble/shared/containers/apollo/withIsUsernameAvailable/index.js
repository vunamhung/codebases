import React from 'react';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

export const IS_USERNAME_AVAILABLE_QUERY = gql`
  query isUsernameAvailable($username: String!) {
    isUsernameAvailable(username: $username)
  }
`;

const withIsUsernameAvailable = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Query
        query={IS_USERNAME_AVAILABLE_QUERY}
        skip
        ssr={false}
      >
        {(queryResult) => {
          return (
            <Component
              isUsernameAvailableQuery={queryResult}
              {...props}
            />
          );
        }}
      </Query>
    );
  };

  WrappedComponent.displayName = `withIsUsernameAvailable(${Component.displayName})`;

  return WrappedComponent;
};

withIsUsernameAvailable.displayName = 'withIsUsernameAvailable';

export default withIsUsernameAvailable;

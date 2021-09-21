import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';

const SIGNUP = gql`
  mutation Signup($signup: SignupInput!) {
    signup(signup: $signup) {
      tokens {
        federatedId
        openIdToken
        refreshToken
      }
      errors {
        code
        field
      }
    }
  }
`;

const withSignup = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Mutation mutation={SIGNUP}>
        {signup => (<Component {...props} signup={signup} />)}
      </Mutation>
    );
  };

  WrappedComponent.displayName = `withSignup(${Component.displayName})`;

  return WrappedComponent;
};

withSignup.displayName = 'withSignup';

export default withSignup;


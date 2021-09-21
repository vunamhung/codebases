import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';

const LOGIN = gql`
  mutation Login($login: LoginInput!) {
    login(login: $login) {
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

const withLogin = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Mutation mutation={LOGIN}>
        {login => (<Component {...props} login={login} />)}
      </Mutation>
    );
  };

  WrappedComponent.displayName = `withLogin(${Component.displayName})`;

  return WrappedComponent;
};

withLogin.displayName = 'withLogin';

export default withLogin;


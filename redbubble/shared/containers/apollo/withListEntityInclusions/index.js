import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { Query } from '@apollo/react-components';
import { withApollo } from '@apollo/react-hoc';

const FRAGMENT_QUERY = gql`
  fragment ListEntityInclusionsFragment on lists_Inclusion {
    lists {
      id
      listId
    }
  }
`;

const LISTS_INCLUSIONS_QUERY = gql`
  query withListEntityInclusions($input: lists_InclusionsInput!) {
    lists_inclusions(input: $input) {
      id
      lists {
        id
        listId
      }
    }
  }
`;

function updateCache(client, { input }, data) {
  const id = `lists_Inclusion${input.item.entityType}_${input.item.entityId}`;

  client.writeFragment({
    id,
    fragment: FRAGMENT_QUERY,
    data: {
      __typename: 'lists_Inclusion',
      lists: data.inclusions.lists,
    },
  });
}

const withListEntityInclusionsFromCache = (Component) => {
  const WrappedComponent = (props) => {
    const { client } = props;
    const entityType = get(props, 'item.entityType');
    const entityId = get(props, 'item.entityId');
    const optimistic = true;

    const id = `lists_Inclusion${entityType}_${entityId}`;
    const data = client.readFragment({ id, fragment: FRAGMENT_QUERY }, optimistic);

    return (<Component listEntityInclusions={get(data, 'lists')} {...props} />);
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  return withApollo(WrappedComponent);
};

const withListEntityInclusions = (Component) => {
  const WrappedComponent = (props) => {
    const isLoggedIn = get(props, 'userInfo.isLoggedIn');
    const locale = get(props, 'userInfo.locale');
    const entityType = get(props, 'item.entityType');
    const entityId = get(props, 'item.entityId');
    const entities = [{ entityId, entityType }];

    return (
      <Query
        query={LISTS_INCLUSIONS_QUERY}
        variables={{ input: { items: entities }, locale }}
        skip={!isLoggedIn || !entityId || !locale}
        ssr={false}
      >
        {({ data }) => {
          return (
            <Component listEntityInclusions={get(data, 'lists_inclusions[0].lists')} {...props} />
          );
        }}
      </Query>
    );
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  return WrappedComponent;
};

export default withListEntityInclusions;
export {
  withListEntityInclusionsFromCache,
  updateCache,
};

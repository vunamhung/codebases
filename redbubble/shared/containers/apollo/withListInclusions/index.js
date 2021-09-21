import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { entityShape } from '../../../components/Lists';

const LISTS_INCLUSIONS_QUERY = gql`
  query withListsInclusions($input: lists_InclusionsInput!) {
    lists_inclusions(input: $input) {
      id
      item {
        id
        ... on lists_InventoryItemItem {
          entityId
        }
        ... on lists_WorkItem {
          entityId
        }
      }
      lists {
        id
        listId
      }
    }
  }
`;

export const useListInclusions = (userInfo, entities, ssr) => {
  const isLoggedIn = get(userInfo, 'isLoggedIn');
  const items = entities || [];
  const variables = { input: { items } };
  const skip = !(isLoggedIn && Array.isArray(items) && items.length > 0);

  const { data, loading } = useQuery(LISTS_INCLUSIONS_QUERY, { variables, skip, ssr });

  return {
    listInclusions: get(data, 'lists_inclusions'),
    listInclusionsLoading: loading,
  };
};

const withListInclusions = (Component) => {
  const WrappedComponent = (props) => {
    const { userInfo, entities } = props;
    const ssr = false;
    const { listInclusions, listInclusionsLoading } = useListInclusions(userInfo, entities, ssr);

    return (
      <Component
        listInclusions={listInclusions}
        listInclusionsLoading={listInclusionsLoading}
        {...props}
      />
    );
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  WrappedComponent.propTypes = {
    entities: PropTypes.arrayOf(entityShape),
  };

  WrappedComponent.defaultProps = {
    entities: null,
  };

  return WrappedComponent;
};

withListInclusions.displayName = 'withListInclusions';

export default withListInclusions;

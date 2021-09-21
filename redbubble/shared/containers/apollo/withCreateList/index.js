import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { Mutation } from '@apollo/react-components';
import { LISTS_QUERY } from '../withLists';

const CREATE_LIST_MUTATION = gql`
  mutation withCreateList($input: lists_CreateListInput!) {
    createList(input: $input) {
      list {
        id
        listId
        name
      }
    }
  }
`;

const withCreateList = (Component) => {
  const WrappedComponent = (props) => {
    const locale = get(props, 'userInfo.locale', 'en');

    return (
      <Mutation
        mutation={CREATE_LIST_MUTATION}
        update={(proxy, { data }) => {
          const listsCache = proxy.readQuery({
            query: LISTS_QUERY,
            variables: {
              input: {
                locale,
              },
            },
          });

          const lists = get(listsCache, 'lists_lists.lists.nodes') || [];

          proxy.writeQuery({
            query: LISTS_QUERY,
            data: {
              ...listsCache,
              lists_lists: {
                ...listsCache.lists_lists,
                lists: {
                  ...listsCache.lists_lists.lists,
                  nodes: [data.createList.list, ...lists],
                },
              },
            },
          });
        }}
      >
        {(mutation, { loading }) => (
          <Component
            {...props}
            createList={input => mutation({ variables: { input } })}
            isCreateListLoading={loading}
          />
        )}
      </Mutation>
    );
  };

  WrappedComponent.displayName = `withCreateList(${Component.displayName})`;

  return WrappedComponent;
};

withCreateList.displayName = 'withCreateList';

export default withCreateList;

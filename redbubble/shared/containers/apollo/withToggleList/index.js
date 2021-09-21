import React from 'react';
import gql from 'graphql-tag';
import nanoid from 'nanoid';
import { compose } from 'redux';
import { Mutation } from '@apollo/react-components';
import { updateCache } from '../withListEntityInclusions';

function getTypenameByEntityType(entityType) {
  if (entityType === 'INVENTORY_ITEM') return 'lists_InventoryItemItem';
  if (entityType === 'WORK') return 'lists_WorkItem';
  return null;
}

const ADD_ITEM_TO_DEFAULT_LIST_MUTATION = gql`
  mutation withAddItemToDefaultList($input: lists_AddItemToDefaultListInput!) {
    addItemToDefaultList(input: $input) {
      defaultList {
        id
        listId
        name
      }
      inclusions {
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
  }
`;

const withAddItemToDefaultList = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Mutation mutation={ADD_ITEM_TO_DEFAULT_LIST_MUTATION}>
        {(mutation, { loading }) => {
          return (
            <Component
              {...props}
              isAddItemToDefaultListLoading={loading}
              addItemToDefaultList={input => mutation({
                variables: { input },
                update: (client, { data }) => {
                  updateCache(client, { input }, data.addItemToDefaultList);
                },
              })}
            />
          );
        }}
      </Mutation>
    );
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  return WrappedComponent;
};

withAddItemToDefaultList.displayName = 'withAddItemToDefaultList';

const ADD_ITEM_TO_LIST_MUTATION = gql`
  mutation withAddItemToList($input: lists_AddItemToListInput!) {
    addItemToList(input: $input) {
      inclusions {
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
  }
`;

const withAddItemToList = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Mutation mutation={ADD_ITEM_TO_LIST_MUTATION}>
        {(mutation, { loading }) => (
          <Component
            {...props}
            isAddItemToListLoading={loading}
            addItemToList={(input, listInclusions) => mutation({
              variables: { input },
              optimisticResponse: {
                __typename: 'Mutation',
                addItemToList: {
                  __typename: 'lists_AddItemToListPayload',
                  inclusions: {
                    id: `${input.item.entityType}_${input.item.entityId}`,
                    item: {
                      id: nanoid(),
                      entityId: input.item.entityId,
                      __typename: getTypenameByEntityType(input.item.entityType),
                    },
                    lists: [
                      {
                        id: nanoid(),
                        listId: input.listId,
                        __typename: 'lists_ListId',
                      },
                      ...listInclusions,
                    ],
                    __typename: 'lists_Inclusion',
                  },
                },
              },
              update: (client, { data }) => {
                updateCache(client, { input }, data.addItemToList);
              },
            })}
          />
        )}
      </Mutation>
    );
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  return WrappedComponent;
};

withAddItemToList.displayName = 'withAddItemToList';

const REMOVE_ITEM_FROM_LIST_MUTATION = gql`
  mutation withRemoveItemFromList($input: lists_RemoveItemFromListInput!) {
    removeItemFromList(input: $input) {
      inclusions {
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
  }
`;

const withRemoveItemFromList = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Mutation mutation={REMOVE_ITEM_FROM_LIST_MUTATION}>
        {(mutation, { loading }) => (
          <Component
            {...props}
            isRemoveItemFromListLoading={loading}
            removeItemFromList={(input, listInclusions) => mutation({
              variables: { input },
              optimisticResponse: {
                __typename: 'Mutation',
                removeItemFromList: {
                  __typename: 'lists_RemoveItemFromListPayload',
                  inclusions: {
                    item: {
                      id: nanoid(),
                      entityId: input.item.entityId,
                      __typename: getTypenameByEntityType(input.item.entityType),
                    },
                    lists: listInclusions.filter(({ listId }) => input.listId !== listId),
                    __typename: 'lists_Inclusion',
                  },
                },
              },
              update: (client, { data }) => {
                updateCache(client, { input }, data.removeItemFromList);
              },
            })}
          />
        )}
      </Mutation>
    );
  };

  WrappedComponent.displayName = Component.displayName;
  WrappedComponent.fragment = Component.fragment;

  return WrappedComponent;
};

withRemoveItemFromList.displayName = 'withRemoveItemFromList';

export default compose(
  withAddItemToDefaultList,
  withAddItemToList,
  withRemoveItemFromList,
);

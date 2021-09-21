import PropTypes from 'prop-types';

const supportedEntityTypes = ['INVENTORY_ITEM', 'WORK'];

const itemShape = PropTypes.shape({
  entityId: PropTypes.string,
  entityType: PropTypes.oneOf(supportedEntityTypes),
  preview: PropTypes.string,
  inventoryItemDescription: PropTypes.string,
  workTitle: PropTypes.string,
});

const listShape = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  listId: PropTypes.string,
  item: PropTypes.shape({
    entityId: PropTypes.string,
    entityType: PropTypes.oneOf(supportedEntityTypes),
  }),
});

const listIdShape = PropTypes.shape({
  id: PropTypes.string,
  listId: PropTypes.string,
});

const inclusionShape = PropTypes.shape({
  id: PropTypes.string,
  item: itemShape,
  lists: listIdShape,
});

const listManagerShape = PropTypes.shape({
  openListPicker: PropTypes.func.isRequired,
  openListNotification: PropTypes.func.isRequired,
  addItemToDefaultList: PropTypes.func.isRequired,
});

const entityShape = PropTypes.shape({
  entityId: PropTypes.string,
  entityType: PropTypes.string,
});

export {
  itemShape,
  listShape,
  listIdShape,
  inclusionShape,
  listManagerShape,
  entityShape,
};

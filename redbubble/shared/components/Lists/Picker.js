/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import { FormattedMessage, intlShape, injectIntl, defineMessages } from 'react-intl';
import { compose } from 'redux';

import Button from '@redbubble/design-system/react/Button';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Sheets, { Sheet } from '@redbubble/design-system/react/Sheets';
import Input from '@redbubble/design-system/react/Form/Input';
import * as constants from '@redbubble/design-system/react/constants';
import { withAnalytics } from '@redbubble/boom-analytics';

import { analyticsPayload } from '../../lib/analytics';
import { withPropsAndFragment as withProps } from '../../containers/wecompose';
import withUserInfo from '../../containers/apollo/withUserInfo';

import withLists from '../../containers/apollo/withLists';
import withToggleList from '../../containers/apollo/withToggleList';
import withListEntityInclusions from '../../containers/apollo/withListEntityInclusions';
import CreateListForm from './CreateListForm';
import ModalOrDrawer from '../ModalOrDrawer';
import { itemShape } from './';

const ListSelector = ({
  item,
  listEntityInclusions,
  lists,
  listsLoading,
  locale,
  addItemToList,
  removeItemFromList,
  logEvent,
}) => {
  if (!item || !listEntityInclusions || !addItemToList || !removeItemFromList) return null;
  if (listsLoading) return <Button circle loading />;

  const handleChange = ({ target: { name: listId, checked } }, listName) => {
    const { entityId, entityType } = item;
    const input = {
      item: { entityId, entityType },
      listId,
      locale,
    };

    if (!checked) {
      removeItemFromList(input, listEntityInclusions);
      logEvent({ analytics: analyticsPayload.removeItemFromList(listName) });
    } else {
      addItemToList(input, listEntityInclusions);
      logEvent({
        analytics: analyticsPayload.addItemToList(listName),
        dataLayer: { event: 'addItemToList', listName, item },
      });
    }
  };

  const keyedInclusions = keyBy(listEntityInclusions, 'listId');

  return lists.map(({ listId, name }) => (
    <Box key={listId}>
      <label style={{ borderTop: '1px solid #d6dadf', display: 'block' }} aria-label={name}>
        <Box display="flex" alignItems="center" padding="m">
          <Box
            display="flex"
            alignItems="flex-start"
            marginRight="xs"
            marginTop="xxs"
          >
            <Input
              type="checkbox"
              name={listId}
              onChange={e => handleChange(e, name)}
              checked={!!keyedInclusions[listId]}
            />
          </Box>
          <Box display="flex" alignItems="flex-start">
            <Text display="block" type="display6">{ name }</Text>
          </Box>
        </Box>
      </label>
    </Box>
  ));
};

ListSelector.propTypes = {
  item: itemShape,
  listEntityInclusions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    listId: PropTypes.string.isRequired,
  })),
  lists: PropTypes.arrayOf(PropTypes.shape({
    listId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  locale: PropTypes.string,
  addItemToList: PropTypes.func,
  removeItemFromList: PropTypes.func,
  logEvent: PropTypes.func.isRequired,
};

ListSelector.defaultProps = {
  item: null,
  listEntityInclusions: null,
  locale: 'en',
  addItemToList: null,
  removeItemFromList: null,
};

const ListSelectorWithDependencies = compose(
  withUserInfo,
  withProps((props) => {
    return {
      locale: get(props, 'userInfo.locale'),
    };
  }),
  withLists,
  withToggleList,
  withListEntityInclusions,
  withAnalytics,
)(ListSelector);

const messages = defineMessages({
  saveItem: 'Save your item in a list',
  chooseList: 'Choose a list',
  newList: 'Create new list',
});

const Picker = (props) => {
  const {
    item,
    profile,
    isOpen,
    onCloseRequested,
    intl,
  } = props;

  return (
    <ModalOrDrawer
      styles={{ height: '60vh', minHeight: '320px' }}
      open={isOpen}
      profile={profile}
      onCloseRequested={onCloseRequested}
      accessibleTitle={intl.formatMessage(messages.saveItem)}
      getApplicationNode={() => document.getElementById('app')}
    >
      {({ close }) => (
        <Sheets
          intl={intl}
          title={intl.formatMessage(messages.chooseList)}
          rightAction={
            <React.Fragment>
              <Button
                onClick={() => close()}
                size={constants.SMALL}
                intent={constants.PRIMARY}
              >
                <FormattedMessage defaultMessage="Done" />
              </Button>
            </React.Fragment>
          }
          sheets={{
            createList: (
              <Sheet title={intl.formatMessage(messages.newList)}>
                {({ goBack }) => (
                  <Box padding="m">
                    <CreateListForm
                      profile={profile}
                      closeForm={goBack}
                      item={item}
                    />
                  </Box>
                )}
              </Sheet>
            ),
          }}
        >
          {({ openSheet }) => (
            <Box padding="m">
              <Box paddingBottom="m" display="block">
                <Button
                  onClick={() => openSheet('createList')}
                  size={constants.SMALL}
                  intent={constants.PRIMARY}
                >
                  <FormattedMessage id="newList" defaultMessage="Create new list" />
                </Button>
              </Box>
              <ListSelectorWithDependencies item={item} />
            </Box>
        )}
        </Sheets>
      )}
    </ModalOrDrawer>
  );
};

Picker.propTypes = {
  isOpen: PropTypes.bool,
  profile: PropTypes.string,
  item: itemShape,
  onCloseRequested: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

Picker.defaultProps = {
  isOpen: false,
  profile: constants.DESKTOP,
  item: null,
};

export default compose(
  injectIntl,
)(Picker);

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import Button from '@redbubble/design-system/react/Button';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Image from '@redbubble/design-system/react/Image';
import * as constants from '@redbubble/design-system/react/constants';

import { useAnalyticsActions } from '../../containers/redux/withAnalytics';
import {
  withListEntityInclusionsFromCache,
} from '../../containers/apollo/withListEntityInclusions';
import { analyticsPayload } from '../../lib/analytics';
import FavoriteIcon, { SMALL, MEDIUM } from '../FavoriteIcon';
import { itemShape, listManagerShape } from './';
import heartIcon from './Heart.svg';
import { SIGNUP } from '../LoginSignup';
import styles from './styles.css';
import { historyPropType } from '../../lib/propTypes';

const Heart = (props) => {
  const {
    listManager,
    isLoggedIn,
    size,
    listEntityInclusions,
    item,
    locale,
    openLoginSignupModal,
    noDropShadow,
  } = props;
  const { logEvent } = useAnalyticsActions();

  if (!listManager || !item || !locale || (!isLoggedIn && !openLoginSignupModal)) return null;

  const handleLoginSignupSuccess = async () => {
    const { history, item: { entityType, entityId } } = props;
    const { addItemToDefaultList } = listManager;

    if (history) {
      history.push({ hash: entityId, state: { maintainScrollPosition: true } });
    }

    await addItemToDefaultList({ item: { entityType, entityId }, locale });
    window.location.reload(true);
  };

  const handleAnonClick = (e) => {
    const { item: { entityId }, scrollBackOnModalClose } = props;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const scrollBack = () => {
      window.location.hash = `#${entityId}`;
    };
    const onModalClose = scrollBackOnModalClose ? scrollBack : () => {};
    window.scrollTo(0, 0); // Recaptcha v2 hack-fix
    const fullTitle = `${item.workTitle} ${item.inventoryItemDescription}`;
    const renderTitle = text => (
      <Text type="display2" element="h2" display="block">
        {text} <Image src={heartIcon} className={styles.favoriteHeart} />
      </Text>
    );

    const renderImage = () => (
      <Box paddingBottom="m" display="flex" alignItems="center">
        <Image
          src={item.preview}
          alt={fullTitle}
          className={styles.productImage}
        />
      </Box>
    );
    openLoginSignupModal({
      onCompleted: handleLoginSignupSuccess,
      initialForm: SIGNUP,
      analyticsLabel: 'heart',
      header: get(item, 'preview') ? renderImage() : null,
      loginTitle: renderTitle(
        <FormattedMessage defaultMessage="Log in to save" />,
      ),
      scrollBackFn: onModalClose,
      signupTitle: renderTitle(
        <FormattedMessage defaultMessage="Sign up to save" />,
      ),
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const { addItemToDefaultList, openListPicker, openListNotification } = listManager;

    if (listEntityInclusions.length === 0) {
      const { entityId, entityType } = item;
      const { data } = await addItemToDefaultList({
        item: { entityId, entityType },
        locale,
      });

      const listName = get(data, 'addItemToDefaultList.defaultList.name');
      const listId = get(data, 'addItemToDefaultList.defaultList.listId');
      const inclusions = get(data, 'addItemToDefaultList.inclusions');
      logEvent({
        analytics: analyticsPayload.addItemToDefaultList(listName),
        dataLayer: { event: 'addItemToDefaultList', listName, item },
      });
      if (listName && inclusions) {
        openListNotification({ item, listName, listId });
      }
    } else {
      openListPicker(item);
    }
  };

  const fullStoryTag = 'anon-heart-button';
  const className = cnames('js-heartButton', {
    [fullStoryTag]: !isLoggedIn,
  });

  const isAddedToSomeList = !!(listEntityInclusions && listEntityInclusions.length > 0);

  return (
    <Box className={className}>
      <Button
        data-testid="favorite-button"
        elevation={noDropShadow ? null : constants.ELEVATION_MEDIUM}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={isLoggedIn ? handleClick : handleAnonClick}
        circle
        size={size}
        iconAfter={(<FavoriteIcon size={size} favorited={isAddedToSomeList} />)}
      />
    </Box>
  );
};

Heart.propTypes = {
  history: historyPropType,
  isLoggedIn: PropTypes.bool,
  item: itemShape,
  listEntityInclusions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      listId: PropTypes.string,
    }),
  ),
  listManager: listManagerShape,
  locale: PropTypes.string,
  noDropShadow: PropTypes.bool,
  openLoginSignupModal: PropTypes.func,
  scrollBackOnModalClose: PropTypes.bool,
  size: PropTypes.oneOf([SMALL, MEDIUM]),
};

Heart.defaultProps = {
  history: null,
  isLoggedIn: false,
  item: null,
  listEntityInclusions: [],
  listManager: null,
  locale: 'en',
  noDropShadow: false,
  openLoginSignupModal: null,
  scrollBackOnModalClose: false,
  size: SMALL,
};

export default compose(
  withListEntityInclusionsFromCache,
)(Heart);
export { Heart as HeartButton };

import InfoDiscIcon from '@redbubble/design-system/react/Icons/InfoDisc';
import Box from '@redbubble/design-system/react/Box';
import cnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Text from '@redbubble/design-system/react/Text';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';


const doNotPropagateEvent = (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
};

const TagsOverlay = ({
  tags,
  inventoryItemId,
  rank,
  onProductTagsDisplayed,
}) => {
  const tagsText = tags.join(', ');

  const [shouldDisplayTags, setShouldDisplayTags] = useState(false);


  const toggleDisplayTags = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    if (!shouldDisplayTags) {
      onProductTagsDisplayed({ inventoryItemId, rank });
    }
    setShouldDisplayTags(!shouldDisplayTags);
    return false;
  };

  return (
    <div
      style={
       shouldDisplayTags ?
        { backgroundColor: 'rgba(255,255,255, 0.9)', pointerEvents: 'auto' } :
        { backgroundColor: 'rgba(255,255,255, 0)', pointerEvents: 'none' }
      }
      className={styles.overlayContainer}
      role="presentation"
    >
      <div className={styles.buttonsContainer}>
        <button
          onMouseDown={doNotPropagateEvent}
          className={styles.tinyButton}
          onClick={toggleDisplayTags}
        >
          <InfoDiscIcon size="small" />
        </button>
      </div>
      <Box
        className={cnames(styles.tagsContainer, {
          [styles.tagsContainerOpened]: shouldDisplayTags,
        })}
      >
        <FormattedMessage defaultMessage="Tags:">
          {label => (<Text element="p" type="display5" display="block">{label}</Text>) }
        </FormattedMessage>
        <Text element="p"> {tagsText} </Text>
      </Box>
    </div>
  );
};

TagsOverlay.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  inventoryItemId: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  onProductTagsDisplayed: PropTypes.func,
};

TagsOverlay.defaultProps = {
  onProductTagsDisplayed: () => null,
};

export default TagsOverlay;

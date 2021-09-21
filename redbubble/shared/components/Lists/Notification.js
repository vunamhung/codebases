import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Image from '@redbubble/design-system/react/Image';
import TextLink from '@redbubble/design-system/react/TextLink';
import { listUrl } from './utilities';

const SuccessNotification = ({ previewImage, listName, listId }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      marginRight="m"
      id="ListNotification"
    >
      <Box marginRight="m">
        <Image
          style={{ width: 56, height: 56 }}
          src={previewImage}
          alt=""
          roundedCorners
        />
      </Box>
      <Box>
        <Text display="block" type="caption" muted>
          <FormattedMessage defaultMessage="Saved to" />
        </Text>
        <TextLink block type="display5" href={listUrl({ listId, name: listName })}>
          { listName }
        </TextLink>
      </Box>
    </Box>
  );
};

SuccessNotification.propTypes = {
  previewImage: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
};

export default SuccessNotification;

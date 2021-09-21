import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';
import Card, { CardBody } from '@redbubble/design-system/react/Card';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Button from '@redbubble/design-system/react/Button';
import Avatar from '@redbubble/design-system/react/Avatar';
import { SMALL, MEDIUM, ELEVATION_MEDIUM } from '@redbubble/design-system/react/constants';
import styles from './styles.css';

const messages = defineMessages({
  artistFoundHeading: { defaultMessage: 'We found a person that matched "{artistName}", but not any works.' },
  callToActionText: { defaultMessage: 'View shop' },
});

const ArtistDetails = ({
  shopUrl,
  avatar,
  name,
  secondary,
}) => {
  return (
    <Box id="ArtistDetails">
      <Text type="display3" display="block">
        <FormattedMessage {...messages.artistFoundHeading} values={{ artistName: name }} />
      </Text>
      <a href={shopUrl} className={styles.artistLink}>
        <Card elevation={ELEVATION_MEDIUM}>
          <CardBody>
            <Box className={styles.layout}>
              <Avatar src={avatar} alt={name} size={MEDIUM} />
              <Box className={styles.subtitle}>
                <Text display="block" element="p" type="display5" className={styles.subtitle}>
                  {name}
                </Text>
                <Text display="block" element="p" muted type="body2" className={styles.subtitle}>
                  {secondary}
                </Text>
              </Box>
              <Button size={SMALL} strong>
                <FormattedMessage {...messages.callToActionText} />
              </Button>
            </Box>
          </CardBody>
        </Card>
      </a>
    </Box>

  );
};

ArtistDetails.propTypes = {
  shopUrl: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  secondary: PropTypes.string,
};

ArtistDetails.defaultProps = {
  shopUrl: null,
  avatar: null,
  name: null,
  secondary: null,
};

export default ArtistDetails;

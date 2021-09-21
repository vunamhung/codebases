import Text from '@redbubble/design-system/react/Text';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import PageSection from '@redbubble/design-system/react/PageSection';
import Button from '@redbubble/design-system/react/Button';
import Box from '@redbubble/design-system/react/Box';
import * as constants from '@redbubble/design-system/react/constants';

import styles from './RelatedTags.css';
import { analyticsPayload } from '../../../../lib/analytics';

const RelatedTags = ({
  relatedTagLinks,
  logEvent,
}) => (
  <PageSection
    size={constants.SMALL}
    marginTop="xs"
    marginBottom="xs"
    id="SearchResultsRelatedTags"
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
    <Text element="h3" type="display3">
      <FormattedMessage defaultMessage="Related searches" />
    </Text>

    <Box element="ul" marginTop="m" className={styles.list} padding="none">
      {
        relatedTagLinks.map(relatedTagLink => (
          <Box
            element="li"
            display="inline-block"
            margin="xxs"
            paddingTop="xxs"
            paddingBottom="xxs"
            key={relatedTagLink.href}
          >
            <Button
              href={relatedTagLink.href}
              title={relatedTagLink.text}
              onMouseDown={() => {
                logEvent({
                  analytics: analyticsPayload.SRPLinkClicked(relatedTagLink.href, 'related_search'),
                });
              }}
              strong
            >
              {relatedTagLink.text}
            </Button>
          </Box>
        ))
      }
    </Box>
  </PageSection>
);

RelatedTags.propTypes = {
  relatedTagLinks: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
  logEvent: PropTypes.func,
};

RelatedTags.defaultProps = {
  relatedTagLinks: [],
  logEvent: () => {},
};

export default RelatedTags;

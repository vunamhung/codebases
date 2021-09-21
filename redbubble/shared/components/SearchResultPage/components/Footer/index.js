import Text from '@redbubble/design-system/react/Text';
import SanitizedHTML from 'react-sanitized-html';
import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './Footer.css';
import BreadcrumbsBar from '../../../BreadcrumbsBar';
import HiddenText from '../../../HiddenText';

const allowedTags = ['p', 'a', 'br', 'ul', 'li', 'ol', 'b'];
const Footer = ({
  intl,
  breadcrumbs,
  productSpecificDescription,
  readMoreProductSpecificDescription,
  logEvent,
}) => (
  <div className={styles.section}>
    <div className={styles.breadcrumbs}>
      <BreadcrumbsBar
        items={breadcrumbs}
        showMetaData
        logEvent={logEvent}
      />
    </div>
    {
      productSpecificDescription && (
        <Text element="p" muted display="block" type="body2" className={styles.text}>
          <SanitizedHTML
            className={styles.richText}
            allowedTags={allowedTags}
            html={productSpecificDescription}
          />
          {
            readMoreProductSpecificDescription &&
              <HiddenText intl={intl}>
                <SanitizedHTML
                  className={styles.richText}
                  allowedTags={allowedTags}
                  html={readMoreProductSpecificDescription}
                />
              </HiddenText>
          }
        </Text>
      )
    }

  </div>

);

const breadCrumbsProps = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
}));

Footer.propTypes = {
  intl: intlShape.isRequired,
  breadcrumbs: breadCrumbsProps,
  productSpecificDescription: PropTypes.string,
  readMoreProductSpecificDescription: PropTypes.string,
  logEvent: PropTypes.func,
};

Footer.defaultProps = {
  breadcrumbs: [],
  productSpecificDescription: null,
  readMoreProductSpecificDescription: null,
  logEvent: () => {
  },
};

export default Footer;

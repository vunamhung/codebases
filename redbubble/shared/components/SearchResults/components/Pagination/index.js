import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import shortid from 'shortid';
import get from 'lodash/get';
import { FormattedMessage, intlShape, defineMessages } from 'react-intl';
import Text from '@redbubble/design-system/react/Text';
import styles from './Pagination.css';
import NamedLink from './NamedLink';

const messages = defineMessages({
  previous: 'Previous',
  next: 'Next',
});

export default function Pagination(props) {
  const {
    paginationLinks,
    showNextPageLink,
    showPreviousPageLink,
    fromNumber,
    toNumber,
    total,
    intl,
  } = props;

  if (!get(paginationLinks, 'namedLinks')) {
    return null;
  }

  const {
    nextPage,
    previousPage,
  } = paginationLinks.namedLinks;

  const nextUrl = get(nextPage, 'url');
  const prevUrl = get(previousPage, 'url');

  return (
    <div>
      <ul className={styles.namedLinksContainer}>
        <NamedLink
          display={Boolean(true)}
          disabled={!showPreviousPageLink}
          linkClass={classNames(styles.namedLinkContainer, styles.previousPage)}
          key={`numberedLink_${shortid.generate()}`}
          {...previousPage}
          title={intl.formatMessage(messages.previous)}
        />
        <NamedLink
          display={Boolean(true)}
          disabled={!showNextPageLink}
          linkClass={classNames(styles.namedLinkContainer, styles.nextPage)}
          key={`numberedLink_${shortid.generate()}`}
          {...nextPage}
          title={intl.formatMessage(messages.next)}
        />
        <Helmet>
          {prevUrl && <link rel="prev" href={prevUrl} />}
          {nextPage && <link rel="next" href={nextUrl} />}
        </Helmet>
      </ul>
      <div className={styles.numberCounter}>
        <Text type="display6" muted>
          <FormattedMessage
            defaultMessage="Showing {from} - {to} of {total} unique designs"
            values={{
              from: intl.formatNumber(fromNumber, { style: 'decimal' }),
              to: intl.formatNumber(toNumber, { style: 'decimal' }),
              total: intl.formatNumber(total, { style: 'decimal' }),
            }}
          />
        </Text>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  intl: intlShape.isRequired,
  currentPage: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  paginationLinks: PropTypes.object,
  showNextPageLink: PropTypes.bool,
  showPreviousPageLink: PropTypes.bool,
  fromNumber: PropTypes.number.isRequired,
  toNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  currentPage: 1,
  paginationLinks: null,
  showNextPageLink: false,
  showPreviousPageLink: false,
};

Pagination.displayName = 'Pagination';

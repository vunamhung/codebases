import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Image from '@redbubble/design-system/react/Image';
import Text from '@redbubble/design-system/react/Text';
import styles from './Pagination.css';
import arrowLeft from './arrowLeft.svg';

export default function NamedLink(props) {
  const {
    title,
    url,
    linkClass,
    display,
    disabled,
  } = props;

  return (
    <li className={classNames(linkClass, { [styles.disabled]: disabled })}>
      {
        display && (
          <Text type="body" display="block" muted={disabled}>
            <Link
              className={styles.namedLink}
              to={url}
            >
              <strong>{title}</strong>
              <Image src={arrowLeft} className={styles.arrowIcon} alt="" aria-hidden loadOnVisible={{ offsetTopBoundaryByPx: 1600 }} />
            </Link>
          </Text>
        )
      }
    </li>
  );
}

const propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  linkClass: PropTypes.string,
  display: PropTypes.bool,
  disabled: PropTypes.bool,
};

const displayName = 'NamedLink';

const defaultProps = {
  title: '',
  url: '',
  linkClass: '',
  display: false,
  disabled: false,
};

NamedLink.displayName = displayName;

NamedLink.propTypes = propTypes;

NamedLink.defaultProps = defaultProps;

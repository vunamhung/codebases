import React from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import Text from '@redbubble/design-system/react/Text';
import CloseIcon from '@redbubble/design-system/react/Icons/Close';
import * as constants from '@redbubble/design-system/react/constants';
import { historyPropType } from '../../lib/propTypes';
import styles from './styles.css';

const SearchContextList = ({
  items,
  history,
  resetUrl,
  loading,
  inverse,
  secondaryButtonText,
  nowrap,
}) => (
  Array.isArray(items) && !!items.length && (
    <ul
      id="AppliedFilters"
      className={cnames(styles.list, {
        [styles.loading]: loading,
        [styles.inverse]: inverse,
        [styles.nowrap]: nowrap,
      })}
    >
      {
        items.map(item => (
          <li key={item.url} className={styles.item}>
            <button
              onClick={() => !loading && history.push(item.url)}
              className={styles.button}
              tabIndex={-1}
              aria-hidden
            >
              <Text type="display6">{item.label}</Text>
              <div className={styles.icon}>
                <CloseIcon size={constants.MEDIUM} />
              </div>
            </button>
          </li>
        ))
      }

      {
        secondaryButtonText && (
          <li className={styles.item}>
            <button
              onClick={() => !loading && history.push(resetUrl)}
              className={cnames(styles.button, styles.secondary)}
              tabIndex={-1}
              aria-hidden
            >
              <Text type="display6">{secondaryButtonText}</Text>
            </button>
          </li>
        )
      }
    </ul>
  )
);

SearchContextList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  history: historyPropType.isRequired,
  resetUrl: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  inverse: PropTypes.bool,
  secondaryButtonText: PropTypes.string,
  nowrap: PropTypes.bool,
};

SearchContextList.defaultProps = {
  items: [],
  loading: false,
  inverse: false,
  secondaryButtonText: '',
  nowrap: false,
};

export default SearchContextList;

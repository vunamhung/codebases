import React from 'react';
import PropTypes from 'prop-types';
import Text from '@redbubble/design-system/react/Text';
import ChevronDownIcon from '@redbubble/design-system/react/Icons/ChevronDown';
import * as constants from '@redbubble/design-system/react/constants';
import styles from './Select.css';

const Select = ({
  items,
  title,
  onChange,
}) => {
  if (!items.length) return null;

  const selectedItem = items.find(item => item.selected) || {};

  return (
    <div className={styles.dropdown}>
      <Text type="display5" display="block">
        <select
          className={styles.select}
          onChange={event => onChange(event.currentTarget.value)}
          aria-label={title}
          value={selectedItem.url}
        >
          {
            items.map(item => (
              <option key={item.url} value={item.url}>{item.name}</option>
            ))
          }
        </select>
      </Text>
      <div className={styles.icon} >
        <ChevronDownIcon size={constants.MEDIUM} />
      </div>
    </div>
  );
};

Select.defaultProps = {
  items: [],
  onChange: () => {},
  title: '',
};

Select.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  title: PropTypes.string,
};

export default Select;

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Select from './Select';
import styles from './Header.css';

const onSortOrderChange = (value) => {
  window.location.href = value;
};

const Header = (props) => {
  const {
    title,
    description,
    resultCount,
    sortOrders,
    loading,
    hasResults,
  } = props;
  return (
    <React.Fragment>
      <Box display="flex">
        <Box
          flex="1"
          paddingLeft="xs"
          paddingRight="xs"
        >
          <Text
            element="h1"
            type="display3"
            aria-live="polite"
            id="SearchResults"
            loading={loading}
          >
            {title}
          </Text>
          <Box
            display="inline-block"
            paddingLeft="xs"
          >
            {
              resultCount && !loading && (
                <Text muted type="body">{resultCount}</Text>
              )
            }
          </Box>
        </Box>
        {
          hasResults && (
            <Box
              paddingLeft="m"
              paddingRight="m"
              display="flex"
              alignItems="center"
            >
              <div className={styles.selects}>
                <Select
                  items={sortOrders}
                  onChange={onSortOrderChange}
                  title="Sort by"
                />
              </div>
            </Box>
          )
        }
      </Box>
      {
        description &&
        <Box
          flex="1"
          paddingLeft="xs"
          paddingRight="xs"
        >
          <Text>{description}</Text>
        </Box>
      }
    </React.Fragment>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  resultCount: PropTypes.string.isRequired,
  sortOrders: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      selected: PropTypes.bool,
    }),
  ),
  loading: PropTypes.bool,
  hasResults: PropTypes.bool,
};

Header.defaultProps = {
  sortOrders: [],
  description: null,
  loading: false,
  hasResults: true,
};

export default Header;

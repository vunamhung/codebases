import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from '@redbubble/design-system/react/Box';
import { Cookies } from 'react-cookie';
import { intlShape, defineMessages } from 'react-intl';
import get from 'lodash/get';
import cnames from 'classnames';

import { analyticsPayload } from '../../lib/analytics';
import MobileSearchControls from '../MobileSearchControls';
import SearchContextList from '../SearchContextList';
import SearchGridColumnToggles, {
  SINGLE_COLUMN_GRID_LAYOUT,
} from './SearchGridColumnToggles';
import {
  ARTWORK_VIEW,
  PREVIEW_TYPE_COOKIE_NAME,
  PRODUCT_CATEGORY_COOKIE_NAME,
  PRODUCT_VIEW,
} from '../MobileSearchControls/consts';
import { historyPropType } from '../../lib/propTypes';
import { browserPropType } from '../../containers/redux/withBrowserInfo';
import {
  artistCollectionsPropType,
  artistCollectionsDefaultProps,
} from '../../containers/apollo/withSearchResults';

import styles from './MobileSearchFilters.css';

const messages = defineMessages({
  searchContextClearAllText: { defaultMessage: 'Clear all' },
});

export const initialSelectedPreview = (cookies, productCategory) => {
  if (
    cookies.get(PREVIEW_TYPE_COOKIE_NAME) &&
    cookies.get(PRODUCT_CATEGORY_COOKIE_NAME) &&
    cookies.get(PRODUCT_CATEGORY_COOKIE_NAME) === productCategory
  ) {
    return cookies.get(PREVIEW_TYPE_COOKIE_NAME);
  }
  return PRODUCT_VIEW;
};

export const isArtworkPreviewAndMobile = (selectedPreview, largeBrowser) => (
  selectedPreview === ARTWORK_VIEW && !largeBrowser
);

class MobileSearchFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPreview: initialSelectedPreview(props.cookies, props.iaCode),
    };

    this.handleSearchPreviewSelectorSelection = this.handleSearchPreviewSelectorSelection.bind(
      this,
    );
    this.handleSearchGridToggleSelection = this.handleSearchGridToggleSelection.bind(
      this,
    );
  }

  handleSearchPreviewSelectorSelection(selectionName) {
    this.setState({ selectedPreview: selectionName }, () => {
      const largeBrowser = get(this.props.browser, 'is.large', false);

      this.props.handleSelectedPreviewType(
        isArtworkPreviewAndMobile(this.state.selectedPreview, largeBrowser),
      );
    });
    this.props.cookies.set(PREVIEW_TYPE_COOKIE_NAME, selectionName);
  }

  handleSearchGridToggleSelection(toggleName) {
    this.props.handleSearchGridToggleSelection(toggleName === SINGLE_COLUMN_GRID_LAYOUT);
  }

  componentDidUpdate() {
    const { iaCode } = this.props;

    if (iaCode) {
      this.props.cookies.set(PRODUCT_CATEGORY_COOKIE_NAME, iaCode);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      iaCode,
    } = nextProps;

    if (iaCode !== this.props.iaCode) {
      this.handleSearchPreviewSelectorSelection(PRODUCT_VIEW);
    }
  }

  render() {
    const {
      searchResultPageLoading,
      searchFilter,
      cookies,
      history,
      intl,
      browser,
      logEvent,
      artistCollections,
    } = this.props;

    const { selectedPreview } = this.state;

    const largeBrowser = get(browser, 'is.large', false);

    const stickyContainerClasses = cnames(styles.mobileFiltersContainer, styles.sticky);
    const appliedCount = (get(artistCollections, 'applied') ? 1 : 0) + searchFilter.appliedCount;
    const resets = [get(artistCollections, 'reset'), ...searchFilter.resets].filter(Boolean);
    const hasContextPills = Array.isArray(resets) && !!resets.length;

    return (
      <Box className={stickyContainerClasses}>
        <div
          className={styles.mobileSearchUtilities}
        >
          <div
            className={styles.mobileSearchUtilitiesContent}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flex="1"
              alignItems="center"
            >
              <Box
                display="flex"
              >
                <MobileSearchControls
                  categories={searchFilter.staticFilters}
                  filters={searchFilter.filters}
                  resetUrl={searchFilter.resetUrl}
                  appliedCount={appliedCount}
                  loading={searchResultPageLoading}
                  onOpen={() => {
                    logEvent({
                      analytics: analyticsPayload.searchMobileFilterOpen(),
                    });
                  }}
                  selectedPreview={selectedPreview}
                  handlePreviewChange={
                    this.handleSearchPreviewSelectorSelection
                  }
                  artistCollections={artistCollections}
                />
              </Box>
              <Box
                display="flex"
                flex="1"
                justifyContent="flex-end"
              >
                <SearchGridColumnToggles
                  handleSelection={
                    this.handleSearchGridToggleSelection
                  }
                  cookies={cookies}
                />
              </Box>
            </Box>
            {!largeBrowser && hasContextPills && (
              <Box flex="100%">
                <div className={styles.scrollableSearchContextList}>
                  <div
                    className={
                      styles.scrollableSearchContextListContent
                    }
                  >
                    <SearchContextList
                      items={resets}
                      history={history}
                      resetUrl={searchFilter.resetUrl}
                      loading={searchResultPageLoading}
                      secondaryButtonText={intl.formatMessage(
                        messages.searchContextClearAllText,
                      )}
                    />
                  </div>
                </div>
              </Box>
            )}
          </div>
        </div>
      </Box>
    );
  }
}

MobileSearchFilters.propTypes = {
  browser: browserPropType,
  cookies: PropTypes.instanceOf(Cookies),
  searchResultPageLoading: PropTypes.bool.isRequired,
  searchFilter: PropTypes.shape({
    resetUrl: PropTypes.string.isRequired,
    staticFilters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    filters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    appliedCount: PropTypes.number.isRequired,
  }),
  intl: intlShape.isRequired,
  history: historyPropType.isRequired,
  iaCode: PropTypes.string,
  logEvent: PropTypes.func,
  handleSearchGridToggleSelection: PropTypes.func,
  handleSelectedPreviewType: PropTypes.func,
  artistCollections: artistCollectionsPropType,
};

MobileSearchFilters.defaultProps = {
  browser: {},
  cookies: new Cookies(),
  searchFilter: {
    appliedCount: 0,
  },
  iaCode: '',
  logEvent: () => {},
  handleSearchGridToggleSelection: () => {},
  handleSelectedPreviewType: () => {},
  artistCollections: artistCollectionsDefaultProps,
};

export default MobileSearchFilters;

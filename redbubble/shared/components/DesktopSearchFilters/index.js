import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { intlShape } from 'react-intl';
import SearchFilterDesktop from './SearchFilterDesktop';
import {
  artistCollectionsPropType,
  artistCollectionsDefaultProps,
} from '../../containers/apollo/withSearchResults';

export default class DesktopSearchFilters extends React.Component {
  constructor(props) {
    super(props);

    this.SearchFilterDesktop = withRouter(SearchFilterDesktop);
  }

  render() {
    const {
      searchFilter,
      loading,
      intl,
      artistCollections,
    } = this.props;

    return (
      <this.SearchFilterDesktop
        searchFilter={searchFilter}
        intl={intl}
        loading={loading}
        artistCollections={artistCollections}
      />
    );
  }
}

DesktopSearchFilters.defaultProps = {
  searchFilter: {},
  loading: false,
  artistCollections: artistCollectionsDefaultProps,
};

DesktopSearchFilters.propTypes = {
  intl: intlShape.isRequired,
  searchFilter: PropTypes.shape({}),
  loading: PropTypes.bool,
  artistCollections: artistCollectionsPropType,
};

DesktopSearchFilters.displayName = 'DesktopSearchFilters';

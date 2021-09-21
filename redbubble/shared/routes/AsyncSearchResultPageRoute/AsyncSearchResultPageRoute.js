import { compose } from 'redux';
import commonHocs from '../../routes/commonAsyncRouteHOCs';
import withSearchResultQueryParams from '../../containers/withSearchResultQueryParams';
import withSearchImpressions from '../../containers/redux/withSearchImpressions';
import SearchResultPage from '../../components/SearchResultPage';
import withListManager from '../../containers/withListManager';
import withLoginSignupModal from '../../containers/withLoginSignupModal';

export default compose(
  commonHocs,
  withSearchResultQueryParams,
  withSearchImpressions,
  withListManager,
  withLoginSignupModal,
)(SearchResultPage);

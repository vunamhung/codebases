import { useMemo } from 'react';
import {
  connect,
  useSelector,
  useDispatch,
  shallowEqual,
} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  doSearch,
  updateSearchTerm,
  updateParsedQuery,
  updateFilter,
  updateProductContext,
  resetSearchState,
} from '../../../redux/ducks/search';

// HoCs:
const mapStateToProps = (
  { search: { searchTerm, parsedQuery, filter, productContext } },
) => ({
  searchTerm,
  parsedQuery,
  filter,
  productContext,
});

const mapDispatchToProps = {
  doSearch,
  updateSearchTerm,
  updateParsedQuery,
  updateFilter,
  updateProductContext,
  resetSearchState,
};

const withSearch = connect(mapStateToProps, mapDispatchToProps);

export default withSearch;

// Hooks:
export const useSearch = () => useSelector(s => ({
  searchTerm: s.search.searchTerm,
  parsedQuery: s.search.parsedQuery,
  filter: s.search.filter,
  productContext: s.search.productContext,
}), shallowEqual);

export const useSearchActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(mapDispatchToProps, dispatch), [dispatch]);
};

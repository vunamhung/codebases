import queryString from 'query-string';
import { withPropsAndFragment as withProps } from '../wecompose';

// These are the URL query parameters that are "fixed" (non-dynamic)
// for a search result page.
const fixedSearchQueryParams = [
  'page',
  'pageSize',
  'rbs',
  'cat_context',
  'featuredArtist',
  'iaCode',
  'medium',
  'sortOrder',
  'showMatureContent',
  'collections',
];

export default withProps(({ location }) => {
  // Let "paramsFromQuery" be all the request query parameters.
  const paramsFromQuery = queryString.parse(location.search);

  // Let "params" be the request query parameters, restricted only to the fixed ones.
  const params = {};
  fixedSearchQueryParams.forEach((key) => {
    if (paramsFromQuery[key]) {
      params[key] = paramsFromQuery[key];
    }
  });

  // Let "extraParams" be the request query parameters, restricted only to the non-fixed ones.
  const extraParams = [];
  Object.entries(paramsFromQuery).forEach(([key, value]) => {
    if (!fixedSearchQueryParams.includes(key) && value) {
      extraParams.push({ name: key, values: value });
    }
  });

  // The non-fixed query parameters are relegated to the "queryParamItems" field.
  params.queryParamItems = extraParams;

  if (paramsFromQuery.page) {
    params.page = /^\+?\d+(\.\d*)?$/.test(paramsFromQuery.page) ? parseInt(paramsFromQuery.page, 10) : 1;
  }

  if (paramsFromQuery.pageSize) {
    params.pageSize = /^\+?\d+(\.\d*)?$/.test(paramsFromQuery.pageSize) ? parseInt(paramsFromQuery.pageSize, 10) : null;
  }

  return {
    queryParams: params,
  };
});

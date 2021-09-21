import Loadable from 'react-loadable';

const AsyncSearchResultPage = Loadable({
  loader: () => import(/* webpackChunkName: "search-result-page" */ './AsyncSearchResultPageRoute.js'),
  loading: () => null,
});

export default AsyncSearchResultPage;

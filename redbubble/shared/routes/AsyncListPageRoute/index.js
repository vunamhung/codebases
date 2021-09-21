import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "list_page" */ './AsyncListPageRoute.js'),
  loading: () => null,
});

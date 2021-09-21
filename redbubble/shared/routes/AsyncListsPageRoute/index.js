import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "lists_page" */ './AsyncListsPageRoute.js'),
  loading: () => null,
});


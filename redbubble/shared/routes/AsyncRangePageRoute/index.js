import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "range_page" */ './AsyncRangePageRoute.js'),
  loading: () => null,
});


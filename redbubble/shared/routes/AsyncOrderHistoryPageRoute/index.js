import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "order_history_page" */ './AsyncOrderHistoryPageRoute.js'),
  loading: () => null,
});


import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "purchase_order_cancel_page" */ './AsyncPurchaseOrderCancelPageRoute.js'),
  loading: () => null,
});


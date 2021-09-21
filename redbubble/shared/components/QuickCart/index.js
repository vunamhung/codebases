import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "quick_cart" */ './QuickCart.js'),
  loading: () => null,
});

import Loadable from 'react-loadable';

export const DesktopAsyncProductPageRoute = Loadable({
  loader: () => import(/* webpackChunkName: "desktop_product_page" */ './DesktopAsyncProductPageRoute.js'),
  loading: () => null,
});

export const MobileAsyncProductPageRoute = Loadable({
  loader: () => import(/* webpackChunkName: "mobile_product_page" */ './MobileAsyncProductPageRoute.js'),
  loading: () => null,
});


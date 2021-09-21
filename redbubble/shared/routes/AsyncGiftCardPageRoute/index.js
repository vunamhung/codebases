import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "gift_card_page" */ './AsyncGiftCardPageRoute.js'),
  loading: () => null,
});


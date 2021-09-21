import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "gift_card_redeem_page" */ './AsyncGiftCardRedeemPageRoute.js'),
  loading: () => null,
});


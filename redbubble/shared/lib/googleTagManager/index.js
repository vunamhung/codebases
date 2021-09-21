import config from '../../../config';
import GaUserTypes from '../analytics/gaUserTypes';
import { serializeExperiments } from '../experiment';

export const dataLayer = (gtm = {}) => {
  const jsonStr = JSON.stringify(gtm);
  const scriptString = config('gtmId') && Object.keys(gtm).length !== 0
    ? `if(!window.dataLayer){dataLayer=[${jsonStr}];(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config('gtmId')}');}else{dataLayer.push(${jsonStr});}`
    : '';

  return scriptString;
};

export const buildGtmData = (userInfo, cookies) => {
  const { enrolments, federatedId } = userInfo;
  return {
    country: userInfo.country,
    currency: userInfo.currency,
    enrolments: serializeExperiments(enrolments) || 'none',
    language: userInfo.locale,
    visitorType: GaUserTypes.getVisitorType(cookies, userInfo),
    federatedId,
  };
};

import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import config from '../../../config';
import { useUserInfo } from '../../containers/apollo/withUserInfo';

/* eslint-disable react/prop-types */
export const BNPLPaypalContextProvider = ({ children }) => {
  const { userInfo: { currency } } = useUserInfo();

  const options = {
    'client-id': config('paypalClientId'),
    currency,
    intent: 'capture',
    components: 'messages,buttons',
    'enable-funding': 'paylater',
  };

  return (
    <PayPalScriptProvider options={options}>
      {children}
    </PayPalScriptProvider>
  );
};

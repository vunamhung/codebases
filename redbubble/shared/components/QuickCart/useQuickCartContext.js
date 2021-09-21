import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useCookies } from 'react-cookie';
import { useUserInfo } from '../../containers/apollo/withUserInfo';
import { isInVariant } from '../../lib/experiment';

const experimentName = 'quick-cart-01';

export const QuickCartContext = React.createContext({});

export const useQuickCartContext = () => useContext(QuickCartContext);

/* eslint-disable react/prop-types */
export const QuickCartContextProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [quickCartOpen, setQuickCartOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['quick_cart_seen']);
  const quickCartSeen = cookies.quick_cart_seen;
  const { userInfo: { enrolments } } = useUserInfo();

  useEffect(() => {
    setIsEnabled(isInVariant(enrolments, experimentName));
  }, [enrolments]);

  const openQuickCart = useCallback(() => {
    setQuickCartOpen(true);
    if (!quickCartSeen) {
      setCookie('quick_cart_seen', true);
    }
  }, [setQuickCartOpen, quickCartSeen, setCookie]);

  const closeQuickCart = useCallback(() => {
    setQuickCartOpen(false);
  }, [setQuickCartOpen]);

  return (
    <QuickCartContext.Provider
      value={{
        isEnabled,
        quickCartOpen,
        quickCartSeen,
        openQuickCart,
        closeQuickCart,
      }}
    >
      {children}
    </QuickCartContext.Provider>
  );
};

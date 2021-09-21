import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import { constants as analyticsConstants } from '@redbubble/boom-analytics';
import { openToast } from '@redbubble/design-system/react/Toast';
import ButtonToggle from '@redbubble/design-system/react/ButtonToggle';
import Button from '@redbubble/design-system/react/Button';
import CartAddIcon from '@redbubble/design-system/react/Icons/CartAdd';
import CrossDiscIcon from '@redbubble/design-system/react/Icons/CrossDisc';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Tick from '@redbubble/design-system/react/Icons/Tick';
import * as constants from '@redbubble/design-system/react/constants';
import { AddToCartDatalayer } from '../../lib/analytics/gtmDatalayer';
import { useAnalyticsActions } from '../../containers/redux/withAnalytics';
import { useQuickCartContext } from '../../components/QuickCart/useQuickCartContext';
import { useAddToCart, ADD_TO_CART_BUTTON } from '../../containers/apollo/withAddToCart';
import Notification from './Notification';

import styles from './styles.css';

// button states
const INITIAL = 'initial';
const SUCCESS = 'success';
const LOADING = 'loading';

// button variants
const EMBEDDED = 'embedded';
const STANDARD = 'standard';

const propsShape = {
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  buttonState: PropTypes.oneOf([INITIAL, SUCCESS, LOADING]),
  disabled: PropTypes.bool,
};

const defaultProps = {
  onClick: () => null,
  onMouseDown: () => null,
  buttonState: INITIAL,
  disabled: false,
};

const EmbeddedAddToCartButton = ({ onClick, onMouseDown, buttonState, disabled }) => {
  return (
    <ButtonToggle
      data-testid="embeddedAddToCartButton"
      active={buttonState === SUCCESS}
      loading={buttonState === LOADING}
      circle
      size={constants.SMALL}
      iconAfter={
        {
          success: (<Tick size={constants.MEDIUM} color="#FFFFFF" />),
          initial: (<CartAddIcon size={constants.SMALL} />),
          loading: null,
        }[buttonState]
      }
      onMouseDown={onMouseDown}
      onClick={onClick}
      disabled={disabled}
    />
  );
};

EmbeddedAddToCartButton.propTypes = propsShape;
EmbeddedAddToCartButton.defaultProps = defaultProps;

const StandardAddToCartButton = ({
  onClick,
  onMouseDown,
  buttonState,
  disabled,
  intent,
  fluid,
}) => {
  if (buttonState === SUCCESS) {
    return (
      <FormattedMessage defaultMessage="Added!">
        {text => (
          <Box className={styles.success} display="flex">
            <Button
              intent={constants.PRIMARY}
              fluid={fluid}
              size={constants.LARGE}
              strong
            >
              {text}
            </Button>
          </Box>
        )}
      </FormattedMessage>
    );
  }

  return (
    <Button
      data-testid="standardAddToCartButton"
      iconBefore={<CartAddIcon />}
      loading={buttonState === LOADING}
      inverse
      size={constants.LARGE}
      strong
      onMouseDown={onMouseDown}
      onClick={onClick}
      disabled={disabled}
      fluid={fluid}
      intent={intent}
    >
      <FormattedMessage defaultMessage="Add to cart" />
    </Button>
  );
};

StandardAddToCartButton.propTypes = { ...propsShape, intent: PropTypes.string };
StandardAddToCartButton.defaultProps = { ...defaultProps, intent: constants.PRIMARY };

function isSuccessful(addToCartResult) {
  return Boolean(get(addToCartResult, 'addToCart'));
}

function useLogAddToCartEvent() {
  const { logEvent } = useAnalyticsActions();

  return ({
    inventoryItem,
    work,
    productCode,
    eventCategory,
    ecommerceCategory,
    addToCartResult,
    label,
  }) => {
    const cartItem = get(addToCartResult, 'addToCart.items', []).find(item => item.inventoryItemId === inventoryItem.id);
    const quantity = get(cartItem, 'quantity');
    const labelPrefix = label || 'product';

    logEvent({
      analytics: {
        action: 'product-add-to-cart',
        category: eventCategory,
        label: `${labelPrefix}:${productCode}`,
        value: ADD_TO_CART_BUTTON,
      },
      commerce: {
        id: inventoryItem.id,
        name: `${work.id} ${work.title}`,
        category: ecommerceCategory,
        price: inventoryItem.price.amount,
        currencyCode: inventoryItem.price.currency,
        quantity: 1,
        action: analyticsConstants.ECOMMERCE_ACTION_TYPE_ADD,
      },
      dataLayer: {
        ...new AddToCartDatalayer()
          .setInventoryItemId(inventoryItem.id)
          .setRetargetingId(inventoryItem.marketingProductTypeId)
          .setGaCode(productCode)
          .setWorkTitle(`${work.title} ${inventoryItem.description}`)
          .setPrice(inventoryItem.price.amount)
          .setCurrency(inventoryItem.price.currency)
          .setQuantity(quantity)
          .build(),
        product_id: inventoryItem.marketingProductTypeId,
      },
    });
  };
}

const openSuccessToast = ({ inventoryItem, work }) => {
  const view = (<Notification inventoryItem={inventoryItem} work={work} />);
  openToast(view);
};

const openErrorToast = (message) => {
  openToast(
    <Box
      display="flex"
      alignItems="center"
      style={{ color: 'var(--ds-color-error-500)' }}
    >
      <CrossDiscIcon />
      <Box marginRight="xs" />
      <Text type="display5">{message}</Text>
    </Box>,
  );
};

const AddToCartButton = ({
  variant,
  inventoryItem,
  work,
  gaMetadata,
  onCompleted,
  onClick,
  disabled,
  intent,
  fluid,
}) => {
  const { addToCart, addToCartResult, addToCartError } = useAddToCart();
  const logEvent = useLogAddToCartEvent();
  const [buttonState, setButtonState] = useState(INITIAL);
  const { isEnabled: isQuickCartEnabled, quickCartSeen, openQuickCart } = useQuickCartContext();

  useEffect(() => {
    if (!isSuccessful(addToCartResult)) return () => {};

    setButtonState(SUCCESS);

    if (quickCartSeen || !isQuickCartEnabled) {
      openSuccessToast({ inventoryItem, work });
    } else {
      openQuickCart();
    }
    onCompleted(addToCartResult);
    logEvent({ inventoryItem, work, addToCartResult, ...gaMetadata });

    const resetButtonState = setTimeout(() => {
      setButtonState(INITIAL);
    }, 1500);

    return () => clearTimeout(resetButtonState);
  }, [addToCartResult]);

  useEffect(() => {
    if (addToCartError) {
      setButtonState(INITIAL);

      openErrorToast(
        get(addToCartError, 'graphQLErrors[0].message', null) || <FormattedMessage defaultMessage="Something went wrong. Please try again." />,
      );
    }
  }, [addToCartError]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setButtonState(LOADING);
    addToCart({ inventoryItemId: inventoryItem.id });
  }, [inventoryItem, work, gaMetadata]);

  if (!inventoryItem) return null;

  const props = {
    onClick: onClick || handleClick,
    onMouseDown: (e) => {
      /**
       * As this component is used in <ProductCard />
       * this enables the component to send a 'product_clicked'
       * on 'mouseDown'
       */
      e.stopPropagation();
      e.preventDefault();
    },
    buttonState,
    disabled,
    fluid,
  };

  return (
    variant === EMBEDDED ?
      <EmbeddedAddToCartButton {...props} /> :
      <StandardAddToCartButton {...props} intent={intent} />
  );
};

AddToCartButton.propTypes = {
  inventoryItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    marketingProductTypeId: PropTypes.string.isRequired,
    price: PropTypes.shape({
      currency: PropTypes.string,
      amount: PropTypes.number,
    }),
  }).isRequired,
  work: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  gaMetadata: PropTypes.shape({
    productCode: PropTypes.string,
    eventCategory: PropTypes.string,
    ecommerceCategory: PropTypes.string,
  }),
  onCompleted: PropTypes.func,
  variant: PropTypes.oneOf([STANDARD, EMBEDDED]),
  onClick: PropTypes.func,
  intent: PropTypes.string,
  fluid: PropTypes.bool,
};

AddToCartButton.defaultProps = {
  work: null,
  gaMetadata: null,
  onCompleted: () => null,
  onClick: null,
  variant: STANDARD,
  intent: constants.PRIMARY,
  fluid: false,
};

export default AddToCartButton;
export {
  EMBEDDED,
  STANDARD,
  EmbeddedAddToCartButton,
  StandardAddToCartButton,
};

import Collapsible from '@redbubble/design-system/react/Collapsible';
import TextLink from '@redbubble/design-system/react/TextLink';
import React, { useState } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';


const messages = defineMessages({
  readMore: 'Read more',
});

const HiddenText = ({ children, intl, initialCollapsed }) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const handleClick = (event, toggleCollapsible) => {
    setCollapsed(!collapsed);
    event.target.blur();
    toggleCollapsible();
  };

  const trigger = (params) => {
    const { collapsed: col, toggleCollapsible } = params;
    if (!col) {
      return undefined;
    }
    return (
      <TextLink
        onClick={e => handleClick(e, toggleCollapsible)}
      >
        {intl.formatMessage(messages.readMore)}
      </TextLink>
    );
  };
  return (
    <Collapsible
      trigger={trigger}
      defaultCollapsed
    >
      {children}
    </Collapsible>
  );
};

HiddenText.propTypes = {
  intl: intlShape.isRequired,
  children: PropTypes.node.isRequired,
  initialCollapsed: PropTypes.bool,
};

HiddenText.defaultProps = {
  initialCollapsed: true,
};

export default HiddenText;

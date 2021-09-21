import React from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import cnames from 'classnames';

import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Collapsible from '@redbubble/design-system/react/Collapsible';
import ChevronDownBigIcon from '@redbubble/design-system/react/Icons/ChevronDownBig';
import * as constants from '@redbubble/design-system/react/constants';

import { PREFERS_REDUCED_MOTION } from '../../lib/accessibility';
import styles from './CollapsibleControlGroup.css';

const CollapsibleArrow = posed.div({
  closed: {
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
    transform: 'rotate(0deg)',
  },
  open: {
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
    transform: 'rotate(-180deg)',
  },
});

const handleToggle = (event, toggle) => {
  event.target.blur();
  toggle();
};

const Trigger = ({ collapsed, toggleCollapsible, text, label, topLevel }) => (
  <button className={styles.button} onClick={e => handleToggle(e, toggleCollapsible)}>
    <Box
      display="flex"
      flexDirection="column"
      padding="m"
    >
      <Box display="flex">
        <Box flex="1">
          <Text display="block">
            {topLevel ? <strong>{text}</strong> : text}
          </Text>
        </Box>
        <Box>
          <CollapsibleArrow pose={collapsed ? 'closed' : 'open'} withParent={false}>
            <ChevronDownBigIcon size={constants.MEDIUM} />
          </CollapsibleArrow>
        </Box>
      </Box>
      <Box>
        {collapsed && label && <Text display="block" className={styles.label} type="body2">{label}</Text>}
      </Box>
    </Box>
  </button>
);

Trigger.propTypes = {
  collapsed: PropTypes.bool,
  label: PropTypes.string,
  text: PropTypes.string.isRequired,
  toggleCollapsible: PropTypes.func,
  topLevel: PropTypes.bool.isRequired,
};

Trigger.defaultProps = {
  collapsed: true,
  label: null,
  toggleCollapsible: () => {},
};

export const CollapsibleControlGroupBody = ({ children }) => (
  <Box paddingLeft="m" paddingRight="m" marginBottom="m">
    {children}
  </Box>
);

CollapsibleControlGroupBody.propTypes = {
  children: PropTypes.node,
};

CollapsibleControlGroupBody.defaultProps = {
  children: null,
};

const CollapsibleControlGroup = ({ text, label, topLevel, children }) => (
  <Box className={cnames({ [styles.topLevel]: topLevel })}>
    <Collapsible
      trigger={props => <Trigger {...props} text={text} label={label} topLevel={topLevel} />}
    >
      {children}
    </Collapsible>
  </Box>
);

CollapsibleControlGroup.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
  topLevel: PropTypes.bool,
};

CollapsibleControlGroup.defaultProps = {
  label: null,
  children: [],
  topLevel: false,
};

export default CollapsibleControlGroup;

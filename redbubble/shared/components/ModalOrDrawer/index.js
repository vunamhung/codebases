import React from 'react';
import PropTypes from 'prop-types';
import * as constants from '@redbubble/design-system/react/constants';
import Drawer from '@redbubble/design-system/react/Drawer';
import Modal from '@redbubble/design-system/react/Modal';

const ModalOrDrawer = ({ children, profile, styles, ...sharedProps }) => {
  return profile === constants.MOBILE ? (
    <Drawer data-testid="drawer" from={constants.BOTTOM} size={constants.MEDIUM} {...sharedProps}>
      { children }
    </Drawer>
  ) : (
    <Modal data-testid="modal" size={constants.SMALL} {...sharedProps} >
      {
        (...args) => (
          <div style={styles}>
            { children(...args) }
          </div>
        )
      }
    </Modal>
  );
};

ModalOrDrawer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  profile: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onCloseRequested: PropTypes.func.isRequired,
  accessibleTitle: PropTypes.string.isRequired,
  getApplicationNode: PropTypes.func.isRequired,
};

export default ModalOrDrawer;

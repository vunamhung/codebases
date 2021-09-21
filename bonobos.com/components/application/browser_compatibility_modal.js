import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import Modal from "highline/components/modal"

import styles from "highline/styles/components/application/browser_compatibility_modal.module.css"

class BrowserCompatibilityModal extends React.PureComponent {
  static propTypes = {
    browserUpgradeUrl: PropTypes.string,
    onHandleClose: PropTypes.func,
    showCompatibilityModal: PropTypes.bool,
    onMount: PropTypes.func,
  }

  static defaultProps = {
    browserUpgradeUrl: "",
    onHandleClose: () => {},
    onMount: () => {},
    showCompatibilityModal: false,
  }

  componentDidMount() {
    this.props.onMount()
  }

  render() {
    const { showCompatibilityModal, browserUpgradeUrl, onHandleClose } = this.props

    if (!showCompatibilityModal) {
      return null
    }

    return (
      <div
        className={ classnames(
          "component",
          "browser-compatibility-modal-component",
          styles.component,
        ) }
      >
        <Modal
          layout="small"
          onRequestClose={ () => {
            onHandleClose()
          }  }
        >
          <div className={ styles.content }>Looks like your browser version is unsupported, so some things may not work as expected. Please try upgrading to the newest version by <a aria-label="Navigate to browser upgrade" href={ browserUpgradeUrl } rel='noopener noreferrer' target='_blank'>clicking here</a>, or switch to different browser.</div>
        </Modal>
      </div>
    )
  }
}

export default BrowserCompatibilityModal

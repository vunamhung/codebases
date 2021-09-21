import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import LoadingCurtain from "highline/components/loading_curtain"
import styles from "highline/styles/components/application/apple_pay_loading_curtain.module.css"

const ApplePayLoadingCurtain = ({
  show,
}) => (
  <div className={ classNames(
    "component",
    "apple-pay-loading-curtain-component",
    styles.component,
  ) }>
    { show &&
      <div className={ styles.wrapper }>
        <LoadingCurtain delay={ 400 } layout="dark" show={ show } />
        <div className={ styles.titleText }>
          Almost done.
        </div>
        <div className={ styles.messageText }>
          Please wait while we process your order.
        </div>
      </div>
    }
  </div>
)

ApplePayLoadingCurtain.propTypes = {
  show: PropTypes.bool,
}

ApplePayLoadingCurtain.defaultProps = {
  show: false,
}

export default ApplePayLoadingCurtain

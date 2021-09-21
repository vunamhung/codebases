import React from "react"
import PropTypes from "prop-types"
import ReactCSSTransitionGroup from "react-transition-group/CSSTransitionGroup"
import Delay from "highline/components/delay"
import Spinner from "highline/components/spinner"
import classNames from "classnames"

import styles from "highline/styles/components/loading_curtain.module.css"

const LOADING_CURTAIN_DELAY = 500 // ms

const LoadingCurtain = ({
  delay,
  fullscreen,
  layout,
  onShow,
  show,
}) => {
  if (!show)
    return null

  return (
    <Delay delay={ delay } onShow={ onShow }>
      <ReactCSSTransitionGroup
        transitionName={ {
          appear: styles.loadingCurtainAppear,
          appearActive: styles.loadingCurtainAppearActive,
        } }
        transitionAppear
        transitionAppearTimeout={ 300 }
        transitionEnter={ false }
        transitionLeave={ false }
      >
        <div className={ classNames(
          "component",
          "loading-curtain-component",
          styles.loadingCurtain,
          styles.component,
          fullscreen ? styles.fullscreen : null,
          styles[layout],
        ) }>
          <Spinner
            className={ styles.loadingCurtainSpinner }
            layout={ layout }
          />
        </div>
      </ReactCSSTransitionGroup>
    </Delay>
  )
}

LoadingCurtain.propTypes = {
  delay: PropTypes.number,
  fullscreen: PropTypes.bool,
  layout: PropTypes.oneOf(["dark", "light", "medium"]),
  onShow: PropTypes.func,
  show: PropTypes.bool,
}

LoadingCurtain.defaultProps = {
  delay: LOADING_CURTAIN_DELAY,
  fullscreen: false,
  layout: "light",
  onShow: () => {},
  show: false,
}

export default LoadingCurtain

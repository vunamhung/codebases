import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import { detectTabletWidth } from "highline/utils/viewport"
import ReactCSSTransitionGroup from "react-transition-group/CSSTransitionGroup"
import styles from "highline/styles/components/application/toast.module.css"
import debounce from "lodash.debounce"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class Toast extends React.PureComponent {

  state = { isTablet: true }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)

    this.setState({
      isTablet: detectTabletWidth(),
    })
  }

  componentDidUpdate(prevProps) {
    !prevProps.showToast && this.props.showToast && this.props.beginToastCountdown()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    debounce(() => {
      this.setState({
        isTablet: detectTabletWidth(),
      })
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  render() {
    const { isTablet } = this.state

    const { showToast, toast } = this.props
    const shouldDisplayOnMobile  = (["mobile", "all"].includes(toast.get("displayOn")) && isTablet)
    const shouldDisplayOnDesktop  = (["desktop", "all"].includes(toast.get("displayOn")) && !isTablet)
    return (
      <ReactCSSTransitionGroup
        transitionName={ {
          enter: styles.enter,
          enterActive: styles.enterActive,
          leave: styles.leave,
          leaveActive: styles.leaveActive,
        } }
        transitionEnterTimeout={ 250 }
        transitionLeaveTimeout={ 250 }
      >
        { ((shouldDisplayOnMobile || shouldDisplayOnDesktop)  && showToast) &&
          <div className={ classNames(styles.toast, styles.darkToast)  }>
            { toast.get("message") }
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

Toast.propTypes = {
  beginToastCountdown: PropTypes.func,
  isHeaderMinified: PropTypes.bool,
  showToast: PropTypes.bool,
  toast: ImmutablePropTypes.map,
}

Toast.defaultProps = {
  beginToastCountdown: () => {},
  isHeaderMinified: false,
  showToast: false,
  toast: fromJS({ displayOn: "", message: "" }),
}

export default Toast
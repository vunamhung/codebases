import React from "react"
import PropTypes from "prop-types"
import { detectTabletWidth } from "highline/utils/viewport"
import getConfig from "highline/config/application"
import classNames from "classnames"

import styles from "highline/styles/components/application/drawer.module.css"

class Drawer extends React.PureComponent {
  static propTypes = {
    cartLayout: PropTypes.oneOf(["cart_standard_width", "cart_double_width"]),
    children: PropTypes.node,
    drawerDuration: PropTypes.number,
    isCart: PropTypes.bool,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    overlayDuration: PropTypes.number,
    position: PropTypes.oneOf([ "right", "left" ]),
  }

  static defaultProps = {
    cartLayout: "cart_double_width",
    drawerDuration: 200,
    isCart: false,
    isOpen: false,
    onRequestClose: () => {},
    overlayDuration: 500,
    position: "right",
  }

  state = {
    isClosing: false,
    scrollPosition: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen === false && nextProps.isOpen === true) {
      const scrollTop = document.body.scrollTop
      document.body.classList.add("modal-open")

      if (detectTabletWidth()) {
        document.body.style.top = `-${scrollTop}px`
      }

      this.setState({ scrollPosition: window.scrollY })
    }

    if (this.props.isOpen === true && nextProps.isOpen === false) {
      document.body.classList.remove("modal-open")

      if (detectTabletWidth()) {
        document.body.style.top = ""
        window.scrollTo(0, this.state.scrollPosition)
      }
      this.setState({ isClosing: true })
      setTimeout(() => { this.setState({ isClosing: false }) }, this.props.overlayDuration)
    }
  }

  componentDidUpdate() {
    this.focusOnScrollable()
  }

  handleClose = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onRequestClose()
  }

  handleKeyDown = (e) => {
    if (e.keyCode == 27 /*esc*/) {
      this.props.onRequestClose()
    }
  }

  focusOnScrollable = () => {
    if (this._scrollable) {
      this._scrollable.focus()
    }
  }

  render() {
    const {
      children,
      drawerDuration,
      cartLayout,
      isCart,
      isOpen,
      position,
      overlayDuration,
    } = this.props

    const { isCSSAnimationEnabled } = getConfig()

    return (
      <div className={ classNames(
        "component",
        "drawer-component",
        styles.component,
      ) }>
        <div className={ classNames(
          styles.drawerWrapper,
          styles[position],
          isOpen ? styles.open : ( this.state.isClosing ? styles.closing : styles.closed ),
        ) }
        >
          <div className={ styles.overlay } style={ { transitionDuration: `${isCSSAnimationEnabled ? overlayDuration : 0}ms` } } />

          <div
            className={ styles.scrollable }
            onMouseDown={ this.handleClose }
            onKeyDown={ this.handleKeyDown }
            ref={ (scrollable) => { this._scrollable = scrollable } }
            tabIndex="-1"
          >
            <div
              className={ classNames(
                styles.drawer,
                isCart && styles[cartLayout],
              ) }
              onMouseDown={ (e) => e.stopPropagation() }
              style={ { transitionDuration: `${isCSSAnimationEnabled ? drawerDuration : 0}ms` } }
            >
              <div className={ styles.content }>
                { children }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Drawer

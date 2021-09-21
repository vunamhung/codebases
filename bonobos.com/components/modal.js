import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { detectTabletWidth } from "highline/utils/viewport"
import CloseButton from "highline/components/close_button"

import styles from "highline/styles/components/modal.module.css"

const INNER_CLOSE_BUTTON = [
  "left",
  "legal",
  "right",
  "small",
  "roundedFlexible",
  "roundedFlexibleFullscreen",
  "fullscreen",
  "fullscreenSelect",
  "fullscreenQuiz",
]

const OUTER_CLOSE_BUTTON = [
  "rounded",
  "roundedSmall",
]

class Modal extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    enableCloseButton: PropTypes.bool,
    closeButtonLayout: PropTypes.oneOf([
      "default",
      "noBackground",
    ]),
    layout: PropTypes.oneOf([
      "left",
      "legal",
      "right",
      "roundedFlexible",
      "roundedFlexibleFullscreen",
      "roundedSmall",
      "small",
      "fullscreen",
      "fullscreenSelect",
      "fullscreenQuiz",
    ]),
    onOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    returnFocusRef: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
    transparent: PropTypes.bool,
  }

  static defaultProps = {
    enableCloseButton: true,
    layout: "small",
    onOpen: () => {},
    onRequestClose: () => {},
    transparent: false,
  }

  state = {
    scrollPosition: 0,
  }

  componentDidMount() {
    const scrollPosition = window.scrollY || document.body.scrollTop
    const width = window.innerWidth || document.body.clientWidth

    document.body.classList.add("modal-open")

    if (detectTabletWidth()) {
      document.body.style.top = `-${scrollPosition}px`
      document.body.style.width = `${width}px`
    }

    this.focusOnScrollable()
    this.props.onOpen()
    this.setState({ scrollPosition })
  }

  componentWillUnmount() {
    document.body.classList.remove("modal-open")

    if (detectTabletWidth()) {
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, this.state.scrollPosition)
    }
  }

  handleKeyDown = (e) => {
    if (e.keyCode == 27 /*esc*/) {
      this.handleClose(e)
    }
  }

  handleClose = (e) => {
    const {
      onRequestClose,
      returnFocusRef,
    } = this.props

    e.preventDefault()
    e.stopPropagation()
    onRequestClose()

    // Return focus to originally focused element for accessibility purposes
    if (returnFocusRef && returnFocusRef.current) {
      returnFocusRef.current.focus()
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
      enableCloseButton,
      closeButtonLayout,
      layout,
      transparent,
    } = this.props

    const closeButton = enableCloseButton && (
      <CloseButton
        className={ styles.closeButton }
        label="Close the Dialog Window"
        onClick={ this.handleClose }
        useCloseIcon={ ["rounded", "roundedFlexible", "roundedFlexibleFullscreen", "roundedSmall"].includes(layout) }
        layout={ closeButtonLayout }
      />
    )

    return (
      <div className={ classNames(
        "component",
        "modal-component",
        styles.component,
        styles[layout],
      ) }
      role="dialog"
      aria-live="polite"
      >
        <div className={ styles.overlay } />

        { enableCloseButton && OUTER_CLOSE_BUTTON.includes(layout) &&
          closeButton
        }

        <div
          className={ styles.scrollable }
          onClick={ this.handleClose }
          onKeyDown={ this.handleKeyDown }
          ref={ (scrollable) => this._scrollable = scrollable }
          tabIndex="-1"
        >
          <div
            className={ classNames(
              styles.modal,
              transparent ? styles.transparent : null,
            ) }
            onClick={ (e) => e.stopPropagation() }
          >
            { enableCloseButton && INNER_CLOSE_BUTTON.includes(layout) &&
              closeButton
            }
            <div className={ styles.content }>
              { children }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal

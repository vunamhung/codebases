import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { Map } from "immutable"
import classNames from "classnames"
import Markdown from "highline/components/markdown"
import { CloseIcon } from "highline/components/icons"

import styles from "highline/styles/components/application/tippy_top.module.css"

class TippyTop extends React.PureComponent {

  state = {
    tippyTopHeight: this.tippyTopRef ? this.tippyTopRef.clientHeight : 0,
  }

  componentDidMount() {
    this.props.onTippyTopHeightChange(this.tippyTopRef ? this.tippyTopRef.clientHeight : 0)
  }

  componentDidUpdate() {
    const newTippyTopHeight = this.tippyTopRef ? this.tippyTopRef.clientHeight : 0
    //Only trigger state change event when the tippytop height actually changes
    if (this.state.tippyTopHeight != newTippyTopHeight){
      this.props.onTippyTopHeightChange(this.tippyTopRef ? this.tippyTopRef.clientHeight : 0)
      this.setState({
        tippyTopHeight: this.tippyTopRef ? this.tippyTopRef.clientHeight : 0,
      })
    }
  }

  render() {
    const {
      backgroundColor,
      description,
      textColor,
      title,
      className,
      isOpen,
      onToggleDetails,
      showDetails,
    } = this.props

    if (!title || !isOpen) {
      return null
    }
    return (
      <div
        className={ classNames(
          "component",
          "tippy-top-component",
          styles.component,
          styles[backgroundColor],
          styles[textColor],
          className,
        ) }
        ref={ (tippyTopRef) => this.tippyTopRef = tippyTopRef }
      >
        <div className={ styles.contentWrapper }>
          <div className={ styles.title }>
            <Markdown
              align="center"
              source={ title }
            />
          </div>
          { description &&
            <div>
              { !showDetails &&
                <button
                  aria-label="View details"
                  className={ classNames(styles.showDetails, styles[textColor]) }
                  onClick={ onToggleDetails }
                >
                  Details
                </button>
              }
              { showDetails &&
                <div>
                  <div  id="tippy-top-description" className={ styles.description }>{ description }</div>
                  <button
                    aria-label="Hide details"
                    className={ classNames(styles.hideDetails, styles[textColor]) }
                    onClick={ onToggleDetails }
                  >
                    Hide Details
                  </button>
                </div>
              }
            </div>
          }
        </div>
        <button
          aria-label="Dismiss banner"
          className={ classNames(styles.dismissBtn , styles[textColor]) }
          onClick={ this.props.onClickDismiss }
        >
          <CloseIcon />
        </button>
      </div>
    )
  }
}

TippyTop.propTypes = {
  backgroundColor: PropTypes.string,
  className: PropTypes.string,
  content: ImmutablePropTypes.map,
  description: PropTypes.string,
  isOpen: PropTypes.bool,
  onClickDismiss: PropTypes.func,
  onTippyTopHeightChange: PropTypes.func,
  onToggleDetails: PropTypes.func,
  path: PropTypes.string,
  showDetails: PropTypes.bool,
  textColor: PropTypes.string,
  title: PropTypes.string,
}

TippyTop.defaultProps = {
  content: Map({}),
  isOpen: false,
  backgroundColor: "grey",
  textColor: "light",
  onClickDismiss: () => {},
  onToggleDetails: () => {},
  showDetails: false,
  onTippyTopHeightChange: () => {},
}

export default TippyTop

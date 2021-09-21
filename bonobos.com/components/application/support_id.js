import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Tooltip from "highline/components/tooltip"
import styles from "highline/styles/components/application/support_id.module.css"

class SupportID extends React.PureComponent {
  static propTypes = {
    number: PropTypes.string,
  }

  state = {
    isOpen: false,
  }

  toggleOpen = () => {
    const isOpen = !this.state.isOpen

    isOpen ?
      document.addEventListener("click", this.toggleOpen) :
      document.removeEventListener("click", this.toggleOpen)

    this.setState({ isOpen })
  }

  preventClose = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  handleCopy = () => {
    const textInput = this.inputRef
    textInput.select()
    textInput.setSelectionRange(0, 99999) /*For mobile devices*/
    document.execCommand("copy")
  }

  render() {
    const {
      number,
    } = this.props

    const {
      isOpen,
    } = this.state

    return (
      <div className={ classNames(
        "component",
        "support-id-component",
        styles.component,
      ) }>
        { number &&
          <Tooltip
            isOpen={ isOpen }
            placement="left"
            target={
              <button
                aria-label="Reveal order number"
                className={ styles.supportIDButton }
                onClick={ this.toggleOpen }
              >
                Support ID
              </button>
            }
          >
            <div
              className={ styles.message }
              onClick={ this.preventClose }
            >
              Your Support ID is:
              <input
                ref={ (ref) => { this.inputRef = ref } }
                value={ number }
                readOnly
              />
              <button
                aria-label="Copy order number"
                className={ styles.copyButton }
                onClick={ this.handleCopy }
              >
                Copy
              </button>
            </div>
          </Tooltip>
        }
      </div>
    )
  }
}

export default SupportID
import React from "react"
import { BackToTopArrowIcon } from "highline/components/icons"
import Button from "highline/components/button"
import classNames from "classnames"
import PropTypes from "prop-types"
import styles from "highline/styles/components/back_to_top_button.module.css"

class BackToTopButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: () => {},
  }

  handleBackToTopButtonClicked = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  render(){
    const { onClick } = this.props

    return (
      <div
        className={
          classNames(
            "back-to-top-button-component",
            "component",
            styles.component,
          )
        }
      >
        <Button
          ariaLabel="Back to Top"
          align="block"
          type="button"
          size="xsmall"
          className={ styles.backToTopButton }
          onClick={ () => {
            onClick()
            this.handleBackToTopButtonClicked()
          } }>
          <BackToTopArrowIcon />
        </ Button>
      </div>
    )
  }
}

export default BackToTopButton
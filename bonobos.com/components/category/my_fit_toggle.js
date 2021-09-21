import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import ToggleSlider from "highline/components/toggle_slider"
import styles from "highline/styles/components/category/my_fit_toggle.module.css"

const MyFitToggle = ({ layout, myFitEnabled, onEditMyFitClick, onToggle }) => (
  <div className={ classNames(
    "component",
    "my-fit-toggle-component",
    styles.component,
    styles[layout],
  ) }>
    <div className={ styles.myFit }>My Fit</div>
    <ToggleSlider
      ariaLabel="Toggle My Fit on or off, filtering products"
      checked={ myFitEnabled }
      onChange={ onToggle }
    />
    <a className={ styles.editMyFit } onClick={ onEditMyFitClick } href="/account/fit-preferences">Edit My Fit</a>
  </div>
)

MyFitToggle.propTypes = {
  layout: PropTypes.oneOf(["primary", "header"]),
  myFitEnabled: PropTypes.bool,
  onEditMyFitClick: PropTypes.func,
  onToggle: PropTypes.func,
}

MyFitToggle.defaultProps = {
  layout: "primary",
  myFitEnabled: false,
  onEditMyFitClick: () => {},
  onToggle: () => {},
}

export default MyFitToggle

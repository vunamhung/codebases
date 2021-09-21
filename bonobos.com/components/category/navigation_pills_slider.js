import React from "react"
import HorizontalScrollArea from "highline/components/horizontal_scroll_area"
import NavigationPillItem from "highline/components/category/navigation_pill_item"
import classNames from "classnames"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"

import styles from "highline/styles/components/category/navigation_pills_slider.module.css"


const NavigationPillsSlider = ({ expandedItem, activePath, onClick }) => (

  <div className={ classNames(
    "navigation-pill-component",
    styles.component,
  ) }>

    <HorizontalScrollArea>
      <NavigationPillItem
        text="All"
        link={ expandedItem.get("path") }
        activePath={ activePath }
        onClick= { onClick }
      />

      { expandedItem.get("children").map((child, index) => (
        <NavigationPillItem
          key={ index }
          text={ child.get("label") }
          link={ child.get("path") }
          activePath={ activePath }
          onClick= { onClick }
        />
      )) }

    </HorizontalScrollArea>

  </div>

)

NavigationPillsSlider.propTypes = {
  expandedItem: ImmutablePropTypes.map,
  activePath: PropTypes.string,
  onClick: PropTypes.func,
}

NavigationPillsSlider.defaultProps = {
  activePath: "",
  onClick: () => {},
}

export default NavigationPillsSlider
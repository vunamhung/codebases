import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/horizontal_scroll_area.module.css"

const HorizontalScrollArea = ({ children, layout }) => (
  <div
    className={ classNames(
      "component",
      "horizontal-scroll-area-component",
      styles.component,
      styles[layout],
    ) }
  >
    { children && React.Children.map(children, (child) => (
      <div className={ styles.scrollItem } >
        { child }
      </div>
    )) }
  </div>
)

HorizontalScrollArea.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.oneOf(["fullWidth", "thumbnail", "productTiles"]),
}

HorizontalScrollArea.defaultProps = {
  layout: "fullWidth",
}

export default HorizontalScrollArea

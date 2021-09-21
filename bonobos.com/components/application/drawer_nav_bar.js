import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/application/drawer_nav_bar.module.css"

const DrawerNavBar = ({
  centerContent,
  layout,
  leftCTA,
  leftCTAPrompt,
  onClickLeftCTA,
  onClickRightCTA,
  rightCTA,
  rightCTAPrompt,
}) => (
  <div
    className={ classNames(
      "component",
      "drawer-nav-bar-component",
      styles.component,
      styles[layout],
    ) }
  >
    { leftCTA &&
      <button
        aria-label={ leftCTAPrompt }
        className={ styles.leftCTA }
        onClick={ onClickLeftCTA }
      >
        { leftCTA }
      </button>
    }
    { centerContent &&
      <div className={  styles.centerContent }>
        { centerContent }
      </div>
    }
    { rightCTA &&
      <button
        aria-label={ rightCTAPrompt }
        className={ styles.rightCTA }
        onClick={ onClickRightCTA }
      >
        { rightCTA }
      </button>
    }
  </div>
)

DrawerNavBar.propTypes = {
  centerContent: PropTypes.node,
  layout: PropTypes.oneOf(["primary", "secondary"]),
  leftCTA: PropTypes.node,
  leftCTAPrompt: PropTypes.string,
  onClickLeftCTA: PropTypes.func,
  onClickRightCTA: PropTypes.func,
  rightCTA: PropTypes.node,
  rightCTAPrompt: PropTypes.string,
}

DrawerNavBar.defaultProps = {
  centerContent: null,
  layout: "primary",
}

export default DrawerNavBar

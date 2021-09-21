import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/nav_item.module.css"

const NavItem = ({
  children,
  decoration,
  isActive,
  layout,
  onClick,
}) => (
  <div
    className={ classNames(
      "component",
      "nav-item-component",
      styles.component,
      styles[layout],
      styles[decoration],
      isActive ? styles.active : null,
    ) }
    onClick={ onClick }
  >
    { children }
  </div>
)

NavItem.propTypes = {
  children: PropTypes.node,
  decoration: PropTypes.oneOf(["dark", "accent"]),
  isActive: PropTypes.bool,
  layout: PropTypes.string,
  onClick: PropTypes.func,
}

NavItem.defaultProps = {
  decoration: "accent",
  isActive: false,
  onClick: () => {},
}

export default NavItem

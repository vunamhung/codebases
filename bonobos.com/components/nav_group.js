import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/nav_group.module.css"

const NavGroup = ({
  activeItemName,
  align,
  children,
  decoration,
  display,
  layout,
  onChange,
}) => {
  const handleClick = (name) => {
    if (name !== activeItemName) {
      onChange(name)
    }
  }

  return (
    <div
      className={ classNames(
        "component",
        "nav-group-component",
        styles.component,
        styles[layout],
        styles[decoration],
        display ? styles[display] : null,
        align ? styles[align] : null,
      ) }
      role="navigation"
    >
      { React.Children.map(children, ((child) => {
        if (!child) { return }
        return (
          React.cloneElement(child, {
            decoration,
            isActive: child.props.name === activeItemName,
            key: child.props.name,
            layout,
            onClick: () => handleClick(child.props.name),
          })
        )
      })) }
    </div>
  )
}

NavGroup.propTypes = {
  activeItemName: PropTypes.string.isRequired,
  align: PropTypes.oneOf(["center", "left", "right"]),
  children: PropTypes.node.isRequired,
  decoration: PropTypes.oneOf(["dark", "accent"]),
  display: PropTypes.oneOf(["inline", "block"]),
  layout: PropTypes.oneOf(["sliding", "tabbed", "link", "swatch"]),
  onChange: PropTypes.func,
}

NavGroup.defaultProps = {
  decoration: "accent",
  layout: "sliding",
  onChange: () => {},
}

export default NavGroup

import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "highline/styles/components/alert_tag.module.css"

const AlertTag = ({ className, layout, children }) => (
  <div
    className={ classNames(
      "component",
      "alert-tag-component",
      styles.component,
      className,
      styles[layout],
    ) }
  >
    <span className={ styles.children } >
      {children}
    </span>
  </div>
)

AlertTag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  layout: PropTypes.oneOf(["medium", "small", "adaptive"]),
}

AlertTag.defaultProps = {
  layout: "medium",
}

export default AlertTag

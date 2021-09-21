import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/tab_item.module.css"

const TabItem = ({
  children,
  className,
}) => (
  <div
    className={ classNames(
      "component",
      "tab-item-component",
      styles.component,
      className,
    ) }
  >
    { children }
  </div>
)

TabItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onActive: PropTypes.func,
  title: PropTypes.node,
  titleContent: PropTypes.node,
}

export default TabItem

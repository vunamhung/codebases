import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/list.module.css"

const List = ({ children }) => (
  <ul
    className={ classNames(
      "component",
      "list-component",
      styles.component,
    ) }
  >
    { children && React.Children.map(children, (child) => (
      <li>{ child }</li>
    )) }
  </ul>
)

List.propTypes = {
  children: PropTypes.node,
}

export default List

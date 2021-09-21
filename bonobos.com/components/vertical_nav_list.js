import React from "react"
import PropTypes from "prop-types"

const VerticalNavList = ({
  children,
}) => (
  <ul className={ "vertical-nav-list-component" }>
    { children }
  </ul>
)

VerticalNavList.propTypes = {
  children: PropTypes.node,
}

export default VerticalNavList

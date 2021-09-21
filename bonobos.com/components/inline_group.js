import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/inline_group.module.css"

const InlineGroup = ({ children, className, ...other }) => (
  <div className={ classNames(
    styles.component,
    "inline-group-component",
    className,
  ) }>
    {
      React.Children.toArray(children).map((child, index) => (
        <div key={ index } className={ styles.inlineWrapper }>
          {
            React.cloneElement(child, {
              ...child.props,
              ...other,
            })
          }
        </div>
      ))
    }
  </div>
)

InlineGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default InlineGroup

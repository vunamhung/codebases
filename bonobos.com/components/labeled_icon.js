import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "highline/styles/components/labeled_icon.module.css"

const LabeledIcon = ({
  children,
  className,
  horizontal,
  light,
  shouldHover,
  svg,
  ...other
}) => (
  <div
    className={ classNames(
      "component",
      "labeled-icon-component",
      styles.component,
      className,
      horizontal ? styles.horizontal : styles.vertical,
      shouldHover && styles.shouldHover,
    ) }
    { ...other }
  >
    <div
      className={ styles.icon }>
      { svg }
    </div>

    { children &&
      <div
        className={ classNames(
          styles.children,
          light && styles.light,
          shouldHover && styles.shouldHover,
        ) }>
        { children }
      </div>
    }
  </div>
)

LabeledIcon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  light: PropTypes.bool,
  shouldHover: PropTypes.bool,
  svg: PropTypes.node.isRequired,
}

LabeledIcon.defaultProps = {
  horizontal: false,
  light: false,
  shouldHover: true,
}

export default LabeledIcon

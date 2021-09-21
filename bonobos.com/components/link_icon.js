import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import LabeledIcon from "highline/components/labeled_icon"
import styles from "highline/styles/components/link_icon.module.css"

const LinkIcon = ({ children, className, light, svg, horizontal, ...other }) => (
  <a
    className={ classNames(
      "component",
      "link-icon-component",
      styles.component,
      className,
    ) }
    { ...other }
  >
    { children &&
      <LabeledIcon
        className={ styles.iconWithText }
        svg={ svg }
        light={ light }
        horizontal={ horizontal }
      >
        { children }
      </LabeledIcon>
    }

    { !children &&
      <div className={ styles.icon }>
        { svg }
      </div>
    }
  </a>
)

LinkIcon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  light: PropTypes.bool,
  svg: PropTypes.node.isRequired,
}

LinkIcon.defaultProps = {
  light: false,
}

export default LinkIcon

import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/text_tag.module.css"

class TextTag extends React.PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  render() {
    const { checked, children, className, disabled, readOnly, ...other } = this.props

    return (
      <div
        className={ classNames(
          "text-tag-component",
          "component",
          styles.component,
          className,
        ) }
        { ...other }
      >
        <div
          className={ classNames(
            styles.container,
            checked ? styles.checked : styles.unchecked,
            disabled ? styles.disabled : null,
            readOnly ? styles.readOnly : null,
          ) }
        >
          <span className={ styles.text }>{ children }</span>
        </div>
      </div>
    )
  }
}

export default TextTag

import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import styles from "highline/styles/components/toggle_item.module.css"

const handleClick = (e, cb, name, value) => {
  e.preventDefault()
  cb(name, value)
}

const handleKeyPress = (e, cb, name, value) => {
  if (e.key == "Enter") {
    cb(name, value)
  }
}

const handleChange = () => {
  /* suppress warning from react about no onChange handler
   * when setting "checked". We need onClick to allow deselect.
   */
}

const ToggleItem = ({
  checked,
  children,
  className,
  color,
  disabled,
  labelStyles,
  layout,
  name,
  onChange,
  size,
  soldOut,
  type,
  value,
  handleSwatchMouseEnter,
  handleSwatchMouseLeave,
  showFitImages,
}) => {
  const shouldRenderCircle = layout === "smallCircleInline" || layout === "checkbox"
  return (
    <div
      className={ classNames(
        "toggle-item-component",
        "component",
        styles.component,
        className,
        styles[layout],
        ["text", "default"].includes(layout) && styles[size], // Only apply custom sizes to text/default options
        checked ? styles.selectedItem : "",
        disabled && type === "checkbox" && styles.disabledCheckbox,
        showFitImages && styles.fitEdItem,
        soldOut && !color && styles.soldOut,
      ) }
      onMouseEnter={ () => handleSwatchMouseEnter(name, value) }
      onMouseLeave={ handleSwatchMouseLeave }
    >
      <label className={ classNames(styles.container, labelStyles, showFitImages && styles.fitEdItem) }>
        { shouldRenderCircle &&
          <div className={ classNames(
            styles.circleLarge,
            color && styles[color],
            color && styles.colorCircle,
            checked ? styles.selected : "",
          ) }>
          </div>
        }
        <input
          aria-label={ `Select ${name} ${value}, filters out options not available` }
          checked={ checked }
          className={ styles.toggleItem }
          disabled={ disabled }
          name={ name }
          onClick={ (e) => handleClick(e, onChange, name, value) }
          onChange={ (e) => handleChange(e) }
          onKeyPress={ (e) => type === "checkbox" ? handleKeyPress(e, onChange, name, value) : null }
          type={ type }
          value={ value }
        />
        {
          React.Children.map(children, (child) => (
            React.cloneElement(child, { checked, disabled })
          ))
        }
      </label>
    </div>
  )
}

ToggleItem.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(["black", "blue", "brown", "green", "grey", "khaki", "multi", "orange", "pink", "purple", "red", "white", "yellow"]),
  disabled: PropTypes.bool,
  handleSwatchMouseEnter: PropTypes.func,
  handleSwatchMouseLeave: PropTypes.func,
  labelStyles: PropTypes.string,
  layout: PropTypes.oneOf(["default", "swatch", "text", "payments", "vertical", "smallCircleInline", "checkbox"]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  showFitImages: PropTypes.bool,
  size: PropTypes.oneOf(["small", "large"]),
  soldOut: PropTypes.bool,
  type: PropTypes.oneOf(["radio", "checkbox"]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
}

ToggleItem.defaultProps = {
  checked: false,
  handleSwatchMouseEnter: () => {},
  handleSwatchMouseLeave: () => {},
  layout: "default",
  onChange: () => {},
  size: "large",
  soldOut: false,
}

export default ToggleItem

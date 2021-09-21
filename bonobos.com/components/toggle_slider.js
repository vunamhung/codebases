import PropTypes from "prop-types"
import classnames from "classnames"
import styles from "highline/styles/components/toggle_slider.module.css"

const ToggleSlider = ({
  ariaLabel,
  checked,
  disabled,
  name,
  onChange,
}) => (
  <div className={ classnames(
    styles.component,
    checked && styles.checked,
    disabled && styles.disabled,
  ) }>
    <label className={ classnames("toggleSliderLabel", styles.label) }>
      <input
        aria-label={ ariaLabel }
        checked={ checked }
        className={ classnames("toggleSlider", styles.checkbox) }
        name={ name }
        onChange={ (e) => { onChange(e.target.checked) } }
        type="checkbox"
        disabled={ disabled }
      />
      <span className={ styles.inner }></span>
      <span className={ styles.switch }></span>
    </label>
  </div>
)

ToggleSlider.propTypes = {
  ariaLabel: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

ToggleSlider.defaultProps = {
  checked: false,
  disabled: false,
}

export const ToggleSliderWithLabel = (props) => {
  const {
    disabled,
    label,
    hint,
  } = props

  return (
    <span className={ classnames(
      styles.componentWithLabel,
      disabled && styles.disabled,
    ) }>
      <label>
        <ToggleSlider { ...props } />
        <span className={ styles.textLabel }>
          { label }
        </span>
        { hint &&
          <span className={ styles.textHint }>
            { hint }
          </span>
        }
      </label>
    </span>
  )
}

ToggleSliderWithLabel.propTypes = {
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  label: PropTypes.string,
}

ToggleSlider.defaultProps = {
  disabled: false,
}

export default ToggleSlider

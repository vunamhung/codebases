import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { SlideDown } from "react-slidedown"
import FitEducator from "highline/components/pdp/fit_educator"
import classNames from "classnames"
import { ChevronIcons } from "highline/components/icons"
import styles from "highline/styles/components/toggle_group.module.css"

class ToggleGroup extends React.PureComponent {
  static propTypes = {
    canDeselect: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    isFinalSale: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    isCollapsible: PropTypes.bool,
    isMobile: PropTypes.bool,
    layout: PropTypes.oneOf(["default", "swatch", "text", "payments", "vertical", "smallCircleInline", "checkbox"]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onOptionToggle: PropTypes.func,
    showError: PropTypes.bool,
    showFitImages: PropTypes.bool,
    styles: PropTypes.object,
    title: PropTypes.node,
    titleSupplement: PropTypes.node,
    type: PropTypes.oneOf(["radio", "checkbox"]).isRequired,
    value: PropTypes.oneOfType([
      ImmutablePropTypes.list,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    canDeselect: false,
    isFinalSale: false,
    isCollapsed: false,
    isCollapsible: true,
    isMobile: false,
    layout: "default",
    onChange: () => {},
    onOptionToggle: () => {},
    showError: false,
    value: "",
  }

  state = {
    showFitEducator: true,
  }

  handleChange = (_, value) => {
    const alreadySelected = (value === this.props.value)
    if (alreadySelected) {
      this.props.canDeselect && this.props.onChange(this.props.name, null)
      this.handleFitChange(false)
    } else {
      this.props.onChange(this.props.name, value)
      this.handleFitChange(true)
    }
  }

  handleToggleClick = () => {
    const {
      name,
      onOptionToggle,
      isCollapsible,
    } = this.props
    if (isCollapsible) {
      onOptionToggle(name)
    }
  }

  handleFitChange = (toggle) => {
    const {
      name,
    } = this.props

    name.includes("Fit") && this.setState({
      showFitEducator: toggle,
    })
  }

  getChildProps = (child) => {
    const checked = this.props.type === "radio"
      ? this.props.value === child.props.value
      : this.props.value.includes(child.props.value)

    return {
      checked,
      layout: this.props.layout,
      name: this.props.name,
      onChange: this.handleChange,
      type: this.props.type,
    }
  }

  render() {
    const {
      className,
      isFinalSale,
      isCollapsed,
      isCollapsible,
      isMobile,
      layout,
      name,
      title,
      titleSupplement,
      showError,
      showFitImages,
    } = this.props
    const { showFitEducator } = this.state

    const children = React.Children.toArray(this.props.children).map((child) =>
      React.cloneElement(child, this.getChildProps(child)),
    )
    const toggleList = (
      <div className={ showFitImages ? styles.toggleFitList : styles.toggleList }>
        { children }
        { showFitEducator && name.includes("Fit") &&
          <FitEducator
            fitType={ name }
            handleFitChange={ this.handleFitChange }
          />
        }
      </div>
    )
    const showSlideDown = isMobile && isCollapsible
    const areAllChildrenDisabled = !(isFinalSale && layout === "swatch") ? children.every((node) => node.props.disabled): false
    const titleSupplementStyles = (titleSupplement === "On Sale") ? styles.onSaleTitleSupplement : styles.titleSupplement

    return (
      <div
        className={ classNames(
          "component",
          "toggle-group-component",
          styles.component,
          className,
          styles[layout],
        ) }
      >
        { (title || titleSupplement) &&
          <div
            className={ classNames(styles.titleContainer, areAllChildrenDisabled && styles.disabledToggleGroup ) }
            onClick={ this.handleToggleClick }
          >
            <div>
              { title &&
                <span className={ styles.title }>{ title }</span>
              }
              { titleSupplement &&
                <span className={ titleSupplementStyles }>{ titleSupplement }</span>
              }
              { showError &&
                <span className={ styles.errorText }>{ `Select ${title.toLowerCase()}` }</span>
              }
            </div>
            { isCollapsible &&
              <button
                className={ styles.chevronButton }
                aria-label={ `${isCollapsed ? "Expand" : "Collapse"} ${name} section` }
              >
                <div className={ classNames(styles.chevron, !isCollapsed && styles.chevronUp) }>
                  <ChevronIcons.Left />
                </div>
              </button>
            }
          </div>
        }

        { showSlideDown
          ? <SlideDown closed={ isCollapsed }>{ toggleList }</SlideDown>
          : toggleList
        }
      </div>
    )
  }
}

export default ToggleGroup

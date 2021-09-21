import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { FilterIcon } from "highline/components/icons"
import styles from "highline/styles/components/category/filter_button.module.css"

const FilterButton = ({
  label,
  onClick,
}) => (
  <button
    aria-label={ label }
    className={ classNames(
      "component",
      "filter-button-component",
      styles.component,
    ) }
    onClick={ onClick }
  >
    <FilterIcon />
  </button>
)

FilterButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
}

FilterButton.defaultProps = {
  label: "",
  onClick: () => {},
}

export default FilterButton

import React from "react"
import PropTypes from "prop-types"
import Button from "highline/components/button"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import { Map, List } from "immutable"
import { checkImmutable } from "highline/utils/immutable_helper"
import styles from "highline/styles/components/category/applied_filters.module.css"

const AppliedFilters = ({
  appliedFilters,
  handleSaveToMyFitClick,
  isLoggedIn,
  myFitEnabled,
  onClearClick,
  userHasFitPreferences,
}) => (
  <div className={ classNames(
    "component",
    "selected-filters-component",
    styles.component,
  ) }>

    <div className={ styles.filteredBy }>
      Filtered by
    </div>

    { appliedFilters.map((appliedFilter) => {
      const filter = checkImmutable(appliedFilter, Map)
      const filterValues = filter.get("values") || List()
      const multipleValues = filterValues.size > 1

      return (
        <div className={ styles.filters } key={ filter.get("name") }>
          <span className={ styles.optionType }>
            { `${ mapPresentation(filter.get("presentation")) }: ` }
          </span>

          { filterValues.map((filterValue) => {
            const value = checkImmutable(filterValue, Map)

            return (
              <span
                className={ classNames(
                  styles.optionValue,
                  multipleValues ? styles.list : null,
                ) }
                key={ `${ filter.get("name") }-${ value.get("name") }` }
              >
                { value.get("presentation") }
              </span>
            )
          }) }
        </div>
      )
    }) }

    <Button
      className={ styles.clearButton }
      onClick={ onClearClick }
      align="inline"
      layout="plain-text"
      size="small"
    >
      Clear Filters
    </Button>

    { !myFitEnabled &&
      <Button
        align="inline"
        ariaLabel={ isLoggedIn ? null : "Create account or log in to save filters to My Fit" }
        size="xsmall"
        rounded
        onClick={ handleSaveToMyFitClick }
      >
        { `${ userHasFitPreferences ? "Add" : "Save" } to My Fit` }
      </Button>
    }
  </div>
)

const mapPresentation = (presentation) => {
  return presentation == "Base Color" ? "Color" : presentation
}

AppliedFilters.propTypes = {
  appliedFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  handleSaveToMyFitClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  myFitEnabled: PropTypes.bool,
  onClearClick: PropTypes.func,
  userHasFitPreferences: PropTypes.bool,
}

AppliedFilters.defaultProps = {
  appliedFilters: List(),
  handleSaveToMyFitClick: () => {},
  isLoggedIn: false,
  myFitEnabled: false,
  onClearClick: () => {},
  userHasFitPreferences: false,
}

export default AppliedFilters

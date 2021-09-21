import React from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import classNames from "classnames"
import { Map, List } from "immutable"
import MyFitToggle from "highline/components/category/my_fit_toggle"
import FilterOptionGroup from "highline/components/category/filter_option_group"
import Button from "highline/components/button"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"
import styles from "highline/styles/components/category/filter_options.module.css"

const FilterOptions = ({
  availableFilters,
  contentfulFitData,
  displayType,
  editMyFitClick,
  expandedStyle,
  handleMyFitToggle,
  handleOptionClick,
  handleSaveToMyFitClick,
  isLoggedIn,
  layout,
  myFitEnabled,
  onClearClick,
  onDoneClick,
  selectedFilters,
  shouldShowFitImages,
  showSaveFiltersButton,
  userHasFitPreferences,
}) => (
  <div className={ classNames(
    "component",
    "filter-options-component",
    expandedStyle ? "expanded-filter": "",
    styles.component,
    styles[layout],
  ) }>
    <div className={ styles.filterOptionsWrapper }>
      <div className={ styles.myFitControllerContainer }>
        { isLoggedIn &&
          <MyFitToggle
            myFitEnabled={ myFitEnabled }
            onEditMyFitClick={ editMyFitClick }
            onToggle={ handleMyFitToggle }
          />
        }
        { showSaveFiltersButton && !myFitEnabled &&
          <Button
            align="inline"
            ariaLabel={ isLoggedIn ? null : "Create account or log in to save filters to My Fit" }
            size="xsmall"
            rounded
            onClick={ () => {
              handleSaveToMyFitClick()
              onDoneClick()
            } }
          >
            { `${ userHasFitPreferences ? "Add" : "Save" } to My Fit` }
          </Button>
        }
      </div>
      { availableFilters.map((filter) => {
        const fitEducators = getField(getObjectByFirstField(contentfulFitData, filter.get("name")), "fitEducators")
        return (
          <FilterOptionGroup
            showFitImages={ fitEducators && shouldShowFitImages }
            fitEducators={ fitEducators }
            key={ filter.get("name") }
            filters={ filter.get("values") }
            filterName={ filter.get("name") }
            filterPresentation={ filter.get("presentation") }
            handleOptionClick={ handleOptionClick }
            displayType={ displayType }
            selectedFilters={ selectedFilters.get(filter.get("name")) }
            isDisabled={ myFitEnabled }
          />
        )
      }) }
    </div>
    <div className={ styles.buttons }>
      <Button className={ styles.button } layout="secondary-outline" onClick={ onClearClick } >
        Clear Filters
      </Button>
      <Button className={ styles.button } layout="primary" onClick={ onDoneClick }>
        Show Products
      </Button>
    </div>
  </div>
)

FilterOptions.propTypes = {
  availableFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  contentfulFitData: ImmutablePropTypes.map,
  displayType: PropTypes.oneOf(["toggle","checkbox"]),
  editMyFitClick: PropTypes.func,
  expandedStyle: PropTypes.bool,
  handleMyFitToggle: PropTypes.func,
  handleOptionClick: PropTypes.func,
  handleSaveToMyFitClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  layout: PropTypes.oneOf(["default", "fullScreen"]),
  myFitEnabled: PropTypes.bool,
  onClearClick: PropTypes.func,
  onDoneClick: PropTypes.func,
  selectedFilters: ImmutablePropTypes.map,
  shouldShowFitImages: PropTypes.bool,
  showSaveFiltersButton: PropTypes.bool,
  userHasFitPreferences: PropTypes.bool,
}

FilterOptions.defaultProps = {
  availableFilters: List(),
  editMyFitClick: () => {},
  expandedStyle: false,
  handleMyFitToggle: () => {},
  handleOptionClick: () => {},
  handleSaveToMyFitClick: () => {},
  isLoggedIn: false,
  layout: "default",
  myFitEnabled: false,
  onClearClick: () => {},
  onDoneClick: () => {},
  selectedFilters: Map(),
  shouldShowFitImages: false,
  showSaveFiltersButton: false,
  userHasFitPreferences: false,
}

export default FilterOptions

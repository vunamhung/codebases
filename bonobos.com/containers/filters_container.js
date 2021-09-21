import { connect } from "react-redux"
import { Map } from "immutable"
import FilterDropdownMenu from "highline/components/category/filter_dropdown_menu"
import { getObjectByFirstField, getField } from "highline/utils/contentful/contentful_helper"

import {
  clearFiltersAsync,
  editMyFitClicked,
  filterClickedAsync,
  filtersClosed,
  filterDropdownClicked,
  toggleMyFitAsync,
} from "highline/redux/actions/filters_actions"

const mapStateToProps = (state) => {
  const contentfulData = state.getIn(["contentful", "globals"])
  const contentfulFitData = getField(getObjectByFirstField(contentfulData, "Fit Educators"), "content")
  return {
    availableFilterDropdowns: state.getIn(["filters", "availableFilterDropdowns"]),
    availableFilters: state.getIn(["filters", "availableFilters"]),
    contentfulFitData,
    currentAvailableFilters: state.getIn(["filters", "currentAvailableFilters"]),
    currentFilterDropdown: state.getIn(["filters", "currentFilterDropdown"]),
    isOpen: state.getIn(["filters", "filtersOpen"]),
    myFitEnabled: state.getIn(["filters", "myFitEnabled"]),
    path: state.getIn(["currentPage", "path"]),
    selectedFilters: state.getIn(["filters", "selectedFilters"]),
    showMyFit: state.getIn(["auth", "isLoggedIn"]),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editMyFitClick: () => {
      dispatch(editMyFitClicked())
    },

    handleClearFiltersClick: () => {
      dispatch(clearFiltersAsync())
    },

    handleFilterDropdownClick: (filterName) => {
      dispatch(filterDropdownClicked(filterName))
    },

    handleFiltersClose: () => {
      dispatch(filtersClosed())
    },

    handleMyFitToggle: () => {
      dispatch(toggleMyFitAsync())
    },

    handleOptionClick: (optionName, optionValue) => {
      dispatch(filterClickedAsync(Map({
        type: optionName,
        value: optionValue,
      })))
    },
  }
}

const FiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterDropdownMenu)

export default FiltersContainer

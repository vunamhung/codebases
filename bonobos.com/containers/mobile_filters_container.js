import { connect } from "react-redux"
import { Map } from "immutable"
import FilterButtonWithModal from "highline/components/category/filter_button_with_modal"

import {
  clearFiltersAsync,
  editMyFitClicked,
  filterClickedAsync,
  filterDropdownClicked,
  filtersClosed,
  toggleMyFitAsync,
  toggleModalVisibility,
} from "highline/redux/actions/filters_actions"

const mapStateToProps = (state) => {
  return {
    availableFilters: state.getIn(["filters", "availableFilters"]),
    isLoggedIn: state.getIn(["auth", "isLoggedIn"]),
    isModalVisible: state.getIn(["filters", "modalVisible"]),
    myFitEnabled: state.getIn(["filters", "myFitEnabled"]),
    selectedFilters: state.getIn(["filters", "selectedFilters"]),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editMyFitClick: () => {
      dispatch(editMyFitClicked())
    },

    handleClearFiltersClick: () => {
      dispatch(clearFiltersAsync())
    },

    handleClick: () => {
      dispatch(filterDropdownClicked())
    },

    handleFiltersClose: () => {
      dispatch(filtersClosed())
    },

    handleMyFitToggle: () => {
      dispatch(toggleMyFitAsync())
    },

    handleFilterModalToggle: () => {
      dispatch(toggleModalVisibility())
    },

    handleOptionClick: (optionName, optionValue) => {
      dispatch(filterClickedAsync(Map({
        type: optionName,
        value: optionValue,
      })))
    },

    handleSaveToMyFitClick: ownProps.handleSaveToMyFitClick,
    userHasFitPreferences: ownProps.userHasFitPreferences,
  }
}

const MobileFiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterButtonWithModal)

export default MobileFiltersContainer

import React from "react"
import { List, Map } from "immutable"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import FilterButton from "highline/components/category/filter_button"
import FilterModal from "highline/components/category/filter_modal"
import styles from "highline/styles/components/category/filter_button_with_modal.module.css"

const FilterButtonWithModal = ({
  availableFilters,
  editMyFitClick,
  handleClearFiltersClick,
  handleFilterModalToggle,
  handleFiltersClose,
  handleMyFitToggle,
  handleOptionClick,
  handleSaveToMyFitClick,
  isLoggedIn,
  isModalVisible,
  myFitEnabled,
  selectedFilters,
  userHasFitPreferences,
}) => (
  <div
    className={ classNames(
      "component",
      "filter-button-with-modal-component",
      styles.component,
    ) }
  >
    <FilterButton
      onClick={ handleFilterModalToggle }
    />

    { isModalVisible &&
      <FilterModal
        availableFilters={ availableFilters }
        editMyFitClick={ editMyFitClick }
        handleMyFitToggle={ handleMyFitToggle }
        handleOptionClick={ handleOptionClick }
        handleSaveToMyFitClick={ handleSaveToMyFitClick }
        isLoggedIn={ isLoggedIn }
        myFitEnabled={ myFitEnabled }
        onClearClick={ handleClearFiltersClick }
        onDoneClick={ handleFiltersClose }
        onRequestClose={ handleFilterModalToggle }
        selectedFilters={ selectedFilters }
        userHasFitPreferences={ userHasFitPreferences }
      />
    }
  </div>
)

FilterButtonWithModal.propTypes = {
  onInputChange: PropTypes.func,
  availableFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  editMyFitClick: PropTypes.func,
  handleClearFiltersClick: PropTypes.func,
  handleFilterModalToggle: PropTypes.func,
  handleFiltersClose: PropTypes.func,
  handleMyFitToggle: PropTypes.func,
  handleOptionClick: PropTypes.func,
  handleSaveToMyFitClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  myFitEnabled: PropTypes.bool,
  selectedFilters: ImmutablePropTypes.map,
  userHasFitPreferences: PropTypes.bool,
}

FilterButtonWithModal.defaultProps = {
  availableFilters: List(),
  editMyFitClick: () => {},
  handleClearFiltersClick: () => {},
  handleFilterModalToggle: () => {},
  handleFiltersClose: () => {},
  handleMyFitToggle: () => {},
  handleOptionClick: () => {},
  handleSaveToMyFitClick: () => {},
  isLoggedIn: false,
  isModalVisible: false,
  myFitEnabled: false,
  selectedFilters: Map(),
  userHasFitPreferences: false,
}

export default FilterButtonWithModal

import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { List, Map } from "immutable"
import classNames from "classnames"
import Modal from "highline/components/modal"
import FilterOptions from "highline/components/category/filter_options"
import styles from "highline/styles/components/category/filter_modal.module.css"

const FilterModal = ({
  availableFilters,
  editMyFitClick,
  handleMyFitToggle,
  handleOptionClick,
  handleSaveToMyFitClick,
  isLoggedIn,
  myFitEnabled,
  onClearClick,
  onDoneClick,
  selectedFilters,
  onRequestClose,
  userHasFitPreferences,
}) => (
  <div
    className={ classNames(
      "component",
      "filter-modal-component",
      styles.component,
    ) }
  >
    <Modal
      layout="fullscreenSelect"
      onRequestClose={ onRequestClose }
      closeButtonLayout="noBackground"
    >
      <FilterOptions
        availableFilters={ availableFilters }
        displayType="toggle"
        editMyFitClick={ editMyFitClick }
        layout={ "fullScreen" }
        handleMyFitToggle={ handleMyFitToggle }
        handleOptionClick={ handleOptionClick }
        handleSaveToMyFitClick={ handleSaveToMyFitClick }
        isLoggedIn={ isLoggedIn }
        myFitEnabled={ myFitEnabled }
        onClearClick={ onClearClick }
        onDoneClick={ onDoneClick }
        selectedFilters={ selectedFilters }
        showSaveFiltersButton
        userHasFitPreferences={ userHasFitPreferences }
      />
    </Modal>
  </div>
)

FilterModal.propTypes = {
  availableFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  editMyFitClick: PropTypes.func,
  handleMyFitToggle: PropTypes.func,
  handleOptionClick: PropTypes.func,
  handleSaveToMyFitClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  myFitEnabled: PropTypes.bool,
  onClearClick: PropTypes.func,
  onDoneClick: PropTypes.func,
  onRequestClose: PropTypes.func,
  selectedFilters: ImmutablePropTypes.map,
  userHasFitPreferences: PropTypes.bool,
}

FilterModal.defaultProps = {
  availableFilters: List(),
  editMyFitClick: () => {},
  handleMyFitToggle: () => {},
  handleOptionClick: () => {},
  handleSaveToMyFitClick: () => {},
  isLoggedIn: false,
  myFitEnabled: false,
  onClearClick: () => {},
  onDoneClick: () => {},
  onRequestClose: () => {},
  selectedFilters: Map(),
  userHasFitPreferences: false,
}

export default FilterModal

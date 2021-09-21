import React from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import classNames from "classnames"
import FilterOptions from "highline/components/category/filter_options"
import Button from "highline/components/button"
import MyFitToggle from "highline/components/category/my_fit_toggle"
import { ChevronIcons } from "highline/components/icons"
import SortContainer from "highline/containers/sort_container"
import { fromJS } from "immutable"
import styles from "highline/styles/components/category/filter_dropdown_menu.module.css"

const FILTER_CURTAIN_TIMEOUT = 400

class FilterDropdownMenu extends React.PureComponent {
  state = {
    filtersJustClosed: false,
    filtersLoaded: false,
    shouldShowFitImages: false,
  }

  componentDidMount() {

    if (this.props.currentAvailableFilters.size > 0) {
      this.setState({
        filtersLoaded: true,
        shouldShowFitImages: this.props.currentAvailableFilters.size === 1,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      this.setState({
        filtersLoaded: false,
      })

    } else if (!this.state.filtersLoaded && this.props.currentAvailableFilters.size > 0) {
      this.setState({
        filtersLoaded: true,
        shouldShowFitImages: this.props.currentAvailableFilters.size === 1,
      })
    }

    if (!prevProps.isOpen && this.props.isOpen) { // opened
      document.addEventListener("click", this.closeFilters)
    } else if (prevProps.isOpen && !this.props.isOpen) { // closed
      document.removeEventListener("click", this.closeFilters)
      this.setState({ filtersJustClosed: true })
      setTimeout(() => {
        this.setState({ filtersJustClosed: false })
      }, FILTER_CURTAIN_TIMEOUT)
    }
  }

  closeFilters = () => {
    this.props.handleFiltersClose()
  }

  render() {
    const {
      availableFilterDropdowns,
      contentfulFitData,
      currentAvailableFilters,
      currentFilterDropdown,
      editMyFitClick,
      handleClearFiltersClick,
      handleFilterDropdownClick,
      handleFiltersClose,
      handleMyFitToggle,
      handleOptionClick,
      isOpen,
      myFitEnabled,
      selectedFilters,
      showMyFit,
    } = this.props

    const {
      filtersJustClosed,
      shouldShowFitImages,
    } = this.state
    return (
      <div
        className={ classNames(
          "component",
          "filter-dropdown-menu-component",
          styles.component,
        ) }
        onClick={ (e) => {
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        } }
      >
        <div
          className={ classNames(
            isOpen && styles.open,
            filtersJustClosed && styles.closing,
          ) }
          onClick={ this.closeFilters }
        />
        <div className={ styles.filterBarContainer }>
          <div className={ styles.filterDropdownContainer }>
            { availableFilterDropdowns.map((filterButton) => {
              const areAllFilterOptionsEliminated = filterButton.get("areAllFilterOptionsEliminated")
              const filterTitle = filterButton.get("filterTitle")

              return (
                <Button
                  align="inline"
                  disabled={ areAllFilterOptionsEliminated || myFitEnabled }
                  layout="plain-text"
                  key={ filterTitle }
                  onClick={ () => handleFilterDropdownClick(filterTitle) }
                  className={ currentFilterDropdown === filterTitle ? styles.selectedFilter : null }
                  ariaLabel={ `Toggle filters for ${filterTitle}` }
                >
                  { filterTitle }
                  <div className={ classNames(styles.chevron, styles.chevronFilterButton, areAllFilterOptionsEliminated && styles.disabled) }>
                    <ChevronIcons.Left />
                  </div>
                </Button>
              )
            }) }
            <div className={ styles.myFitContainer }>
              { showMyFit &&
                <MyFitToggle
                  layout="header"
                  myFitEnabled={ myFitEnabled }
                  onEditMyFitClick={ editMyFitClick }
                  onToggle={ handleMyFitToggle }
                />
              }
            </div>
          </div>
          <SortContainer responsiveLayout="hideOnSmartPhoneAndTablet" />
        </div>
        { isOpen &&
          <FilterOptions
            shouldShowFitImages={ shouldShowFitImages }
            availableFilters={ currentAvailableFilters }
            contentfulFitData={ contentfulFitData }
            displayType="checkbox"
            handleOptionClick={ handleOptionClick }
            selectedFilters={ selectedFilters }
            myFitEnabled={ myFitEnabled }
            onClearClick={ handleClearFiltersClick }
            onDoneClick={ handleFiltersClose }
          />
        }
      </div>
    )
  }
}

FilterDropdownMenu.propTypes = {
  availableFilterDropdowns: ImmutablePropTypes.list,
  contentfulFitData: ImmutablePropTypes.list,
  currentAvailableFilters: ImmutablePropTypes.list,
  currentFilterDropdown: PropTypes.string,
  editMyFitClick: PropTypes.func,
  handleClearFiltersClick: PropTypes.func,
  handleFilterDropdownClick: PropTypes.func,
  handleFiltersClose: PropTypes.func,
  handleMyFitToggle: PropTypes.func,
  handleOptionClick: PropTypes.func,
  isOpen: PropTypes.bool,
  myFitEnabled: PropTypes.bool,
  path: PropTypes.string,
  selectedFilters: ImmutablePropTypes.map,
  showMyFit: PropTypes.bool,
}

FilterDropdownMenu.defaultProps = {
  currentAvailableFilters: fromJS([]),
  currentFilterDropdown: "",
  editMyFitClick: () => {},
  handleClearFiltersClick: () => {},
  handleFilterDropdownClick: () => {},
  handleFiltersClose: () => {},
  handleMyFitToggle: () => {},
  handleOptionClick: () => {},
  isOpen: false,
  myFitEnabled: false,
  onClearClick: () => {},
  onDoneClick: () => {},
}

export default FilterDropdownMenu

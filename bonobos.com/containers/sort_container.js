import { connect } from "react-redux"
import SortDropdown from "highline/components/category/sort_dropdown"

import {
  sortDropdownClicked,
  sortMouseEntered,
  sortMouseLeft,
  sortOptionClickedAsync,
} from "highline/redux/actions/sort_actions"

const mapStateToProps = (state, ownProps) => ({
  currentSortOption: state.getIn(["sort", "currentSortOption"]),
  isOpen: state.getIn(["sort", "isOpen"]),
  numItems: state.getIn(["sort", "numItems"]),
  responsiveLayout:  ownProps.responsiveLayout,
  sortOptions: state.getIn(["sort", "sortOptions"]),
})

const mapDispatchToProps = (dispatch) => ({
  onClickDropdown: () => {
    dispatch(sortDropdownClicked())
  },
  onClickSortOption: (sortOption) => {
    dispatch(sortOptionClickedAsync(sortOption))
  },
  onMouseEnter: () => {
    dispatch(sortMouseEntered())
  },
  onMouseLeave: () => {
    dispatch(sortMouseLeft())
  },
})

const SortContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortDropdown)

export default SortContainer

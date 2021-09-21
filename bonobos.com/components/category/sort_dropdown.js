import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import ImmutablePropTypes from "react-immutable-proptypes"
import Tooltip from "highline/components/tooltip"
import { List } from "immutable"
import { ChevronIcons } from "highline/components/icons"

import styles from "highline/styles/components/category/sort_dropdown.module.css"

const SortDropdown = ({
  currentSortOption,
  isOpen,
  numItems,
  onClickDropdown,
  onClickSortOption,
  onMouseEnter,
  onMouseLeave,
  responsiveLayout,
  sortOptions,
}) => (
  <div
    className={ classNames(
      "component",
      "sort-dropdown-component",
      styles.component,
      isOpen ? styles.open : styles.closed,
      styles[responsiveLayout],
    ) }
  >
    <span className={ styles.itemCount }>
      { numItems } { numItems === 1 ? "Item" : "Items" }
    </span>
    { sortOptions.size > 0 &&
      <div
        className={ styles.sortWrapper }
        onMouseEnter={ onMouseEnter }
        onMouseLeave={ onMouseLeave }
      >
        <Tooltip
          placement="bottom"
          layout="account"
          isOpen={ isOpen }
          target={
            <button
              aria-label={ isOpen ? "Close sort options" : "Open sort options" }
              className={ styles.currentSortOption }
              onClick={ onClickDropdown }
            >
              { currentSortOption &&
                <span>
                  <span className={ styles.shortLabel }>Sort</span>
                  <span className={ styles.longLabel }>
                    { " Sorted by " + currentSortOption.get("presentation") }
                  </span>
                </span>
              }
              <span className={ styles.chevron }>
                <ChevronIcons.Left />
              </span>
            </button>
          }
        >
          <ul>
            { sortOptions.map((sortOption, index) => {
              const isActive = currentSortOption.get("name") === sortOption.get("name") && currentSortOption.get("sortOrder") === sortOption.get("sortOrder")
              return  (
                <li key={ index }>
                  <button
                    aria-label={ `Sort by ${ sortOption.get("presentation") }` }
                    className={ isActive ? styles.selected : null }
                    onClick={ () => onClickSortOption(sortOption) }
                  >
                    { sortOption.get("presentation") }
                  </button>
                </li>
              )
            }) }
          </ul>
        </Tooltip>
      </div>
    }
  </div>
)

SortDropdown.propTypes = {
  currentSortOption: ImmutablePropTypes.map,
  isOpen: PropTypes.bool,
  numItems: PropTypes.number,
  onClickDropdown: PropTypes.func,
  onClickSortOption: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  responsiveLayout: PropTypes.string,
  sortOptions: ImmutablePropTypes.list,
}

SortDropdown.defaultProps = {
  isOpen: false,
  onClickDropdown: () => {},
  onClickSortOption: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  responsiveLayout: PropTypes.oneOf(["hideOnDesktop", "hideOnSmartPhoneAndTablet"]),
  sortOptions: List(),
}

export default SortDropdown

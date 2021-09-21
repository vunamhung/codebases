import React, { Fragment } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Button from "highline/components/button"
import styles from "highline/styles/components/category/empty_results.module.css"

const EmptyResults = ({ areAllItemsFilteredOut, onClick }) => (
  <div className={ classNames(
    "component",
    "category-empty-results-component",
    styles.component,
  ) }>
    { !areAllItemsFilteredOut &&
      <p className={ styles.text }>
        Sorry, there are no products on this page
      </p>
    }
    { areAllItemsFilteredOut &&
      <Fragment>
        <p className={ styles.text }>
          Sorry, we are unable to find matching results. Please expand your selections or try a different category.
        </p>
        <div className={ styles.ctaContainer }>
          <Button
            align="inline"
            layout="primary"
            onClick={ onClick }
          >
            Reset Filters
          </Button>
        </div>
      </Fragment>
    }
  </div>
)

EmptyResults.propTypes = {
  areAllItemsFilteredOut: PropTypes.bool,
  onClick: PropTypes.func,
}

EmptyResults.defaultProps = {
  areAllItemsFilteredOut: false,
}

export default EmptyResults

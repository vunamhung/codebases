import React from "react"
import PropTypes from "prop-types"
import { List } from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"

import styles from "highline/styles/components/application/errors.module.css"

class Errors extends React.PureComponent {
  static propTypes = {
    errors: ImmutablePropTypes.list,
    message: PropTypes.string,
  }

  static defaultProps = {
    errors: List(),
    message: null,
  }

  componentDidUpdate() {
    window.scrollTo(0, 0)
  }

  render() {
    const {
      errors,
      message,
    } = this.props

    const hiddenClassName = (errors.isEmpty() && !message) ? "hidden" : ""

    const errorList = errors.map(
      (error, index) => <li className={ styles.error } key={ index }>{ error }</li>,
    )

    return (
      <div
        className={ classNames(
          "component",
          "errors-component",
          styles.component,
          hiddenClassName,
        ) }
      >
        <p className={ styles.message }>{ message }</p>

        { !errorList.isEmpty() &&
          <ul className={ styles.errorList }>
            { errorList }
          </ul>
        }

      </div>
    )
  }
}

export default Errors

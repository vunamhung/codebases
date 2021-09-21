import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const MAX_ATTEMPTS = 50
const RETRY_DELAY = 200

class FriendBuyWidget extends React.PureComponent {
  static propTypes = {
    onMount: PropTypes.func,
    widgetId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onMount: () => {},
  }

  componentDidMount() {
    const { widgetId, onMount } = this.props

    onMount()

    // Wait for Friendbuy pixel to get loaded
    let attempts = 0
    this.pollForFriendbuy = setInterval(() => {
      if (window["friendbuy"]) {
        window["friendbuy"].push(["widget", widgetId])
        clearInterval(this.pollForFriendbuy)
      } else if (attempts++ > MAX_ATTEMPTS) {
        setTimeout(() => { throw "Couldn't find Friendbuy Pixel" })
        clearInterval(this.pollForFriendbuy)
      }
    }, RETRY_DELAY)
  }

  render() {
    const { widgetId } = this.props

    return (
      <div className={ classNames(
        "component",
        "friendbuy-widget-component",
        `friendbuy-${widgetId}`,
      ) }>
      </div>
    )
  }
}

export default FriendBuyWidget

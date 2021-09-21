import React from "react"
import PropTypes from "prop-types"

class Delay extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    delay: PropTypes.number.isRequired,
    onShow: PropTypes.func,
  }

  static defaultProps = {
    delay: 500,
    onShow: () => {},
  }

  state = {
    show: false,
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ show: true })
    }, this.props.delay)
  }

  componentWillUpdate(_, nextState) {
    if (this.state.show === false && nextState.show === true) {
      this.props.onShow()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    if (!this.state.show)
      return null

    return (
      <React.Fragment>
        { this.props.children }
      </React.Fragment>
    )
  }
}

export default Delay

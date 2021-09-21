import React from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import { Map } from "immutable"
import { detectSmartphoneWidth } from "highline/utils/viewport"
import debounce from "lodash.debounce"
import { getStylingObject, getParentStylingObject, getContentBlockStyle } from "highline/utils/contentful/page_styling_helper"
import { getField } from "highline/utils/contentful/contentful_helper"
import PropTypes from "prop-types"
import styles from "highline/styles/components/contentful/contentful_format_component.module.css"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class ContentfulFormatWrapper extends React.PureComponent {

  state = { isSmartphone: true  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    this.setState({
      isSmartphone: detectSmartphoneWidth(),
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => { //Only trigger state change when the window size changes to mobile or to desktop
    debounce(() => {
      if (!this.state.isSmartphone && detectSmartphoneWidth()){
        this.setState({
          isSmartphone: true,
        })
      } else if (!detectSmartphoneWidth()) {
        this.setState({
          isSmartphone: false,
        })
      }
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  render(){
    const {
      blockComponent,
      children,
    } = this.props

    const { isSmartphone } = this.state

    const parentFormat = blockComponent && !isSmartphone ? getParentStylingObject(blockComponent) : null
    const format = blockComponent ? getStylingObject(isSmartphone, blockComponent) : null
    const blockStyle = blockComponent ? getContentBlockStyle(blockComponent) : null

    return (
      getField(blockComponent, "formatting")
        ? <div className={ styles[blockStyle] } style={ parentFormat }>
          <div className="contentFormatWrapper" style={ format }>
            { children }
          </div>
        </div>
        : children
    )
  }
}

ContentfulFormatWrapper.propTypes = {
  blockComponent: ImmutablePropTypes.map,
  children: PropTypes.node,
}

ContentfulFormatWrapper.defaultProps = {
  blockComponent: Map(),
}

export default ContentfulFormatWrapper

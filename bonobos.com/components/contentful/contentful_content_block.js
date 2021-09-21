import React from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import PropTypes from "prop-types"
import Router from "next/router"
import debounce from "lodash.debounce"
import { Map } from "immutable"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import { detectSmartphoneWidth } from "highline/utils/viewport"
import { getBlockStyling, getContentArray, getCommonFormatting } from "highline/utils/contentful/page_styling_helper"
import { getClientSideLink } from "highline/utils/link"
import { getField, getContentType } from "highline/utils/contentful/contentful_helper"
import Fade from "react-reveal/Fade"

import styles from "highline/styles/components/contentful/contentful_content_block.module.css"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class ContentBlock extends React.PureComponent {

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

  handleContentBlockEnter = (e, contentBlockLink) => {
    if (e.key == "Enter") {
      contentBlockLink && navigateToContentBlockLink(contentBlockLink)
    }
  }

  render(){
    const {
      blockComponent,
      callbackFn,
    } = this.props

    const format = getCommonFormatting(blockComponent)

    //Style the content block differently for Desktop and Mobile
    const contentBlockStyling = getBlockStyling(this.state.isSmartphone, format)

    //Set the Content Block's nested items to be normal order or reversed order based on screen size and mobileContentOrder input
    const contentArray = getContentArray(this.state.isSmartphone, format.mobileContentOrder, blockComponent)

    // Sometimes children need info set in the parent component, do that here
    const supplementedContentArray = contentArray.map((content) => {
      // Add percentageWidth for image content
      if (getContentType(content) === "heroImage" || getContentType(content) === "storyPod") {
        return content.mergeDeep({
          fields: {
            desktopPercentageWidth: 1 / format.desktopItemsPerRow,
            mobilePercentageWidth: 1 / format.mobileItemsPerRow,
          },
        })
      }

      return content
    })

    const id= getField(blockComponent,"id")
    const targetUrl= getField(blockComponent,"targetUrl")
    const contentBlockLink = targetUrl ? getClientSideLink(targetUrl) : null
    const showFade= getField(blockComponent,"showFade")

    return (
      <div className={ classNames(
        styles.contentBlockWrapper,
        contentBlockLink && styles.clickable,
      ) }
      tabIndex={ contentBlockLink ? "0" : "-1" }
      role="link"
      aria-label={ contentBlockLink && `Navigate to ${contentBlockLink}` }
      onClick={ () => { contentBlockLink && navigateToContentBlockLink(contentBlockLink) } }
      onKeyDown={ (e) => { this.handleContentBlockEnter(e,contentBlockLink) } }>
        <div className="contentful-block-component" style={ contentBlockStyling } id={ id }>
          { supplementedContentArray &&
            supplementedContentArray.map((component, index) => {
              return showFade
                ? <Fade key={ index }>{ renderContentfulComponent(component, callbackFn, index) }</Fade>
                : renderContentfulComponent(component, callbackFn, index)
            })
          }
        </div>
      </div>
    )
  }
}

const navigateToContentBlockLink = (link) => {
  Router.push(
    link.get("href"),
    link.get("as"),
  )
}

ContentBlock.propTypes = {
  blockComponent: ImmutablePropTypes.map,
  callbackFn: PropTypes.func,
  showFade: PropTypes.bool,
}

ContentBlock.defaultProps = {
  blockComponent: Map(),
  showFade: false,
}

export default ContentBlock

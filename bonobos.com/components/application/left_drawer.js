import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import Drawer from "highline/components/application/drawer"
import DrawerNavBar from "highline/components/application/drawer_nav_bar"
import classNames from "classnames"
import { MobileSearchContainer as SearchContainer } from "highline/containers/search_container"
import MobileNavigationContainer from "highline/containers/mobile_navigation_container"
import { BackArrowIcon, CloseIcon } from "highline/components/icons"
import { useViewportSize } from "highline/hooks/use_viewport_size.hook"

import styles from "highline/styles/components/application/mobile_navigation.module.css"

export const LEFT_DRAWER_OVERLAY_DURATION = 500

const LeftDrawer = ({
  isOpen,
  isRendered,
  onClose,
  onClickLeftCTA,
  isLeftCtaVisible,
  title,
  onLoad,
}) => {
  const { isTablet } = useViewportSize()
  const didMountRef = useRef(false)

  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (didMountRef.current && isOpen && !isTablet) {
      onClose()
    } else {
      didMountRef.current = true
    }
  }, [isTablet])

  const titleContent = isRendered && !isLeftCtaVisible
    ? <SearchContainer className={ styles.SearchContainer } />
    : title

  return (
    <div
      className={ classNames(
        "container",
        "left-drawer-container",
      ) }
    >
      <Drawer
        isOpen={ isOpen }
        isRendered= { isRendered }
        position="left"
        onRequestClose={ onClose }
        overlayDuration={ LEFT_DRAWER_OVERLAY_DURATION }
      >
        <DrawerNavBar
          centerContent={ titleContent }
          leftCTA={ isLeftCtaVisible ? <BackArrowIcon /> : null }
          rightCTA={ isOpen ? <CloseIcon /> : null }
          rightCTAPrompt="Close Navigation"
          leftCTAPrompt="Back to Previous View"
          onClickRightCTA={ onClose }
          onClickLeftCTA={ onClickLeftCTA }
        />

        <MobileNavigationContainer />
      </Drawer>
    </div>
  )
}

LeftDrawer.propTypes = {
  isLeftCtaVisible: PropTypes.bool,
  isOpen: PropTypes.bool,
  isRendered: PropTypes.bool,
  onClickLeftCTA: PropTypes.func,
  onClose:PropTypes.func,
  onLoad:PropTypes.func,
  onOpen: PropTypes.func,
  title: PropTypes.string,
}

LeftDrawer.defaultProps = {
  isLeftCtaVisible: false,
  isOpen: false,
  isRendered: false,
  onClickLeftCTA: () => {},
  onClose: () => {},
  onLoad: () => {},
  onOpen: () => {},
  title: "",
}

export default LeftDrawer

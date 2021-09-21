import React from "react"
import ReactIdSwiper from "react-id-swiper/lib/custom"
import PropTypes from "prop-types"
import classNames from "classnames"
import { ChevronIcons } from "highline/components/icons"
import { detectSmartphoneWidth } from "highline/utils/viewport"
import styles from "highline/styles/components/swiper.module.css"

class Swiper extends React.PureComponent {
  static propTypes = {
    autoplay: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    breakpoints: PropTypes.object,
    centeredSlides: PropTypes.bool,
    direction: PropTypes.oneOf(["horizontal", "vertical"]),
    freeMode: PropTypes.bool,
    index: PropTypes.number,
    loop: PropTypes.bool,
    navigation: PropTypes.object,
    scrollbar: PropTypes.object,
    showBullets: PropTypes.bool,
    showProgressBar: PropTypes.bool,
    slidesPerView: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    spaceBetween: PropTypes.number,
    speed: PropTypes.number,
  }

  static defaultProps = {
    autoplay: false,
    breakpoints: {},
    centeredSlides: false,
    direction: "horizontal",
    freeMode: false,
    index: 0,
    loop: false,
    navigation: {},
    scrollbar: {},
    showBullets: false,
    showProgressBar: false,
    slidesPerView: "auto",
    spaceBetween: 0,
    speed: 300,
  }

  constructor(props) {
    super(props)
    this.reactIdSwiperRef = React.createRef()
    this.state = { isSmartphone: true }
  }

  componentDidMount = () => {
    if (!detectSmartphoneWidth()) {
      const swiper = this.getSwiper()
      if (swiper) {
        swiper.allowTouchMove = false
      }
    }
  }

  componentDidUpdate = (prevProps) => {
    const oldIndex = prevProps.index
    const newIndex = this.props.index
    if (oldIndex !== newIndex) {
      this.slideToCurrentIndex()
    }
    if (!detectSmartphoneWidth()) {
      const swiper = this.getSwiper()
      if (swiper) {
        swiper.allowTouchMove = false
      }
    }
  }

  // There seems to be some delay in when the swiper object gets instantiated
  // As a result, we can't just create a reference to it when the component mounts
  // Therefore, we're accessing the instance through this method, which also memoizes it
  getSwiper = () => (
    this.reactIdSwiperRef.current && this.reactIdSwiperRef.current.swiper
  )

  slideToCurrentIndex = () => {
    const { index } = this.props
    const swiper = this.getSwiper()
    swiper && swiper.slideTo(index)
  }

  render () {
    const { children, showBullets, showProgressBar, ...props } = this.props
    const params = {
      pagination: (showBullets || showProgressBar) ? {
        clickable: true,
        el: ".swiper-pagination",
        type: showProgressBar ? "progressbar" : "bullets",
        renderBullet: (index, className) => {
          return `<span class=${className}><div class=${styles.bullet}></div></span>`
        },
      } : {},
      centeredSlides: true,
      renderNextButton: () =>
        <div className={ classNames("swiper-button-next", styles.swiperButtons ) }>
          <ChevronIcons.Right />
        </div>,
      renderPrevButton: () =>
        <div className={ classNames("swiper-button-prev", styles.swiperButtons ) }>
          <ChevronIcons.Left />
        </div>,
    }

    return (
      <div
        className={ classNames(
          "component",
          "swiper-component",
          styles.component,
        ) }
      >
        <ReactIdSwiper
          ref={ this.reactIdSwiperRef }
          rebuildOnUpdate
          observer
          observeParents
          { ...props }
          { ...params }
        >
          {
            children.map((child, index) => (
              <div key={ index }>{ child }</div>
            ))
          }
        </ReactIdSwiper>
      </div>
    )
  }
}

export default Swiper

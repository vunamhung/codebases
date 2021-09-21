import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { List } from "immutable"
import classNames from "classnames"
import ImageGallery from "highline/components/image_gallery"
import Hero from "highline/components/homepage/hero"
import { ChevronIcons } from "highline/components/icons"
import { detectSmartphoneWidth } from "highline/utils/viewport"
import debounce from "lodash.debounce"
import { isHeroTextLight, isHeroImage } from "highline/utils/carousel_helper"
import styles from "highline/styles/components/homepage/carousel.module.css"

const RESIZE_DEBOUNCE_TIMEOUT = 200

class Carousel extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    currentSlideIndex: PropTypes.number,
    onCtaClick: PropTypes.func,
    onSlide: PropTypes.func,
    showChevron: PropTypes.bool,
    slides: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        align: PropTypes.oneOf(["top", "bottom", "middle"]),
        ctaStyle: PropTypes.oneOf(["primary", "primary-outline", "primary-transparent", "secondary", "secondary-outline", "secondary-transparent", "alternate", "alternate-outline", "alternate-transparent", "warning", "warning-link", "cancel-link"]),
        dark: PropTypes.bool,
        description: PropTypes.string,
        descriptionExtended: PropTypes.array,
        h1: PropTypes.bool,
        justify: PropTypes.oneOf(["left", "right", "center"]),
        landscapeSrc: PropTypes.string.isRequired,
        landscapeVideo: PropTypes.object,
        layout: PropTypes.oneOf(["primary", "secondary-left", "secondary-right"]),
        mobileAlign: PropTypes.oneOf(["mobileTop", "mobileBottom", "mobileMiddle"]),
        onCtaClick: PropTypes.func,
        portraitSrc: PropTypes.string.isRequired,
        portraitVideo: PropTypes.object,
        secondaryBackground: PropTypes.string,
        subDescriptionExtended: PropTypes.array,
        textAlign: PropTypes.string,
        textColor: PropTypes.string,
        textStyleDesktop: PropTypes.oneOf(["large-avenir-medium", "large-avenir-demi", "large-avenir-bold", "small-avenir-medium", "small-avenir-demi", "small-avenir-bold", "small-sang-light", "large-sang-light"]),
        title: PropTypes.string,
        titleExtended: PropTypes.object,
      }),
    ),
  }

  static defaultProps = {
    onCtaClick: () => {},
    onSlide: () => {},
    showChevron: false,
    slides: List(),
  }

  state = {
    isImage: true,
    isTextLight: false,
    slideIndex: 0,
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    this.updateTextColor(this.state.slideIndex)
    this.updateVideoVisibility(this.state.slideIndex)
  }

  componentDidUpdate() {
    this.updateTextColor(this.state.slideIndex)
    this.updateVideoVisibility(this.state.slideIndex)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  handleResize = () => {
    debounce(() => {
      this.updateTextColor(this.state.slideIndex)
      this.updateVideoVisibility(this.state.slideIndex)
    }, RESIZE_DEBOUNCE_TIMEOUT)()
  }

  updateTextColor = (index) => {
    this.setState({
      isTextLight: isHeroTextLight(this.props.slides, index, detectSmartphoneWidth()),
      slideIndex: index,
    })
  }

  updateVideoVisibility = (index) => {
    this.setState({
      isImage: isHeroImage(this.props.slides, index, detectSmartphoneWidth()),
      slideIndex: index,
    })
  }

  handleSlideChange = (index) => {
    this.setState({
      isImage: this.updateVideoVisibility(index),
      isTextLight: this.updateTextColor(index),
    })
    this.props.onSlide(index)
  }

  render() {
    const { className, slides, onCtaClick, showChevron } = this.props
    const { isTextLight, isImage } = this.state

    return (
      <div
        className={ classNames(
          "component",
          "carousel-component",
          styles.component,
          className,
        ) }
      >
        <ImageGallery
          ref={ (i) => this._imageGallery = i && i._imageGallery }
          items={ slides }
          lazyLoad
          showBullets={ slides.size > 1 }
          showNav={ slides.size > 1 }
          showThumbnails={ false }
          showPlayButton={ false }
          showFullscreenButton={ false }
          onSlide={ (i) => { this.handleSlideChange(i) } }
          slideDuration={ 800 }
          renderItem={ (slide) => (
            <Hero
              align={ slide.get("align") }
              altText={ slide.get("altText") }
              ariaLabel={ slide.get("ariaLabel") }
              className={ styles.carouselItem }
              ctas={ slide.get("ctas") }
              ctaStyle= { slide.get("ctaStyle") }
              ctaType="button"
              dark={ slide.get("dark") }
              displayCopy={ slide.get("displayCopy") }
              description={ slide.get("description") }
              descriptionExtended={ slide.get("descriptionExtended") }
              subDescriptionExtended={ slide.get("subDescriptionExtended") }
              h1={ slide.get("h1") }
              justify={ slide.get("justify") }
              layout={ slide.get("layout") }
              linkHeroImage={ slide.get("linkHeroImage") }
              mobileAlign={ slide.get("mobileAlign") }
              mobileDark={ slide.get("mobileDark") }
              mobileTextAlign={ slide.get("mobileTextAlign") }
              portraitSrc={ slide.get("portraitSrc")  || "" }
              portraitVideo={ slide.get("portraitVideo") }
              onCtaClick={ (_, targetUrl) => onCtaClick(targetUrl, this._imageGallery && this._imageGallery.getCurrentIndex(), slide.get("landscapeSrc")) }
              landscapeSrc={ slide.get("landscapeSrc") || "" }
              landscapeVideo={ slide.get("landscapeVideo") }
              secondaryBackground={ slide.get("secondaryBackground") }
              textAlign={ slide.get("textAlign") }
              textColor={ slide.get("textColor") }
              textStyleDesktop={ slide.get("textStyleDesktop") }
              title={ slide.get("title") }
              titleExtended={ slide.get("titleExtended") }
            />
          ) }
        />
        { showChevron && isImage &&
          <div className={ styles.chevronWrapper }>
            <div className={ classNames(
              styles.chevron,
              isTextLight && styles.light,
            ) }>
              <ChevronIcons.CircleDown className={ styles.bounce } />
              <span>Explore</span>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Carousel

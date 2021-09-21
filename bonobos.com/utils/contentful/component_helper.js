import dynamic from "next/dynamic"
import Editorial from "highline/components/contentful/contentful_editorial"
import ContentBlock from "highline/components/contentful/contentful_content_block"
import ContentfulProductTileContainer from "highline/containers/contentful_product_tile_container"
import Video from "highline/components/video"
import Carousel from "highline/components/homepage/carousel"
import ContentfulFormatWrapper from "highline/components/contentful/contentful_format_component"
import { camelize, decamelize } from "humps"
import { getClientSideLink } from "highline/utils/link"
import { fromJS, Map } from "immutable"
import TabGroup from "highline/components/tab_group"
import TabItem from "highline/components/tab_item"
import Cta from "highline/components/cta"
import Swiper from "highline/components/swiper"
import { getField, getContentType, getAssetUrl, getImgixUrl, getContentfulId, getImageDimensions } from "highline/utils/contentful/contentful_helper"
import { toQuizFields } from "highline/utils/contentful/quiz_helper"
import { mobileAlignMap } from "highline/utils/contentful/constants"
import { smartphoneBreakpoint } from "highline/utils/breakpoints"
import styles from "highline/styles/utils/contentful/component_helper.module.css"
const Hero = dynamic(() => import("highline/components/homepage/hero"))
const StoryPod = dynamic(() => import("highline/components/story_pod"))
const DynamicOnPageLoadModalContainer = dynamic(() => import("highline/containers/on_page_load_modal_container"))

/*** Contentful entry Mappings ***/
export const renderContentfulComponent = (entry, callbackFn, index) => {
  if (!entry) return
  const contentTypeId = entry.getIn(["sys", "contentType"]) ? entry.getIn(["sys", "contentType", "sys", "id"]) : null
  
  switch (contentTypeId) {
    case "contentBlock":
      return renderContentBlock(entry, callbackFn, index)
    case "editorial":
      return renderEditorial(entry, callbackFn, index)
    case "image":
      return renderImage(entry, callbackFn, index)
    case "productTile":
      return renderProductTile(entry, index)
    case "heroImage":
      return renderHeroImage(entry, callbackFn, index)
    case "carousel":
      return renderCarousel(entry, callbackFn, index)
    case "flyout":
      return renderFlyoutButton(entry, callbackFn, index)
    case "modal":
      return renderModalButton(entry, callbackFn, index)
    case "video":
      return renderVideo(entry, callbackFn, index)
    case "tabGroup":
      return renderTabGroup(entry, callbackFn, index)
    case "cta":
      return renderCta(entry, callbackFn, index)
    case "storyPod":
      return renderStoryPod(entry, callbackFn, index)
    case "slider":
      return renderSlider(entry, callbackFn, index)
    case "chatTrigger":
      return renderChatTrigger(entry, callbackFn, index)
    case "onPageLoadModal":
      return renderOnPageLoadModal(entry, callbackFn, index)
    default:
      return JSON.stringify(entry)
  }
}

const renderContentBlock = (entry, callbackFn, index) => {
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <ContentBlock blockComponent={ entry } callbackFn={ callbackFn } key={ index } />
    </ContentfulFormatWrapper>
  )
}

const renderEditorial = (entry, callbackFn, index) => {
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Editorial editorialComponent={ entry } callbackFn={ callbackFn } key={ index } />
    </ContentfulFormatWrapper>
  )
}

const renderImage = (entry, callbackFn, index) => {
  const id = getField(entry, "title")
  const destination = getField(entry, "ctaTarget")
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Hero
        { ...toContentfulImageFields(entry) }
        onCtaClick={ () => callbackFn("heroImage", destination, id) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderProductTile = (entry, index) => {
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <ContentfulProductTileContainer
        { ...toProductTileFields(entry) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderHeroImage = (entry, callbackFn, index) => {
  const id = getField(entry, "identifier")
  const destination = getField(entry, "ctaTarget")

  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Hero
        { ...toHeroFields(entry) }
        onCtaClick={ () => callbackFn("heroImage", destination, id) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderCarousel = (entry, callbackFn, index) => {
  const slides = toCarouselFields(entry)
  const showChevron = getField(entry, "showChevron") || false

  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Carousel
        key={ index }
        slides={ slides }
        onSlide={ (i) => callbackFn("carouselScrolled", i, slides.getIn([i, "landscapeSrc"])) }
        onCtaClick={ (dest, i, imgURL) => callbackFn("carouselClicked", i, { destination: dest, image:imgURL }) }
        showChevron={ showChevron }
      />
    </ContentfulFormatWrapper>
  )
}

const renderFlyoutButton = (entry, callbackFn, index) => {
  const trigger = getField(entry, "trigger")
  const content = {
    content: getField(entry, "content"),
    displayTitle: getField(entry, "displayTitle"),
  }
  const flyoutId = getField(entry, "title")
  const ariaLabel = getField(entry, "ariaLabel")
  const contentType = getContentType(entry)
  return (
    <button
      onClick={ () => callbackFn(contentType, content, flyoutId) }
      className={ styles.flyoutButton }
      aria-label={ ariaLabel }
      key={ index }>
      { renderContentfulComponent(trigger, callbackFn, index) }
    </button>
  )
}

const renderModalButton = (entry, callbackFn, index) => {
  const trigger = getField(entry, "trigger")
  const isQuiz = getContentType(getField(entry, "content").first()) === "quiz"
  const content = isQuiz
    ? toQuizFields(getField(entry, "content").first())
    : {
      content: getField(entry, "content"),
      layout: getField(entry, "layout"),
    }

  const modalId = isQuiz ? "Quiz" : getField(entry, "title")
  const ariaLabel = getField(entry, "ariaLabel")
  return (
    <button
      onClick={ () => callbackFn("modal", content, modalId) }
      className={ styles.modalButton }
      aria-label={ ariaLabel }
      key={ index }>
      { renderContentfulComponent(trigger, callbackFn, index) }
    </button>
  )
}

const renderVideo = (entry, callbackFn, index) => {
  const videoId = getField(entry, "title")
  const videoUrl = getAssetUrl(getField( entry, "videoFile"))
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Video
        { ...toVideoFields(entry) }
        onPlay={ () => callbackFn && callbackFn("video", videoUrl, videoId) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderTabGroup = (entry, callbackFn, index) => {
  const tabItems = getField(entry, "tabItems")
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <TabGroup
        layout={ getField(entry, "layout") }
        trackTabClick={ (tabTitle) => callbackFn("tabGroup", getField(entry, "title"), tabTitle) }
        key={ index }
      >
        { tabItems.map((tabItem, tabIndex) => {
          const content = getField(tabItem, "content")
          return (
            <TabItem
              className={ `tab-item-${tabIndex}` }
              title={ getField(tabItem, "title") }
              key={ tabIndex }
            >
              { content.map((component) => renderContentfulComponent(component, callbackFn, index)) }
            </TabItem>
          )
        }) }
      </TabGroup>
    </ContentfulFormatWrapper>
  )
}

const renderCta = (entry, callbackFn, index) => {
  const id = getField(entry, "title")
  const destination = getField(entry, "link")
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Cta
        { ...toCtaFields(entry) }
        onClick={ () => callbackFn("cta", destination, id) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderStoryPod = (entry, callbackFn, index) => {
  const id = getField(entry, "title")
  const destination = getField(entry, "link")
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <StoryPod
        { ...toStoryPodFields(entry) }
        onClick={ () => callbackFn("storyPod", destination, id) }
        key={ index }
      />
    </ContentfulFormatWrapper>
  )
}

const renderSlider = (entry, callbackFn, index) => {
  const content = getField(entry, "content")
  const nextImageComponents = { "hero": true, "image": true, "storyPod": true, "productTile": true }
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      <Swiper
        { ...toSwiperFields(entry) }
        key={ index }
      >
        { content.map((component, subIndex) => {
          const componentType = component.getIn(["sys", "contentType", "sys", "id"])
          if (nextImageComponents[componentType]) {
            component = component.update("fields", ( fields ) => {
              return fromJS({
                ...fields.toJS(),
                isInSliderComponent: true,
                placeholder: "empty",
                priority: true,
              })
            })
          }
          return <div key={ subIndex }>{ renderContentfulComponent(component, callbackFn, "slider"-subIndex) }</div>
        }) 
        }
      </Swiper>
    </ContentfulFormatWrapper>
  )
}

const renderChatTrigger = (entry, callbackFn, index) => {
  const trigger = getField(entry, "trigger")
  const content = {
    content: getField(entry, "content"),
    layout: getField(entry, "layout"),
  }

  const chatTriggerId = getField(entry, "title")
  const ariaLabel = getField(entry, "ariaLabel")
  return (
    <button
      onClick={ () => callbackFn("chatTrigger", content, chatTriggerId) }
      className={ styles.chatTrigger }
      aria-label={ ariaLabel }
      key={ index }>
      { renderContentfulComponent(trigger, callbackFn, index) }
    </button>
  )
}

const renderOnPageLoadModal = (entry, callbackFn, index) => {
  return (
    <ContentfulFormatWrapper blockComponent={ entry } key={ `format-wrapper-${index}` }>
      {/* We are doing this dynamically because there is a circular dependency - this dynamic import prevents it from stalling our build */}
      <DynamicOnPageLoadModalContainer
        { ...toOnPageLoadModalFields(entry) }
      />
    </ContentfulFormatWrapper>
  )
}


const toProductTileFields = (entry) => {
  const primaryImageOverride = getField(entry, "primaryImageOverride") ? getImgixUrl(getField(entry, "primaryImageOverride")) : null
  const secondaryImageOverride = getField(entry, "secondaryImageOverride") ? getImgixUrl(getField(entry, "secondaryImageOverride")) : null
  const color = getField(entry, "color") ? decamelize(camelize(getField(entry, "color").toLowerCase()), { separator: " " }) : null
  const sku = getField(entry, "sku") ? getField(entry, "sku").toUpperCase() : null
  const shouldShowSwatches = getField("entry", "showSwatches")
  const contentfulId = getField(entry, "title")
  const priority = getField(entry, "priority")
  const placeholder = getField(entry, "placeholder")
  return {
    color,
    contentfulId,
    primaryImageOverride,
    secondaryImageOverride,
    shouldShowSwatches,
    sku,
    priority,
    placeholder,
  }
}

const toContentfulImageFields = (entry) => {
  return {
    altText: getField(entry, "altText"),
    ctas: fromJS([
      { ctaText: "",
        targetUrl: getClientSideLink(getField(entry, "targetUrl")).get("as") },
    ]),
    landscapeSrc: getImgixUrl(getField(entry, "image")),
    portraitSrc: getImgixUrl(getField(entry, "image")),
    linkHeroImage: getField(entry, "targetUrl") ? true : false,
    objectFit: "cover",
    placeholder: getField(entry, "placeholder"),
    priority: getField(entry, "priority"),
    isInSliderComponent: getField(entry, "isInSliderComponent"),
  }
}

export const toHeroFields = (hero) => {
  if (!hero) { return } // If a hero doesn't exist that hero will be blank instead of breaking
  const portraitImage = getField(hero, "portraitImage")
  const landscapeImage = getField(hero, "landscapeImage")
  const portraitImageDimensions = getImageDimensions(portraitImage)
  const landscapeImageDimensions = getImageDimensions(landscapeImage)

  return {
    align: getField(hero, "align"),
    altText: getField(hero, "imageAltText"),
    ariaLabel: getField(hero, "ariaLabel"),
    copyWidth: getField(hero, "copyWidth") || "forty-percent",
    ctas: fromJS([
      { ctaText: getField(hero, "ctaText"),
        targetUrl: getClientSideLink(getField(hero, "ctaTarget")).get("as") },
      { ctaText: getField(hero, "secondCtaText"),
        targetUrl: getClientSideLink(getField(hero, "secondCtaTarget")).get("as") },
    ]),
    ctaStyle: getField(hero, "ctaStyle"),
    dark: getField(hero, "dark") || false,
    descriptionExtended: getField(hero, "descriptionExtended"),
    descriptionSize: getField(hero, "descriptionSize"),
    desktopPercentageWidth: getField(hero, "desktopPercentageWidth"),
    h1: getField(hero, "h1"), //boolean value to determine if title should be h1
    justify: getField(hero, "justify") || "center",
    landscapeSrc: getImgixUrl(landscapeImage),
    landscapeWidth: landscapeImageDimensions.get("width"),
    landscapeHeight: landscapeImageDimensions.get("height"),
    landscapeVideo: getField(hero, "landscapeVideo"),
    layout: getField(hero, "layout") || "primary",
    legalText: getField(hero, "legalText"),
    linkHeroImage: getField(hero, "linkHeroImage"),
    mobileAlign: mobileAlignMap[getField(hero, "mobileAlign")] || "mobileMiddle",
    mobileDark: getField(hero, "mobileDark") || false,
    mobilePercentageWidth: getField(hero, "mobilePercentageWidth"),
    mobileTextAlign: getField(hero, "mobileTextAlign"),
    isInSliderComponent: getField(hero, "isInSliderComponent"),
    portraitSrc: getImgixUrl(portraitImage),
    portraitWidth: portraitImageDimensions.get("width"),
    portraitHeight: portraitImageDimensions.get("height"),
    portraitVideo: getField(hero, "portraitVideo"),
    priority: getField(hero, "priority"),
    secondaryBackground: getField(hero, "secondaryBackground"),
    subDescriptionExtended: getField(hero, "subDescriptionExtended"),
    textAlign: getField(hero, "textAlign") || "center",
    textColor: getField(hero, "textColor"),
    textStyleDesktop: getField(hero, "textStyleDesktop") || "large-avenir-demi",
    titleExtended:getField(hero, "titleExtended"),
    titleSize: getField(hero, "titleSize"),
  }
}

export const toCarouselFields = (carousel) => {
  if (!carousel) { return } // If a carousel doesn't exist that carousel will be blank instead of breaking

  const slides = getField(carousel, "heroImages") ? getField(carousel, "heroImages").filter((slide) => slide.get("fields")) : Map()

  return slides.map((hero) => {
    return fromJS(toHeroFields(hero))
  })
}

export const toPromoTileFields = (promoTile) => {
  if (!promoTile) { return }

  return {
    description: getField(promoTile, "description"),
    image: getImgixUrl(getField(promoTile, "image")),
    imageAlt: getField(promoTile, "imageAlt"),
    link: getField(promoTile, "link"),
    markdownPrice: getField(promoTile, "markdownPrice"),
    position: getField(promoTile, "position"),
    price: getField(promoTile, "price"),
    title: getField(promoTile, "title"),
  }
}

const toVideoFields = (video) => {
  if (!video) { return } // If a video doesn't exist that video will be blank instead of breaking

  return {
    autoPlay: getField(video, "autoPlay"),
    captions: getAssetUrl(getField(video, "captions")),
    descriptionText: getField(video, "descriptionText"),
    loop: getField(video, "loop"),
    muted: getField(video, "muted"),
    posterImage: getImgixUrl(getField(video, "posterImage")),
    preload: getField(video, "preload"),
    setCrossOrigin: true,
    transcriptLink: getAssetUrl(getField(video, "transcript")),
    videoURL: getAssetUrl(getField(video, "videoFile")),
  }
}

const toCtaFields = (cta) => {
  if (!cta) { return }

  return {
    align: getField(cta, "align"),
    children: getField(cta, "text"),
    href: getField(cta, "link"),
    layout: getField(cta, "style"),
    rounded: getField(cta, "rounded") || false,
    size: getField(cta, "size"),
  }
}

const toStoryPodFields = (storyPod) => {
  if (!storyPod) { return }
  const portraitImage = getField(storyPod, "portraitImage")
  const landscapeImage = getField(storyPod, "landscapeImage")
  const portraitImageDimensions = getImageDimensions(portraitImage)
  const landscapeImageDimensions = getImageDimensions(landscapeImage)

  return {
    altText: getField(storyPod, "altText"),
    ariaLabel: getField(storyPod, "ariaLabel"),
    description: getField(storyPod, "description"),
    desktopPercentageWidth: getField(storyPod, "desktopPercentageWidth"),
    landscapeSrc: getImgixUrl(landscapeImage),
    landscapeWidth: landscapeImageDimensions.get("width"),
    landscapeHeight: landscapeImageDimensions.get("height"),
    layout: getField(storyPod, "layout"),
    link: getField(storyPod, "link"),
    mobilePercentageWidth: getField(storyPod, "mobilePercentageWidth"),
    placeholder: getField(storyPod, "placeholder"),
    portraitSrc: getImgixUrl(portraitImage),
    portraitWidth: portraitImageDimensions.get("width"),
    portraitHeight: portraitImageDimensions.get("height"),
    priority: getField(storyPod, "priority"),
    textColor: getField(storyPod, "textColor"),
    title: getField(storyPod, "title"),
  }
}

const toSwiperFields = (swiper) => {
  if (!swiper) { return }
  const showScrollBar = getField(swiper, "paginationType") === "Scroll Bar"
  const showProgressBar = getField(swiper, "paginationType") === "Progress Bar"
  const showBullets =  getField(swiper, "paginationType") === "Bullets"
  return {
    autoplay: getField(swiper, "autoPlayDelay") && {
      delay: getField(swiper, "autoPlayDelay"),
    },
    breakpoints: {
      [smartphoneBreakpoint]: {
        slidesPerView: getField(swiper, "mobileItems"),
        spaceBetween: spaceMap[getField(swiper, "mobileSpace")],
      },
    },
    centeredSlides: getField(swiper, "centeredSlides"),
    freeMode: getField(swiper, "freeMode"),
    loop: getField(swiper, "loopMode"),
    navigation: getField(swiper, "showNavigation") ? {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    } : {},
    scrollbar: showScrollBar ? {
      el: ".swiper-scrollbar",
      hide: false,
    } : {},
    showBullets,
    showProgressBar,
    slidesPerView: getField(swiper, "desktopItems"),
    spaceBetween: spaceMap[getField(swiper, "desktopSpace")],
    speed: getField(swiper, "speed"),
  }
}

const toOnPageLoadModalFields = (onPageLoadModal) => {
  return {
    content: {
      content: getField(onPageLoadModal, "content").toJS(),
      layout: getField(onPageLoadModal, "layout"),
    },
    modalId: getField(onPageLoadModal, "title"),
    targetPath: getField(onPageLoadModal, "path"),
    targetVisitCount: getField(onPageLoadModal, "targetVisitCount") || 0,
    entryId: getContentfulId(onPageLoadModal),
  }
}

const spaceMap = {
  "None": 0,
  "Extra Small": 4,
  "Small": 8,
  "Medium": 16,
  "Large": 32,
  "Extra Large": 64,
  "Huge": 128,
}

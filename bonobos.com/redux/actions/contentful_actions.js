import { fetchContentfulDataAsync, fetchContentfulPageAsync, fetchContentfulContentInsertionAsync, fetchContentfulPageExtrasAsync } from "highline/api/contentful_client"
import * as ProductListApi from "highline/api/product_list_api"
import { carouselScrolled } from "highline/redux/actions/carousel_actions"
import { contentfulAnalyticEvents, defaultGlobals, pageExtrasPathPrefixes } from "highline/utils/contentful/constants"
import { toContentfulQuizFields, getNestedQuestions, getSkipNestedQuestion, getSingleSelectedAnswer } from "highline/utils/contentful/quiz_helper"
import { getClientSideLink } from "highline/utils/link"
import Router from "next/router"
import ActionTypes from "highline/redux/action_types"
import { fromJS } from "immutable"


// =======================================================================================
// Contentful "contentInsertion"
// =======================================================================================

export const contentfulInsertedContentFetchAsync = (isPreview, clearContentfulCache) => (
  async (dispatch, getState) => {
    const isInsertedContentLoaded = getState().getIn(["contentful", "isInsertedContentLoaded"])
    if (isInsertedContentLoaded) {
      return
    }
    dispatch(contentfulInsertedContentFetchStarted())
    try {
      const contentfulResponse = await fetchContentfulDataAsync("contentInsertion", isPreview, clearContentfulCache)
      return dispatch(contentfulInsertedContentFetchSucceeded(contentfulResponse))
    } catch (error) {
      return dispatch(contentfulInsertedContentFetchFailed(error))
    }
  }
)

export const contentfulInsertedContentFetchStarted = () => ({
  type: ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_STARTED,
})

export const contentfulInsertedContentFetchSucceeded = (insertedContent) => ({
  type: ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_SUCCEEDED,
  response: insertedContent,
})

export const contentfulInsertedContentFetchFailed = (error) => ({
  type: ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_FAILED,
  error,
})

// =======================================================================================
// Contentful "page"
// =======================================================================================

// This method is responsible for evaluating the requested url and determining if it needs to fetch:
//     1. "Globals" if they have not been fetched yet
//     2. "Page" data if the page url does not have a prefix found in our list of "Page Extras" path prefixes and the url has not been fetched yet
//        OR "Page Extras" data if the page url does match a prefix in our list and the prefix had not been fetched yet
export const contentfulPageFetchAsync = (url, isPreview, clearContentfulCache) => (
  async (dispatch, getState) => {
    const matchedPageExtrasPathPrefix = pageExtrasPathPrefixes.find((elem) => url.startsWith(elem))
    const hasSlug = url.split("/").filter(String).length > 1 // filter(String) removes empty strings from split array
    const pageExtraWithoutSlug = matchedPageExtrasPathPrefix && !hasSlug
    const targetPath = matchedPageExtrasPathPrefix || url
    const isLoadingPage = getState().getIn(["contentful", "isLoadingPage"])
    const hasPageData = !isLoadingPage && getState().getIn(["contentful", "pages", targetPath])
    if (isLoadingPage || hasPageData || pageExtraWithoutSlug) {
      return
    }
    
    dispatch(contentfulPageFetchStarted())
    try {
      // grab globals if we haven't already
      const globalRequest = getState().getIn(["contentful", "globals"]).isEmpty() 
        ? fetchContentfulContentInsertionAsync(defaultGlobals, isPreview, clearContentfulCache, "contentfulData-globals") 
        : new Promise((resolve) => resolve())
      
      // grab the requested "Page" or "Page Extras" data
      const pageRequest = matchedPageExtrasPathPrefix
        ? fetchContentfulPageExtrasAsync(targetPath, isPreview, clearContentfulCache)
        : fetchContentfulPageAsync(targetPath, isPreview, clearContentfulCache)

      // make all contentful requests
      const [globalData, pageData] = await Promise.all([globalRequest, pageRequest])
      
      // persist globals in store
      if (globalData) dispatch(contentfulPageGlobalsSet(globalData))
      
      // persist page data in store
      return dispatch(contentfulPageFetchSucceeded(targetPath, pageData))

    } catch (error) {
      return dispatch(contentfulPageFetchFailed(error))
    }
  }
)

export const contentfulPageFetchStarted = () => ({
  type: ActionTypes.CONTENTFUL_PAGE_FETCH_STARTED,
})

export const contentfulPageFetchSucceeded = (url, pageData) => ({
  type: ActionTypes.CONTENTFUL_PAGE_FETCH_SUCCEEDED,
  url,
  pageData,
})

export const contentfulPageFetchFailed = (error) => ({
  type: ActionTypes.CONTENTFUL_PAGE_FETCH_FAILED,
  error,
})

export const contentfulPageGlobalsSet = (globals) => ({
  type: ActionTypes.CONTENTFUL_PAGE_GLOBALS_SET,
  globals,
})


// =======================================================================================
// Products
// =======================================================================================

export const contentfulProductFetchAsync = (products) => (
  async (dispatch) => {

    dispatch(contentfulProductFetchStarted())
    try {
      const response = await ProductListApi.getProductListFromFlatiron(products)
      const itemsDetails = response.get("itemsDetails")

      return dispatch(contentfulProductFetchSucceeded(itemsDetails))
    } catch (error) {
      return dispatch(contentfulProductFetchFailed(error))
    }
  }
)

export const contentfulProductFetchStarted = () => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_FETCH_STARTED,
})

export const contentfulProductFetchFailed = (error) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_FETCH_FAILED,
  error,
})

export const contentfulProductFetchSucceeded = (itemsDetails) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_FETCH_SUCCEEDED,
  itemsDetails,
})

export const contentfulProductVariantActivated = (slug, index) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_VARIANT_ACTIVATED,
  slug,
  index,
  location: "contentful",
})

export const contentfulProductVariantDeactivated = (slug) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_VARIANT_DEACTIVATED,
  slug,
  location: "contentful",
})

export const contentfulProductVariantSelected = (slug, index) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_VARIANT_SELECTED,
  slug,
  index,
  location: "contentful",
})

export const contentfulProductPreviewClickedAsync = (slug) => (
  async (dispatch, getState) => {
    const cmsContent = getState().getIn(["rightDrawer", "cmsContent"])
    // The right drawer contains swappable items if we have mapped in from the CMS,
    // otherwise we simply render content (not displaying the back arrow)
    const swappableContents = cmsContent ? "contentful" : null
    return dispatch(contentfulProductPreviewClicked(slug, swappableContents))
  }
)

export const contentfulProductPreviewClicked = (slug, swappableContents) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_PREVIEW_CLICKED,
  slug,
  swappableContents,
})

// =======================================================================================
// Misc
// =======================================================================================

export const contentfulComponentClicked = (contentType, target, contentId) => (
  (dispatch, getState) => {
    const location = getState().getIn(["currentPage", "path"])
    dispatch(contentfulAnalyticEvents[contentType](target, contentId, location))
  }
)

// =======================================================================================
// Carousel
// =======================================================================================

export const contentfulCarouselScrollAsync = (position, imageUrl, location) => (
  async (dispatch) => {
    if (location === "/"){
      dispatch(carouselScrolled("hero", position, imageUrl))
    }
    dispatch(contentfulCarouselScroll(position, imageUrl, location))
  }
)

export const contentfulCarouselScroll = (position, image_url, location) => ({
  type: ActionTypes.CONTENTFUL_CAROUSEL_SCROLLED,
  position,
  image_url,
  location,
})

export const contentfulCarouselClick = (index, clickObj, location) => ({
  type: ActionTypes.CONTENTFUL_CAROUSEL_CLICKED,
  position: index,
  destination: clickObj.destination,
  image_url: clickObj.image,
  location,
})

export const contentfulFlyoutOpenClicked = (content, flyoutId, location) => ({
  type: ActionTypes.CONTENTFUL_FLYOUT_OPEN_CLICKED,
  content,
  flyoutId,
  location,
})

// =======================================================================================
// Modals
// =======================================================================================

export const contentfulModalOpenClicked = (content, modalId, location) => ({
  type: ActionTypes.CONTENTFUL_MODAL_OPEN_CLICKED,
  modal: { modalId, content },
  location,
})

export const contentfulOnPageLoadModalOpened = (content, modalId, location) => ({
  type: ActionTypes.CONTENTFUL_ON_PAGE_LOAD_MODAL_OPENED,
  modal: { modalId, content, "isOnPageLoadModal": true },
  location,
})

export const contentfulOnPageLoadModalLoadedAsync = (targetPath, targetVisitCount, entryId, content, modalId) => (
  async (dispatch, getState) => {
    const path = getState().getIn(["currentPage", "path"])

    // if the page we're on matches the target page for this modal to appear on
    if (path === targetPath) {

      // check cookies to see how many times we've not shown the modal
      const Cookies = (await import("highline/utils/cookies"))
      const modalCookieId = `on_page_load_modal_${entryId}`
      const modalCookie = Cookies.get(modalCookieId) || fromJS({ visits: 0 })
      const currentVisitCount = modalCookie.get("visits")

      // keep counting if we need to have them visit the page more
      if (currentVisitCount <= targetVisitCount) {
        Cookies.set(modalCookieId, { visits: currentVisitCount+1 })
      }

      // and open if we should finally show it
      if (currentVisitCount === targetVisitCount) {
        dispatch(contentfulOnPageLoadModalOpened(content, modalId, path))
      }
    }
  }
)

export const dismissContentfulModal = () => ({
  type: ActionTypes.CONTENTFUL_MODAL_DISMISSED,
})

// =======================================================================================
// Click events
// =======================================================================================

export const contentfulHeroImageClicked = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_HERO_IMAGE_CLICKED,
  contentfulId,
  destination,
  location,
})

export const contentfulStoryPodClicked = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_STORY_POD_CLICKED,
  contentfulId,
  destination,
  location,
})

export const contentfulProductTileClicked = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_PRODUCT_TILE_CLICKED,
  contentfulId,
  destination,
  location,
})

export const contentfulTabGroupTabClicked = (tabGroupTitle, tabTitle, location) => ({
  type: ActionTypes.CONTENTFUL_TAB_GROUP_TAB_CLICKED,
  tabGroupTitle,
  tabTitle,
  location,
})

export const contentfulVideoPlayed = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_VIDEO_PLAYED,
  contentfulId,
  destination,
  location,
})

export const contentfulCtaClicked = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_CTA_CLICKED,
  contentfulId,
  destination,
  location,
})

export const contentfulChatTriggerClicked = (destination, contentfulId, location) => ({
  type: ActionTypes.CONTENTFUL_CHAT_TRIGGER_CLICKED,
  contentfulId,
  destination,
  location,
})

// =======================================================================================
// Contentful Quiz
// =======================================================================================

export const changeQuizQuestion = (index) => ({
  type: ActionTypes.CONTENTFUL_QUIZ_QUESTION_CHANGED,
  index,
})

export const loadContentfulQuiz = (quizContent) => (
  async (dispatch, getState) => {
    const mappedQuiz = toContentfulQuizFields(quizContent)
    const quizWithBranchedQuestions = mappedQuiz && mappedQuiz.setIn(["questions"], getNestedQuestions(mappedQuiz, 0, 0))
    if (getState().getIn(["contentful", "activeQuiz", "outputLoading"])){
      dispatch(contentfulQuizOutputLoading(false))
    } else {
      const quizName = mappedQuiz && mappedQuiz.get("quizName")
      const location = getState().getIn(["currentPage", "path"])
      dispatch(loadActiveQuiz(quizWithBranchedQuestions, quizName, location))
      dispatch(changeQuizQuestion(0))
    }
  }
)

export const loadActiveQuiz = (quizContent, quizName, location) => ({
  type: ActionTypes.CONTENTFUL_LOAD_QUIZ,
  quizContent,
  quizName,
  location,
})

export const quizAnswerClicked = (isSelected, questionIndex, answerIndex) => (
  (dispatch, getState) => {
    const quizName = getState().getIn(["contentful", "activeQuiz", "quizName"])
    const question = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "question"])
    const answer = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "answers", answerIndex, "answer"])
    const answerType = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "answerType"])
    const containsQuizRedirect = !!getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "answers", answerIndex, "quizRedirect"])
    if (answerType == "Select One" && isSelected) {
      const answerList = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "answers"])
      dispatch(singleAnswerSelected(getSingleSelectedAnswer(answerList, answerIndex), questionIndex, quizName, question, answer))

      if (containsQuizRedirect){
        dispatch(updateQuestionQueue(getNestedQuestions(getState().getIn(["contentful", "activeQuiz"]), questionIndex, answerIndex)))
      }

      dispatch(changeQuizQuestion(questionIndex + 1))
    } else {
      dispatch(quizAnswerSelected(isSelected, questionIndex, answerIndex, quizName, question, answer))
    }
  }
)

export const quizSkipQuestionClicked = (questionIndex, containsQuizRedirect) => (
  (dispatch, getState) => {
    const answerList = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "answers"])
    const quizName = getState().getIn(["contentful", "activeQuiz", "quizName"])
    const question = getState().getIn(["contentful", "activeQuiz", "questions", questionIndex, "question"])
    if (containsQuizRedirect){
      dispatch(updateQuestionQueue(getSkipNestedQuestion(getState().getIn(["contentful", "activeQuiz"]), questionIndex)))
    }
    dispatch(singleAnswerSelected(getSingleSelectedAnswer(answerList, "skip"), questionIndex, quizName, question, "skip"))
    dispatch(changeQuizQuestion(questionIndex + 1))
  }
)

export const updateQuestionQueue = (questionsList) => ({
  type: ActionTypes.CONTENTFUL_QUIZ_UPDATE_QUESTIONS_QUEUE,
  questionsList,
})

export const quizAnswerSelected = (isSelected, questionIndex, answerIndex, quizName, question, answer) => ({
  type: ActionTypes.CONTENTFUL_QUIZ_ANSWER_CLICKED,
  isSelected,
  questionIndex,
  answerIndex,
  quizName,
  question,
  answer,
})

export const singleAnswerSelected = (answers, questionIndex, quizName, question, answer) => ({
  type: ActionTypes.CONTENTFUL_QUIZ_SINGLE_ANSWER_CLICKED,
  answers,
  questionIndex,
  quizName,
  question,
  answer,
})

export const contentfulQuizOutput = (outputURL) => (
  (dispatch, getState) => {
    const quiz = getState().getIn(["contentful", "activeQuiz"])
    const contentfulQuizOutputIsLoading = getState().getIn(["contentful", "activeQuiz", "outputLoading"])
    if (!contentfulQuizOutputIsLoading){
      dispatch(contentfulQuizOutputLoading(true))
      dispatch(saveContentfulQuiz(quiz))
      navigateToImageLink(getClientSideLink(outputURL))
    }
  }
)

export const saveContentfulQuiz = (savedQuiz) => ({
  type: ActionTypes.CONTENTFUL_SAVE_QUIZ,
  savedQuiz,
})

const navigateToImageLink = (clientSideLink) => {
  Router.push(
    clientSideLink.get("href"),
    clientSideLink.get("as"),
  )
}

export const contentfulQuizOutputLoading = (outputLoading) => ({
  type: ActionTypes.CONTENTFUL_QUIZ_OUTPUT_LOADING,
  outputLoading,
})

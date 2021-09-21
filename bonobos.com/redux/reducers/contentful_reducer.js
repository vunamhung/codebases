import { fromJS, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  activeModal: {},
  insertedContent: {},
  isInsertedContentLoaded: false,
  isLoadingInsertedContent: false,
  isLoadingPage: false,
  isLoadingProducts: false,
  itemsDetails: {},
  activeQuiz: {
    quizName: "",
    questions: {},
    quizType: "",
    onCompletion: "",
    outputLoading: false,
    loadingTitle: "",
    loadingDescription: "",
  },
  currentQuizQuestionIndex: 0,
  savedQuizzes: [],
  globals: {},
  pages: {},
})

const contentfulReducer = (state = initialState, action)  => {
  switch (action.type) {

    case ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_FAILED:
      return state.merge({ isLoadingInsertedContent: false })

    case ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_STARTED:
      return state.merge({ isLoadingInsertedContent: true })

    case ActionTypes.CONTENTFUL_INSERTED_CONTENT_FETCH_SUCCEEDED: {
      return state.merge({
        response: action.response,
        isInsertedContentLoaded: true,
        isLoadingInsertedContent: false,
      })
    }

    case ActionTypes.CONTENTFUL_PAGE_FETCH_FAILED:
      return state.merge({ isLoadingPage: false })

    case ActionTypes.CONTENTFUL_PAGE_FETCH_STARTED:
      return state.merge({ isLoadingPage: true })

    case ActionTypes.CONTENTFUL_PAGE_FETCH_SUCCEEDED: {
      // group by page url
      const prevPages = state.get("pages")
      const firstPageData = action.pageData.isEmpty() ? Map() : action.pageData.first()
      const mergedPages = prevPages.set(action.url, firstPageData)

      return state.merge({
        pages: mergedPages,
        isLoadingPage: false,
      })
    }

    case ActionTypes.CONTENTFUL_PAGE_GLOBALS_SET: {
      return state.merge({ globals: action.globals })
    }

    case ActionTypes.CONTENTFUL_PRODUCT_FETCH_STARTED:
      return state.merge({ isLoadingProducts: true })

    case ActionTypes.CONTENTFUL_PRODUCT_FETCH_FAILED:
      return state.merge({ isLoadingProducts: false })

    case ActionTypes.CONTENTFUL_PRODUCT_FETCH_SUCCEEDED: {
      return state.merge({
        isLoadingProducts: false,
        itemsDetails: action.itemsDetails,
      })
    }

    case ActionTypes.CONTENTFUL_MODAL_OPEN_CLICKED:
    case ActionTypes.CONTENTFUL_ON_PAGE_LOAD_MODAL_OPENED: {
      return state.merge({ "activeModal": action.modal })
    }

    case ActionTypes.CONTENTFUL_MODAL_DISMISSED: {
      return state.merge({ "activeModal": {} })
    }

    case ActionTypes.CONTENTFUL_PRODUCT_VARIANT_ACTIVATED: {
      return state.setIn(["itemsDetails", action.slug, "activatedSwatchIndex"], action.index)
    }

    case ActionTypes.CONTENTFUL_PRODUCT_VARIANT_DEACTIVATED: {
      return state.setIn(["itemsDetails", action.slug, "activatedSwatchIndex"], null)
    }

    case ActionTypes.CONTENTFUL_PRODUCT_VARIANT_SELECTED: {
      return state.setIn(["itemsDetails", action.slug, "selectedSwatchIndex"], action.index)
    }

    case ActionTypes.CONTENTFUL_QUIZ_QUESTION_CHANGED:
      return state.set("currentQuizQuestionIndex", action.index)

    case ActionTypes.CONTENTFUL_LOAD_QUIZ:
      return state.merge({ "activeQuiz": action.quizContent })

    case ActionTypes.CONTENTFUL_QUIZ_ANSWER_CLICKED:
      return state.setIn(["activeQuiz", "questions", action.questionIndex, "answers", action.answerIndex, "selected"], action.isSelected)

    case ActionTypes.CONTENTFUL_QUIZ_UPDATE_QUESTIONS_QUEUE:
      return state.setIn(["activeQuiz", "questions"], action.questionsList)

    case ActionTypes.CONTENTFUL_QUIZ_OUTPUT_LOADING:
      return state.setIn(["activeQuiz", "outputLoading"], action.outputLoading)

    case ActionTypes.CLIENT_ROUTE_CHANGED:
      return state.merge({
        activeModal: {},
        activeQuiz: {},
      })

    case ActionTypes.CONTENTFUL_QUIZ_SINGLE_ANSWER_CLICKED:
      return state.setIn(["activeQuiz", "questions", action.questionIndex, "answers"], action.answers)

    case ActionTypes.CONTENTFUL_SAVE_QUIZ:
      return state.setIn(["savedQuizzes"], state.getIn(["savedQuizzes"]).push(action.savedQuiz))

    default:
      return state
  }
}

export default contentfulReducer

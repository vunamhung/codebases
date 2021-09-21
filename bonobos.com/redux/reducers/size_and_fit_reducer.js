import { fromJS, Map } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  currentOptionType: "",
  defaultOptionType: "",
  educationGroups: Map(),
  id: null,
  isOpen: false,
  name: "",
  pointOfMeasurements: Map(),
  sizeChart: Map(),
})

const fitAndSizeReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.PRODUCT_DETAIL_EDUCATION_CTA_CLICKED:
      return state.merge({
        currentOptionType: action.optionTypeName,
        isOpen: true,
      })

    case ActionTypes.SIZE_AND_FIT_CLASSIFICATION_FETCH_SUCCEEDED:
      return state.merge(action.classification)

    case ActionTypes.SIZE_AND_FIT_EDUCATION_MODAL_CLOSED:
      return state.set("isOpen", false)

    case ActionTypes.BUNDLE_DETAIL_SIZE_AND_FIT_CTA_CLICKED:
      return state.merge(action.classification, {
        currentOptionType: action.optionTypeName,
        isOpen: true,
      })

    default:
      return state
  }
}

export default fitAndSizeReducer

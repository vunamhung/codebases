import { fromJS } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  currentSlideIndex: 0,
})

const homepageReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.CAROUSEL_SCROLLED: {
      return state.set("currentSlideIndex", action.position)
    }
    default:
      return state
  }
}

export default homepageReducer

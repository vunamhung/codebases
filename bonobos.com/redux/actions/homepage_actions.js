import ActionTypes from "highline/redux/action_types"

export const homepageNavSliderItemClicked = (position, url) => ({
  type: ActionTypes.HOMEPAGE_NAV_SLIDER_ITEM_CLICKED,
  position,
  url,
})

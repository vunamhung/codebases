import ActionTypes from "highline/redux/action_types"

export const carouselClicked = (name, position, destination, imageURL) => ({
  type: ActionTypes.CAROUSEL_CLICKED,
  name,
  position,
  destination,
  imageURL,
})

export const carouselScrolled = (name, position, imageURL) => ({
  type: ActionTypes.CAROUSEL_SCROLLED,
  name,
  position,
  imageURL,
})

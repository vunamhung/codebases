import { fromJS, List } from "immutable"
import ActionTypes from "highline/redux/action_types"

const initialState = fromJS({
  countries: List(),
  isLoaded: false,
  regions: List(),
})

const locationReducer = (state = initialState, action)  => {
  switch (action.type) {
    case ActionTypes.COUNTRIES_FETCH_SUCCEEDED: {
      // Default to US country and regions
      const regions = action.countries.find((country) => country.get("code") === "US",
        null,
        fromJS({}),
      ).get("regions")


      return state.merge({
        countries: formatList(action.countries),
        isLoaded: true,
        regions: formatList(regions),
      })
    }

    case ActionTypes.REGIONS_UPDATED:
      return state.set("regions", formatList(action.regions))

    default:
      return state
  }
}

function formatList(list) {
  return fromJS(list)
    .map((country) => country.mapKeys((key) => {
      return (key === "code" ?  "value" : key === "name" ? "label" : key)
    }))
}

export default locationReducer

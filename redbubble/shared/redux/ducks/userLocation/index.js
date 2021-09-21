export const SET_USER_LOCATION = 'SET_USER_LOCATION';

const defaultState = {};

export const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_USER_LOCATION: {
      return action.payload;
    }
    default:
      return state;
  }
};

export const setUserLocation = userLocation => ({
  type: SET_USER_LOCATION,
  payload: userLocation,
});

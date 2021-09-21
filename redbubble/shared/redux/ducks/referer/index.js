export const SET_REFERER = 'SET_REFERER';

const initialState = {
  referer: null,
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_REFERER:
      return {
        ...state,
        referer: action.referer,
      };
    default:
      return state;
  }
};

export const setReferer = referer => ({
  type: SET_REFERER,
  referer,
});

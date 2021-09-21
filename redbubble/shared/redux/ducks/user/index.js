import get from 'lodash/get';

export const SET_USER = 'SET_USER';

const defaultState = {
  isNewVisitor: true,
};

export const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_USER: {
      const payload = get(action, 'payload');

      return { ...payload };
    }
    default:
      return state;
  }
};

export const setUser = user => ({
  type: SET_USER,
  payload: { ...user },
});

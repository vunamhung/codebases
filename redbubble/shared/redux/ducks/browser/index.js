import get from 'lodash/get';
import deviceInfo from '../../../lib/deviceInfo';

export const SET_DEVICE_TYPE = 'SET_DEVICE_TYPE';

const defaultState = {
  is: {
    small: false,
    medium: false,
    large: true,
  },
};

export const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_DEVICE_TYPE: {
      const device = get(action, 'payload.device');
      return deviceInfo(device);
    }
    default:
      return state;
  }
};

export const setDeviceType = device => ({
  type: SET_DEVICE_TYPE,
  payload: { device },
});

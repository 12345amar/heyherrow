import {
  FETCH_ALL_NOTIFICATIONS,
  START_FETCH_ALL_NOTIFICATIONS,
} from '../types';

import { notificationInitialState } from '../initial-states';

export default ((state = notificationInitialState, { type, payload }) => {
  switch (type) {
  case FETCH_ALL_NOTIFICATIONS:
    return {
      ...state,
      loading: false,
      data: payload
    };
  case START_FETCH_ALL_NOTIFICATIONS:
    return {
      ...state,
      loading: true,
    };
  default:
    return state;
  }
});

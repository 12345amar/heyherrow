import {
  FETCH_ALL_NOTIFICATIONS,
  START_FETCH_ALL_NOTIFICATIONS,
} from '../types/notification';

export const fetchingNotification = () => ({
  type: START_FETCH_ALL_NOTIFICATIONS
});

export const setAllNotification = (data) => ({
  type: FETCH_ALL_NOTIFICATIONS,
  payload: data,
});

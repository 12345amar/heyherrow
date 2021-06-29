import MakeTheApiCall, { generateOptions } from './apiCalls';
import { setAllNotification, fetchingNotification } from '../redux/actions/notification';

export const fetchAllNotifications = (limit = 10, page = 1) => {
  const options = generateOptions(`notifications?limit=${limit}&page=${page}`);
  return (dispatch) => {
    dispatch(fetchingNotification());
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(setAllNotification(response.data));
        return response.data;
      })
      .catch(() => {
        dispatch(setAllNotification([]));
      });
  };
};

export default fetchAllNotifications;

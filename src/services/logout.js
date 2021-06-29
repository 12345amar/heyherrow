import { logout } from '../redux/actions';

export default () => (dispatch) => {
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  dispatch(logout());
};

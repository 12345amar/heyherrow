const userData = localStorage.getItem('userData');
const client = userData ? JSON.parse(userData).client : {};

const clientDetailInitialState = {
  loading: false,
  ...client
};

export default clientDetailInitialState;

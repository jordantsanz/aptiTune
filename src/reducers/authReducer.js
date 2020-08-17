import { ActionTypes } from '../actions';

const initialState = {
  authenticated: false,
  username: '',
};
const authReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case ActionTypes.AUTH_USER:
      return { authenticated: true, username: action.payload };
    case ActionTypes.DEAUTH_USER:
      return { authenticated: false, username: '' };
    default:
      return { authenticated: state.authenticated, username: '' };
  }
};

export default authReducer;

import { ActionTypes } from '../actions';

const initialState = {
  authenticated: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUHT_USER:
      return { authenticated: true };
    case ActionTypes.DEAUTH_USER:
      return { authenticated: false };
    default:
      return { authenticated: state.authenticated };
  }
};

export default authReducer;

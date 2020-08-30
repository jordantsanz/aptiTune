import { ActionTypes } from '../actions';

const initialState = {
  error: null,
  message: null,
  open: false,
};

const errorReducer = (state = initialState, action) => {
  console.log('action', action);
  switch (action.type) {
    case (ActionTypes.ERROR_HIDE):
      console.log('hiding error in the action case.');
      return {
        message: null,
        open: false,
      };
    case (ActionTypes.ERROR_SET):
      console.log('action error set', action.error);
      switch (action.error) {
        case 401:
          console.log('log in error.');
          return {
            message: 'Username or Password Invalid',
            open: true,
          };
        case 429:
          console.log('sign up error.');
          return {
            message: 'Email already in use',
            open: true,
          };
        case 500:
          console.log('Network Disconnected.');
          return {
            message: 'disconnected from host.',
            open: true,
          };
        default:
          return {
            message: 'There was an unidentified error.',
            open: true,
          };
      }
    default:
      return {
        error: null,
        message: null,
        open: false,
      };
  }
};

export default errorReducer;

import { ActionTypes } from '../actions';

const initialState = {
  messages: [],
  open: false,
};

const errorReducer = (state = initialState, action) => {
  console.log('action', action);
  switch (action.type) {
    case (ActionTypes.ERROR_HIDE):
      console.log('hiding error in the action case.');
      return {
        messages: [],
        open: false,
      };
    case (ActionTypes.ERROR_SET):
      console.log('action error set', action.error);
      switch (action.error) {
        case 401:
          console.log('log in error.');
          return {
            ...state,
            messages: [...state.messages, 'Username or Password Invalid'],
            open: true,
          };
        case 429:
          console.log('sign up error.');
          return {
            ...state,
            messages: [...state.messages, 'Email already in use'],
            open: true,
          };
        case 455:
          return {
            ...state,
            messages: [...state.messages, 'Username Taken'],
            open: true,
          };
        case 500:
          console.log('Network Disconnected.');
          return {
            ...state,
            messages: [...state.messages, 'disconnected from host.'],
            open: true,
          };
        case 1000:
          return {
            ...state,
            messages: [...state.messages, 'Username Input must be Less Than 10 Characters.'],
            open: true,
          };
        case 1001:
          return {
            ...state,
            messages: [...state.messages, 'Username Input must be Greater Than 4 Characters.'],
            open: true,
          };
        case 1002:
          return {
            ...state,
            messages: [...state.messages, 'Must have input for Username.'],
            open: true,
          };
        case 1003:
          return {
            ...state,
            messages: [...state.messages, 'Valid email must contain @ symbol.'],
            open: true,
          };
        case 1004:
          return {
            ...state,
            messages: [...state.messages, 'Email must include {.com, .org, .gov, or .edu} ending'],
            open: true,
          };
        case 1005:
          return {
            ...state,
            messages: [...state.messages, 'Password must be 7 characters or more.'],
            open: true,
          };
        case 1006:
          return {
            ...state,
            messages: [...state.messages, 'Password must contain at least 1 symbol { ?, !, #, $, &, % }'],
            open: true,
          };
        case 1007:
          return {
            ...state,
            messages: [...state.messages, 'Must have input for Email.'],
            open: true,
          };
        case 1008:
          return {
            ...state,
            messages: [...state.messages, 'Must have input for Password.'],
            open: true,
          };
        default:
          return {
            ...state,
            messages: [...state.messages, 'There was an unidentified error.'],
            open: true,
          };
      }
    default:
      return {
        messages: [],
        open: false,
      };
  }
};

export default errorReducer;

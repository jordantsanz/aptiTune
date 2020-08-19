import { ActionTypes } from '../actions/index';

const initialState = {
  username: '',
  badges: [],
  completed: [],
};

const userReducer = (state = initialState, action) => {
  console.log('USER PAYLOAD: ', action.payload);
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      return {
        username: action.payload.username, badges: action.payload.badges, completed: action.payload.completedLessons,
      };
    default:
      return {
        state,
      };
  }
};

export default userReducer;

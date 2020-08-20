import { ActionTypes } from '../actions/index';

const initialState = {
  username: localStorage.getItem('user'),
  badges: [],
  completed: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      return {
        username: state.username, badges: action.payload.badges, completed: action.payload.completedLessons,
      };
    default:
      return {
        username: localStorage.getItem('user'), badges: state.badges, completed: state.badges,
      };
  }
};

export default userReducer;

import { ActionTypes } from '../actions/index';

const initialState = {
  username: localStorage.getItem('user'),
  badges: [],
  completed: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      console.log('get_user_info in userReducer called with payload: ', action.payload);
      return {
        username: action.payload.username, badges: action.payload.badges, completed: action.payload.completedLessons,
      };
    default:
      return {
        username: state.username, badges: state.badges, completed: state.completed,
      };
  }
};

export default userReducer;

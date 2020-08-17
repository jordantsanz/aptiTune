import { ActionTypes } from '../actions/index';

const initialState = {
  username: '',
  badges: [],
  toDo: [],
  completed: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      return {
        username: action.payload.username, badges: action.payload.badges, toDo: action.payload.toDoLessons, completed: action.payload.completedLessons,
      };
    default:
      return {
        username: '', badges: '', toDo: '', completed: '',
      };
  }
};

export default userReducer;

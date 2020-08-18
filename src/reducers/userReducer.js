import { ActionTypes } from '../actions/index';

const initialState = {
  username: '',
  badges: [],
  toDo: [],
  completed: [],
};

const userReducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      return {
        username: action.payload.username, badges: action.payload.badges, toDo: action.payload.toDoLessons, completed: action.payload.completedLessons,
      };
    default:
      return {
        username: state.username, badges: state.badges, toDo: state.toDo, completed: state.completed,
      };
  }
};

export default userReducer;

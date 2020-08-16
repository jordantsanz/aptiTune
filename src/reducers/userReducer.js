import { ActionTypes } from '../actions/index';

const initialState = {
  username: '',
  badges: [],
  lessons: {
    completed: [],
    toDo: [],
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      return {
        username: action.payload.username,
        badges: action.payload.badges,
        lessons: action.payload.lessons,
      };
    default:
      return { username: '', badges: [], lessons: [] };
  }
};

export default userReducer;

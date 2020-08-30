/* eslint-disable max-len */
import { ActionTypes } from '../actions/index';

const initialState = {
  username: localStorage.getItem('user'),
  badges: [],
  completed: [],
  icon: 0,
  questionsCorrect: [],
  questionsIncorrect: [],
};

const userReducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case ActionTypes.GET_USER_INFO:
      console.log('get_user_info in userReducer called with payload: ', action.payload);
      return {
        username: action.payload.username, badges: action.payload.badges, completed: action.payload.completedLessons, icon: action.payload.icon, questionsCorrect: action.payload.questionsCorrect, questionsIncorrect: action.payload.questionsIncorrect,
      };
    default:
      return {
        username: state.username, badges: state.badges, completed: state.completed, icon: state.icon, questionsCorrect: state.questionsCorrect, questionsIncorrect: state.questionsIncorrect,
      };
  }
};

export default userReducer;

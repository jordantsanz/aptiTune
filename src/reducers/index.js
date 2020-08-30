// the starting point for your redux store
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';
import pageReducer from './pageReducer';
import lessonReducer from './lessonReducer';
import errorReducer from './errorReducer';

const rootReducer = combineReducers({
  user: userReducer, // user information like badges
  auth: authReducer, // authentication purposes
  page: pageReducer,
  lesson: lessonReducer,
  error: errorReducer,
});

export default rootReducer;

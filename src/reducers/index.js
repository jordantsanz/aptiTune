// the starting point for your redux store
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';
import pageReducer from './pageReducer';

const rootReducer = combineReducers({
  user: userReducer, // user information like badges
  auth: authReducer, // authentication purposes
  page: pageReducer,
});

export default rootReducer;

// the starting point for your redux store
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  user: userReducer, // user information like badges
  auth: authReducer, // authentication purposes
});

export default rootReducer;

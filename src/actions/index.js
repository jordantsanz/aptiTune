/* eslint-disable eqeqeq */
import axios from 'axios';

// root url for local: change to #####-heroku.com/api
// const ROOT_URL = 'https://aptitune-api.herokuapp.com/api';
const ROOT_URL = 'http://localhost:9090/api';

// action types
export const ActionTypes = {
  GET_LESSON: 'GET_LESSON',
  GET_LESSONS: 'GET_LESSONS',
  GET_USER_INFO: 'GET_USER_INFO',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
  HELLO_WORLD: 'HELLO_WORLD',
  ERROR_SET: 'ERROR_SET',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  LOAD_PAGE: 'LOAD_PAGE',
};

// gets a lesson given that lesson id and the current user
export function getLesson(id, history) {
  console.log('Calling getLesson in client with id', id);
  return (dispatch) => {
    axios.get(`${ROOT_URL}/lessons/${id}`)
      .then((response) => {
        console.log('getLesson responded with response', response.data);
        dispatch({ type: ActionTypes.GET_LESSON, payload: response.data });
        history.push(`/lessons/${id}`);
      })
      .catch((error) => {
        console.log('error in getLesson client:', error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
      });
  };
}

export function getLessons() {
  console.log('Calling getLessons in client');
  return (dispatch) => {
    axios.get(`${ROOT_URL}/lessons`)
      .then((response) => {
        dispatch({ type: ActionTypes.GET_LESSONS, payload: response.data });
      })
      .catch((error) => {
        console.log('server responded with error:', error);
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
      });
  };
}

export function loadPage(username, lessonid, lessonTitle, pageNumber) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/${username}/${lessonid}/${pageNumber}`, lessonTitle, pageNumber)
      .then((response) => {
        dispatch({ type: ActionTypes.LOAD_PAGE, payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
      });
  };
}

// gets user info given username
export function getUserInfo() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/home`).then((response) => {
      console.log('Front end getUserInfo response:', response.data);
      dispatch({ type: ActionTypes.GET_USER_INFO, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.ERROR_SET, payload: error });
    });
  };
}

export function updateUserInfo(username, fields) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/${username}`, username, fields).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_USER_INFO, payload: response.data });
    })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, payload: error });
      });
  };
}

export function signOutUser(history) {
  return (dispatch) => {
    // Also remove user
    console.log('Signing out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

export function signInUser(user, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signin`, user).then((response) => {
      console.log('sign in user response.data.username: ', response.data.username);
      dispatch({ type: ActionTypes.AUTH_USER, payload: response.data.username });
      if (response.data.username != null) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.username);
        console.log('local storage user: ', localStorage.getItem('user'));
        history.push('/home');
      }
    })
      .catch((error) => {
        dispatch(authError(`Sign In Failed: ${error.response.data}`));
      });
  };
}
export function signupUser(user, history) {
  console.log('User in signupuser: ', user);
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, user, history).then((response) => {
      dispatch({ type: ActionTypes.AUTH_USER, payload: response.data.username });
      console.log('response in signupuser', response);
      if (response.status == 200) {
        localStorage.setItem('token', response.data.token);
        history.push('/home');
      }
    })
      .catch((error) => {
        console.log(error);
        dispatch(authError(error));
      });
  };
}
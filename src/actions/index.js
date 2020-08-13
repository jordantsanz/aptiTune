import axios from 'axios';

// root url for local: change to #####-heroku.com/api
const ROOT_URL = 'http://localhost:9090/api';


/// action types
export const ActionTypes = {
    GET_LESSON: 'GET_LESSON',
    GET_USER_INFO: 'GET_USER_INFO',

    ERROR_SET: 'ERROR_SET',
}

// gets a lesson given that lesson id and the current user
export function getLesson(lessonid, username) {
    return(dispatch) => {
        axios.get(`${ROOT_URL}/${username}/${lessonid}`)
        .then((response) => {
            dispatch({ type: ActionTypes.GET_LESSON, payload: response.data });
        })
        .catch((error) =>{
            dispatch({ type: ActionTypes.ERROR_SET, payload: error });
        });
    };
}


// gets user info given username
export function getUserInfo(username) {
    return(dispatch) => {
        axios.get(`${ROOT_URL}/${username}`).then((response) => {
            dispatch({ type: ActionTypes.GET_USER_INFO, payload: response.data });
        }).catch((error) => {
            dispatch({ type: ActionTypes.ERROR_SET, payload: error });
        });
    }
}
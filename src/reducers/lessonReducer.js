import { ActionTypes } from '../actions/index';

const initialState = {
  lessons: [],
  lessonid: '',
  title: '',
  description: '',
  pages: [],
};

const lessonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_LESSON:
      // console.log('lesson reducer-get-lesson: i hate it-->', action.payload);
      return {
        lessons: state.lessons, lessonid: action.payload.lessonid, title: action.payload.title, description: action.payload.description, pages: action.payload.pages,
      };
    case ActionTypes.GET_LESSONS:
      // console.log('lesson reducer-get-lessons: i hate it-->', action.payload);
      return {
        lessons: action.payload,
      };
    default:
      return state;
  }
};

export default lessonReducer;

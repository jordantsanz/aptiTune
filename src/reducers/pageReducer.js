import { ActionTypes } from '../actions/index';

const initialState = {
  pageNumber: '',
  title: '',
  description: '',
  content: '',
  exercise: '',
  activity: '',
  nextPage: '',

};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_PAGE:
      return {
        pageNumber: action.payload.PageNumber,
        title: action.payload.title,
        description: action.payload.description,
        content: action.payload.content,
        exercise: action.payload.exercise,
        activity: action.payload.activity,
        nextPage: action.payload.nextPage,
      };
    default:
      return {
        pageNumber: state.pageNumber,
        title: state.title,
        description: state.description,
        content: state.content,
        exercise: state.exercise,
        activity: state.activity,
        nextPage: state.nextPage,
      };
  }
};

export default pageReducer;

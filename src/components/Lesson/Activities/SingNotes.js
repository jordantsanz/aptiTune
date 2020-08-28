/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable new-cap */

// take in array of notes, then create staff and display the notes on it

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson } from '../../../actions/index';
import drawStaff from '../../DrawStaff';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class SingNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      correctClicked: false,
      complete: false,
      message: '',
    };
  }

  componentDidMount = () => {
    const id = localStorage.getItem('lesson');
    const pageNum = localStorage.getItem('next');
    this.setState({ pageNumber: pageNum });
    const { history } = this.props;
    this.props.getLesson(id, history, pageNum + 1);
    console.log('Component mounted in Listening');
  }

  goToNext = () => {
    this.props.onSubmit();
  }

  render() {
    const { pages } = this.props;
    const page = pages[this.state.pageNumber];
    console.log('page in sing notes', page);
    console.log('correct answer:', page.activity.correct_answers);
    if (page === null || page === undefined) {
      return (
        <div>
          Loading...
        </div>
      );
    } else if (this.state.complete) {
      return (
        <div>
          You got it! Click the button to go to the next lesson!
          <button type="button" className="button" id="nextButton" onClick={this.goToNext}>
            Next
          </button>
        </div>
      );
    } else if (page.activity_type === 'SingNotes') {
      return (
        <div>
          <div className="activityInstructions">{page.activity.instructions}</div>
          {/* <div className="activityInstructions">{answer}</div> */}
          <div>
            {drawStaff(page.activity.correct_answers, 'sheetmusic')}
          </div>
        </div>
      );
    } else {
      return (
        <div>in the else statement</div>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps, { getLesson })(SingNotes));

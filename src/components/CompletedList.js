/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getLessons, getLesson, getUserInfo } from '../actions';

function mapStateToProps(reduxState) {
  return {
    lesson: reduxState.lesson,
    currentUser: reduxState.user,
  };
}

class CompletedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.props.getLessons();
    this.props.getUserInfo();
  }

  render() {
    console.log('lessons in lessonlist', this.props.lesson.lessons);
    if (this.props.lesson.lessons === null || this.props.lesson.lessons === undefined || this.props.currentUser === null || this.props.currentUser === undefined) {
      return (
        <div>Loading...</div>
      );
    }

    // split up lessons into completed and incomplete
    const completed = this.props.lesson.lessons.filter((lesson) => this.props.currentUser.completed.includes(lesson._id));
    if (completed === null || completed === undefined || completed.length === 0) {
      return (
        <div className="no-lessons-completed">No lessons completed. </div>
      );
    } else {
      return (
        <div className="lessons">{completed.map((l) => {
          return (
            <div key={l._id} className="lesson-icon">
              <div className="lesson-icon-top">
                <div className="lesson-icon-title">{l.title}</div>
                <div className="lesson-icon-time-div">
                  <FontAwesomeIcon icon={faClock} className="icon" id="clock" />
                  <div className="lesson-icon-time">10min</div>
                </div>
              </div>
              <div className="lesson-icon-bottom">
                <div className="lesson-icon-description">{l.description}</div>
                <div className="button-holder" id="lesson-icon-button-holder">
                  <button type="button"
                    className="button"
                    id="lesson-icon-button"
                    onClick={() => {
                    // go to lesson
                      console.log('button clicked');
                      const { history } = this.props;
                      console.log('props: ', this.props);
                      console.log('id', l._id);
                      console.log('goToLesson called with id', l._id);
                      localStorage.setItem('lesson', l._id);
                      localStorage.setItem('next', 0);
                      this.props.getLesson(l._id, history);
                    }}
                  >Learn now!
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        </div>
      );
    }
  }
}
// export default connect(mapStateToProps, null)(LessonList);
export default withRouter(connect(mapStateToProps, { getLessons, getLesson, getUserInfo })(CompletedList));

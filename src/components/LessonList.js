/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getLessons, getLesson } from '../actions';

// NEED TO STILL MAKE THE BUTTONS ON THE LESSONS GO SOMEWHERE! MODALS ON CLICK?
class LessonList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount = () => {
    this.props.getLessons();
  }

  // ROUTE THIS TO LESSON PAGES
  goToLesson = (l) => {
    const { history } = this.props;
    console.log('props: ', this.props);
    console.log('id', l._id);
    console.log('goToLesson called with idd', l._id);
    // this.props.getLesson(l._id, history);
  }

  render() {
    console.log('lessons in lessonlist', this.props.lesson.lessons);
    if (this.props.lesson.lessons === null || this.props.lesson.lessons === undefined) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="lessons">{this.props.lesson.lessons.map((l) => {
        return (
          <div key={l.id} className="lesson-icon">
            <div className="lesson-icon-top">
              <div className="lesson-icon-title">{l.lessonid}</div>
              <div className="lesson-icon-time-div">
                <FontAwesomeIcon icon={faClock} className="icon" id="clock" />
                <div className="lesson-icon-time">10min</div>
              </div>
            </div>
            <div className="lesson-icon-bottom">
              <div className="lesson-icon-description">{l.description}</div>
              <div className="button-holder" id="lesson-icon-button-holder">
                <button type="button" className="button" id="lesson-icon-button" onClick={this.goToLesson(l)}>Learn now!</button>
              </div>
            </div>

          </div>
        );
      })}
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    lesson: reduxState.lesson,
  };
}
// export default connect(mapStateToProps, null)(LessonList);
export default withRouter(connect(mapStateToProps, { getLessons, getLesson })(LessonList));

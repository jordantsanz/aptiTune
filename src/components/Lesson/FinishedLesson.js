/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLesson, getUserInfo } from '../../actions/index';
import NavBar from '../NavBar';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    lesson: reduxState.lesson,
    pages: reduxState.lesson.pages,
  };
}

class FinishedLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flatCount: 0,
      singCount: 0,
      listeningCount: 0,
      rhythmCount: 0,
      flatErrors: 0,
      listeningErrors: 0,
      rhythmErrors: 0,
      singErrors: 0,
      finishedQuiz: false,
      processed: false,
    };
  }

  componentDidMount = () => {
    // get userinfo
    this.props.getUserInfo();

    // get lesson info
    const id = localStorage.getItem('lesson');
    localStorage.setItem('next', 0);
    const { history } = this.props;
    this.props.getLesson(id, history, false);
    this.processResults();
  }

  playAgain = () => {
    const id = localStorage.getItem('lesson');
    const { history } = this.props;
    this.props.getLesson(id, history, true); // i don't know how to push to start of lesson!!!
  }

  processResults = () => {
    if (!this.state.processed) {
      const finished = localStorage.getItem('finished');
      if (finished === 'true') {
        this.getActivityCounts(this.props.lesson.pages.length);
        this.calculateResultsOnComplete();
        // if they completed the quiz
        // check errorCount
        const errCount = parseInt(localStorage.getItem('errCount'), 10);
        if (errCount === 0) {
          // calculate err/success rates
        } else if (errCount === 1) {
          const firstErr = parseInt(localStorage.getItem('err1'), 10);
          // calculate error/success rates
        } else if (errCount === 2) {
          const secondErr = parseInt(localStorage.getItem('err2'), 10);
          // calculate error/succes rates
        }
      } else if (finished === 'false') {
        // if they failed to finish the quiz
        const firstErr = parseInt(localStorage.getItem('err1'), 10);
        const secondErr = parseInt(localStorage.getItem('err2'), 10);
        const thirdErr = parseInt(localStorage.getItem('err3'), 10);
        // calculate activity counts
        this.getActivityCounts(thirdErr + 1);
        this.calculateResultsOnIncomplete(thirdErr);
      }
    }
  }

  getActivityCounts = (lastQ) => {
    // loop through lesson, counting number of each activity
    const { pages } = this.props;
    let flatCount = 0;
    let listeningCount = 0;
    let rhythmCount = 0;
    let singCount = 0;
    let index = 0;
    while (index < lastQ) {
      const page = this.props.pages[index];
      if (page.activity_type === 'FlatView') {
        flatCount += 1;
      } else if (page.activity_type === 'Listening') {
        listeningCount += 1;
      } else if (page.activity_type === 'RhythmSensor') {
        rhythmCount += 1;
      } else if (page.activity_type === 'SingNotes') {
        singCount += 1;
      }
      index += 1;
    }
    // add final counts to state
    console.log('FlatCount: ', flatCount);
    console.log('rhythmCount: ', rhythmCount);
    console.log('listeningCount: ', listeningCount);
    console.log('singCount', singCount);
    this.setState({
      flatCount, rhythmCount, listeningCount, singCount,
    });
  }

  calculateResultsOnIncomplete = (err1, err2, err3) => {
    // calculate how much of the quiz was completed
    const percentComplete = parseFloat(this.props.lesson.pages.length / (err3 + 1));
    console.log('percent complete: ', percentComplete);
    // for each error, check and see what kind of questions they got wrong
    this.checkError(err1);
    this.checkError(err2);
    this.checkError(err3);
    // calculate their yield for each q kind as a percent
  }

  checkError = (err) => {
    const { pages } = this.props;
    const page = pages[err];
    let flatErrors = 0;
    let listeningErrors = 0;
    let rhythmErrors = 0;
    let singErrors = 0;
    if (page.activity_type === 'FlatView') {
      flatErrors += 1;
    } else if (page.activity_type === 'Listening') {
      listeningErrors += 1;
    } else if (page.activity_type === 'RhythmSensor') {
      rhythmErrors += 1;
    } else if (page.activity_type === 'SingNotes') {
      singErrors += 1;
    }
    this.setState({
      flatErrors, listeningErrors, rhythmErrors, singErrors,
    });
  }

  calculateResultsOnComplete = () => {

  }

  getRhythmStats = (err1, err2, err3) => {

  }

  getPitchStats = (err1, err2, err3) => {

  }

  getListeningStats = (err1, err2, err3) => {

  }

  render() {
    if (this.props.lesson === null || this.props.lesson === undefined) {
      return (
        <div className="finished-lesson-main">
          Loading...
        </div>
      );
    }

    if (this.props.lesson.lesson_type === 'quiz') {
      return (
        <div className="finished-lesson-main">
          <NavBar />
          <div className="finished-lesson-content">
            <div className="finished-lesson-top-page">
              <div className="finished-lesson-top-page-content">
                <div className="finished-lesson-completed">Completed: {this.props.lesson.title} </div>
                <div className="finished-lesson-badge">
                  <div className="finished-lesson-badge-earned">Badge earned: {this.props.lesson.badge.name} </div>
                  <img className="badge-image" alt="badge" src={this.props.lesson.badge.iconUrl} />
                </div>
                <div className="finished-lesson-percent"> You got PH %! </div>
                <div className="finished-lesson-description"> Nice job, {this.props.user}! </div>
              </div>
            </div>
            <div className="finished-lesson-bottom-page">
              <div className="finished-lesson-bottom-page-content">
                <div className="finished-lesson-stats">
                  <div className="finished-lesson-questions-answered">
                    Questions answered correctly: PH
                  </div>
                </div>
                <div className="finished-lesson-buttons">
                  <NavLink to="/home"><button className="button" id="take-me-home" type="button"> Take me home </button></NavLink>
                  <button className="button" id="play-again" type="button" onClick={this.playAgain}> Play again </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="finished-lesson-main">
          <NavBar />
          <div className="finished-lesson-content">
            <div className="finished-lesson-top-page">
              <div className="finished-lesson-top-page-content">
                <div className="finished-lesson-completed">Completed: {this.props.lesson.title} </div>
                <div className="finished-lesson-badge">
                  <div className="finished-lesson-badge-earned">Badge earned: </div>
                  <div className="finished-lesson-badge-earned">{this.props.lesson.badge.name}</div>
                  <img className="badge-image" alt="badge" src={this.props.lesson.badge.iconUrl} />
                </div>
                <div className="finished-lesson-percent"> You got PH %! </div>
                <div className="finished-lesson-description"> Nice job, {this.props.user}! </div>
              </div>
            </div>
            <div className="finished-lesson-bottom-page">
              <div className="finished-lesson-bottom-page-content">
                <div className="finished-lesson-stats">
                  <div className="finished-lesson-questions-answered">
                    Questions answered correctly: PH
                  </div>
                </div>
                <div className="finished-lesson-buttons">
                  <NavLink to="/home"><button className="button" id="take-me-home" type="button"> Take me home </button></NavLink>
                  <button className="button" id="play-again" type="button" onClick={this.playAgain}> Play again </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default withRouter(connect(mapStateToProps, { getLesson, getUserInfo })(FinishedLesson));

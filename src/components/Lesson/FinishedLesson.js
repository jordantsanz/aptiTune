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
  }

  componentDidMount = () => {
    // get userinfo
    this.props.getUserInfo();

    // get lesson info
    const id = localStorage.getItem('lesson');
    localStorage.setItem('next', 0);
    const { history } = this.props;
    this.props.getLesson(id, history, false);
  }

  playAgain = () => {
    const id = localStorage.getItem('lesson');
    const { history } = this.props;
    this.props.getLesson(id, history, true); // i don't know how to push to start of lesson!!!
  }

  render() {
    return (
      <div className="finished-lesson-main">
        <NavBar />
        <div className="finished-lesson-content">
          <div className="finished-lesson-top-page">
            <div className="finished-lesson-top-page-content">
              <div className="finished-lesson-completed">Completed: {this.props.lesson.title} </div>
              <div className="finished-lesson-badge">
                <img className="badge-image" alt="badge" />
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
                <div className="finished-lesson-badge-earned">Badge earned: PH </div>
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

export default withRouter(connect(mapStateToProps, { getLesson, getUserInfo })(FinishedLesson));

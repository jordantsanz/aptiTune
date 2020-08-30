/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLesson, getUserInfo, updateUserInfo } from '../../actions/index';
import NavBar from '../NavBar';

let earnedBadge = false;
let theBadge = null;

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
    // get userinfo
    this.props.getUserInfo();
    const id = localStorage.getItem('lesson');
    localStorage.setItem('next', 0);
    const { history } = this.props;
    this.props.getLesson(id, history, false);
    this.giveBadge();
    this.props.getUserInfo();
  }

  giveBadge = () => {
    console.log('give badge func');
    // get lesson info
    let { badges } = this.props.currentUser.badges;
    if (this.props.lesson.badge !== undefined) {
      if (this.props.currentUser.badges === []) {
        badges = [this.props.lesson.badge];
      } else {
        let isUnique = true;
        this.props.currentUser.badges.forEach((badge) => {
          if (badge.iconUrl === this.props.lesson.badge.iconUrl) {
            isUnique = false;
          }
        });
        if (isUnique) {
          badges = this.props.currentUser.badges.concat(this.props.lesson.badge);
          this.props.updateUserInfo({
            badges,
          });
          earnedBadge = true;
          theBadge = this.props.lesson.badge.name;
          console.log('updated badges');
        }
      }
    }
  }

  componentDidMount = () => {

  }

  playAgain = () => {
    const id = localStorage.getItem('lesson');
    const { history } = this.props;
    this.props.getLesson(id, history, true); // i don't know how to push to start of lesson!!!
  }

  wonBadge = () => {
    if (earnedBadge) {
      return (
        <div className="badge-earned">Badge earned: <span className="badge-earned-words">{theBadge} </span> </div>
      );
    } else {
      return (
        <div className="badge-earned">No badge this time!</div>
      );
    }
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
                <img alt="badge-icon" className="badge-icon" src={this.props.lesson.badge.iconUrl} /> {/* Need to put badge image in here that is associated with badges */}
              </div>
              <div className="finished-lesson-percent"> You did it! </div>
              <div className="finished-lesson-description"> Nice job, {this.props.currentUser.username}! </div>
            </div>
          </div>
          <div className="finished-lesson-bottom-page">
            <div className="finished-lesson-bottom-page-content">
              <div className="finished-lesson-stats">
                <div className="finished-lesson-questions-answered">
                  Questions answered correctly: PH
                </div>
                <div className="finished-lesson-badge-earned"> {this.wonBadge()} </div>
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

export default withRouter(connect(mapStateToProps, { getLesson, getUserInfo, updateUserInfo })(FinishedLesson));

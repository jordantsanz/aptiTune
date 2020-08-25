/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable import/named */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from '../actions';
import LessonList from './LessonList';
import CompletedList from './CompletedList';
import NavBar from './NavBar';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    auth: reduxState.auth,
  };
}

class HomePageWithUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: false,
    };
    this.props.getUserInfo();
  }

  badgeRender = () => {
    if (this.props.currentUser.badges.length == 0) {
      return (
        <div className="badge-div">
          <div className="badge-title">none yet!</div>
        </div>
      );
    } else {
      this.props.currentUser.badges.map((badge) => {
        return (
          <div className="badge-div">
            <img className="badge-image" src={badge.icon} alt="badge-icon" />
            <div className="badge-title">{badge.name} </div>
          </div>
        );
      });
    }
  }

  showAll = () => {
    this.setState({ completed: false });
  }

  showCompleted = () => {
    this.setState({ completed: true });
  }

  // render for homepage layout
  render() {
    console.log('this.props.currentUser: ', this.props.currentUser);
    if (this.props.currentUser === null || this.props.currentUser == undefined) {
      return (
        <div>
          Loading
        </div>
      );
    } else if (this.state.completed) {
      return (
        <div className="homepage-with-user">
          <div className="homepage-with-user-mainflex">
            <NavBar className="nav" />
            <div className="homepage-with-user-content">
              <div className="homepage-with-user-toprow">
                <div className="user-container">
                  <img className="user-image" alt="user" />
                  <div className="user-container-text">
                    <h1 className="user-hello">Hello {this.props.currentUser.username}! </h1>
                    <h3 className="subtitle" id="lets-learn">Let&apos;s learn music!</h3>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="badges-progress">
                    <div className="number" id="badges-number"> {this.props.currentUser.badges.length} </div>
                    <div className="subtitle">badges <br /> achieved </div>
                  </div>
                  <div className="line" />
                  <div className="lessons-progress">
                    <div className="number" id="lessons-number"> {this.props.currentUser.completed.length} </div>
                    <div className="subtitle">lessons <br /> completed </div>
                  </div>
                </div>
              </div>
              <div className="homepage-with-user-bottomrow">
                <div className="lessons-flex">
                  <h2 className="title" id="lessons-title">Lessons</h2>
                  <div className="lessons-subtitles">
                    <h3 className="subtitle" id="lessons-all" onClick={this.showAll}>All</h3>
                    <h3 className="subtitle" id="lessons-completed" style={{ color: '#E46161' }}>Completed</h3>
                  </div>
                  <CompletedList className="lessons" />
                </div>
                <div className="badges-flex">
                  <h2 className="title" id="badges-title">Your Badges</h2>
                  <div className="badge-container">{this.badgeRender()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="homepage-with-user">
          <div className="homepage-with-user-mainflex">
            <NavBar className="nav" />
            <div className="homepage-with-user-content">
              <div className="homepage-with-user-toprow">
                <div className="user-container">
                  <img className="user-image" alt="user" />
                  <div className="user-container-text">
                    <h1 className="user-hello">Hello {this.props.currentUser.username}! </h1>
                    <h3 className="subtitle" id="lets-learn">Let&apos;s learn music!</h3>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="badges-progress">
                    <div className="number" id="badges-number"> {this.props.currentUser.badges.length} </div>
                    <div className="subtitle">badges <br /> achieved </div>
                  </div>
                  <div className="line" />
                  <div className="lessons-progress">
                    <div className="number" id="lessons-number"> {this.props.currentUser.completed.length} </div>
                    <div className="subtitle">lessons <br /> completed </div>
                  </div>
                </div>
              </div>
              <div className="homepage-with-user-bottomrow">
                <div className="lessons-flex">
                  <h2 className="title" id="lessons-title">Lessons</h2>
                  <div className="lessons-subtitles">
                    <h3 className="subtitle" id="lessons-all" style={{ color: '#E46161' }}>All</h3>
                    <h3 className="subtitle" id="lessons-completed" onClick={this.showCompleted}>Completed</h3>
                  </div>
                  <LessonList className="lessons" />
                </div>
                <div className="badges-flex">
                  <h2 className="title" id="badges-title">Your Badges</h2>
                  <div className="badge-container">{this.badgeRender()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps, { getUserInfo })(HomePageWithUser);

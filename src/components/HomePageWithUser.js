/* eslint-disable array-callback-return */
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

  userIcon = () => {
    let src = '';
    console.log(this.props.currentUser);
    switch (this.props.currentUser.icon) {
      case 0:
        src = 'https://aptitune.s3.amazonaws.com/eighth+note.png';
        break;
      case 1:
        src = 'https://aptitune.s3.amazonaws.com/sixteenth+note.png';
        break;
      case 2:
        src = 'https://aptitune.s3.amazonaws.com/half+note.png';
        break;
      case 3:
        src = 'https://aptitune.s3.amazonaws.com/whole+note.png';
        break;
      default:
        src = 'https://aptitune.s3.amazonaws.com/whole+note.png';
        break;
    }
    return (
      <img src={src} id="user-icon" className="user" alt="user-icon" />
    );
  }

  badgeRender = () => {
    console.log('Badge render called');
    if (this.props.currentUser.badges.length !== 0) {
      return (
        <div>
          <div className="badge-title">none yet!</div>
          <img className="badge-image" src="https://aptitune.s3.amazonaws.com/badge+art+1.png" alt="badge-icon" />
        </div>
      );
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
                  <div className="user-icon-holder">{this.userIcon()}</div>
                  <div className="user-container-text">
                    <h1 className="user-hello">Hello, {this.props.currentUser.username}! </h1>
                    <h3 className="subtitle" id="lets-learn">Let&apos;s learn music!</h3>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="badges-progress">
                    <div className="number" id="badges-number"> {this.props.currentUser.badges.length - 1} </div>
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
                    <h3 className="subtitle" id="lessons-all" style={{ color: '#E46161' }} onClick={this.showAll}>All</h3>
                    <h3 className="subtitle" id="lessons-completed">Completed</h3>
                  </div>
                  <CompletedList className="lessons" />
                </div>
                <div className="badges-flex">
                  <h2 className="title" id="badges-title">Your Badges</h2>
                  <div className="badge-container">
                    <div className="badge-div">{this.props.currentUser.badges.map((badge) => {
                      console.log('rendering badge: ', badge);
                      if (badge.iconUrl === '' && this.props.currentUser.badges.length === 1) {
                        console.log('rendering: No badges yet!');
                        return (
                          <div id={badge.iconUrl}>
                            <div className="badge-title">{badge.name}</div>
                          </div>
                        );
                      } else if (badge.iconUrl !== '') {
                        return (
                          <div>
                            <div id={badge.iconUrl} className="badge-title">{badge.name}</div>
                            <img className="badge-image" src={badge.iconUrl} alt="badge-icon" />
                          </div>
                        );
                      }
                    })}
                    </div>
                  </div>
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
                  <div className="user-icon-holder">{this.userIcon()}</div>
                  <div className="user-container-text">
                    <h1 className="user-hello">Hello, {this.props.currentUser.username}! </h1>
                    <h3 className="subtitle" id="lets-learn">Let&apos;s learn music!</h3>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="badges-progress">
                    <div className="number" id="badges-number"> {this.props.currentUser.badges.length - 1 } </div>
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
                    <h3 className="subtitle" id="lessons-all">All</h3>
                    <h3 className="subtitle" id="lessons-completed" onClick={this.showCompleted} style={{ color: '#E46161' }}>Completed</h3>
                  </div>
                  <LessonList className="lessons" />
                </div>
                <div className="badges-flex">
                  <h2 className="title" id="badges-title">Your Badges</h2>
                  <div className="badge-container">
                    <div className="badge-div">{this.props.currentUser.badges.map((badge) => {
                      console.log('rendering badges in badgeRender');
                      if (badge.iconUrl === '' && this.props.currentUser.badges.length == 1) {
                        return (
                          <div id={badge.iconUrl}>
                            <div className="badge-title">{badge.name}</div>
                          </div>
                        );
                      } else if (badge.iconUrl !== '') {
                        return (
                          <div id={badge.iconUrl}>
                            <div className="badge-title">{badge.name}</div>
                            <img className="badge-image" src={badge.iconUrl} alt="badge-icon" />
                          </div>
                        );
                      }
                    })}
                    </div>
                  </div>
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

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson, updateUserInfo, getUserInfo } from '../../actions/index';
import NavBar from '../NavBar';
import FlatView from './Activities/FlatView';
import Listening from './Activities/Listening';
import RhythmSensor from './Activities/RhythmSensor';
import SingNotes from './Activities/SingNotes';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    lesson: reduxState.lesson,
    pages: reduxState.lesson.pages,
  };
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      title: '',
      description: '',
      content: '',
      exercise: '',
      activity: '',
      nextPage: '',
    };
  }

    componentDidMount = () => {
      // get userinfo
      this.props.getUserInfo();

      // get lesson info
      const id = localStorage.getItem('lesson');
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      console.log('Next from localStorage', pageNum);
      this.setState({ pageNumber: pageNum });
      this.setState({ nextPage: pageNum + 1 });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum);
    }

    goToNext = () => {
      console.log('GOTONEXTCALLED');
      if (this.props.pages.length > this.state.pageNumber + 1) {
        console.log('got inside');
        const local = parseInt(this.state.nextPage, 10);
        localStorage.setItem('next', local.toString());
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        // for now, redirect to home, and add this lessonID to completed!
        const id = localStorage.getItem('lesson');
        let { fields } = {};
        let completedLessons = this.props.currentUser.completed;
        if (this.props.currentUser.completed === undefined || this.props.currentUser.completed === []) {
          completedLessons = [id];
        } else if (!this.props.currentUser.completed.includes(id)) {
          console.log('result of includes', this.props.currentUser.completed.includes(id));
          completedLessons = this.props.currentUser.completed.concat(id);
        }

        // give badge
        let { badges } = this.props.currentUser.badges;
        console.log('PROPS:', this.props);
        console.log('LESSON', this.props.lesson);
        console.log('BADGE:', this.props.lesson.badge);
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
              badges = this.props.currentUser.badges.concat[this.props.lesson.badge];
            }
          }
        }
        fields = { completedLessons, badges };
        console.log('fields in goToNext: ', fields);
        const { history } = this.props;
        this.props.updateUserInfo(fields);
        history.push('/home');
        // set user info to add
      }
    }

    render() {
      // add page for rendering
      if (this.props.pages === null || this.props.pages === undefined || this.props.pages.length === 0) {
        return (
          <div>
            Loading...
          </div>
        );
      }
      const page = this.props.pages[this.state.pageNumber];
      console.log('page:', page);
      if (page.activity_type === 'FlatView') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content-container">
                  <img alt=" " className="suppContent" title="supplementaryContent" src={page.content.url} />
                </div>
              </div>
              <div className="page-bottom">
                <FlatView onSubmit={this.goToNext} />
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'Listening') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
              </div>
              <div className="page-bottom">
                <Listening onSubmit={this.goToNext} />
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'RhythmSensor') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
              </div>
              <div className="page-bottom">
                <div id="rhythmScore" />
                <RhythmSensor onSubmit={this.goToNext} />
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'SingNotes') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
              </div>
              <div className="page-bottom">
                <SingNotes onSubmit={this.goToNext} />
                <div id="sheetmusic"> </div>
                <div id="yournotes"> </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            Uh oh... this isnt a valid lesson
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson, updateUserInfo, getUserInfo })(Page));

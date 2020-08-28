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
      // console.log('this.props.pages.length', this.props.pages.length);
      if (this.props.pages.length > this.state.pageNumber + 1) {
        console.log('got inside');
        const local = parseInt(this.state.nextPage, 10);
        localStorage.setItem('next', local.toString());
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        // for now, redirect to home....
        const id = localStorage.getItem('lesson');
        let { fields } = {};
        if (this.props.currentUser.completed === undefined || this.props.currentUser.completed === []) {
          fields = { completedLessons: [id] };
        } else if (!this.props.currentUser.completed.includes(id)) {
          console.log('result of includes', this.props.currentUser.completed.includes(id));
          fields = { completedLessons: this.props.currentUser.completed.concat(id) };
        }
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
          <div>
            <RhythmSensor />
          </div>
        );
      } else {
        return (
          <div>
            No lesson found...
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson, updateUserInfo, getUserInfo })(Page));
